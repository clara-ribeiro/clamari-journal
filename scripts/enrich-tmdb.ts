/**
 * Resolve TMDB ids + poster paths + season/episode counts for imported entries
 * (requires TMDB_ACCESS_TOKEN).
 *
 * Usage:
 *   npx tsx scripts/enrich-tmdb.ts
 *
 * Updates src/data/series.json (via tvdbId) and src/data/movies.json (via title search).
 * Safe to re-run — fills missing ids/posters and refreshes series season/episode counts.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const TMDB_BASE = "https://api.themoviedb.org/3";

type SeriesEntry = {
  tvdbId: number;
  tmdbId?: number;
  posterPath?: string;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  title: string;
  [key: string]: unknown;
};

type MovieEntry = {
  tmdbId?: number;
  posterPath?: string;
  title: string;
  releaseDate?: string;
  [key: string]: unknown;
};

type TmdbMatch = {
  id: number;
  poster_path: string | null;
};

type TmdbTvDetail = {
  poster_path: string | null;
  number_of_seasons: number;
  number_of_episodes: number;
};

function loadEnvLocal() {
  const envPath = resolve(ROOT, ".env.local");
  try {
    const text = readFileSync(envPath, "utf-8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // optional
  }
}

async function tmdb<T>(path: string): Promise<T> {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) throw new Error("TMDB_ACCESS_TOKEN is required");

  const res = await fetch(`${TMDB_BASE}${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`TMDB ${res.status} ${path}`);
  return res.json() as Promise<T>;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function applyMatch(entry: { tmdbId?: number; posterPath?: string }, match: TmdbMatch) {
  let changed = false;
  if (!entry.tmdbId) {
    entry.tmdbId = match.id;
    changed = true;
  }
  if (!entry.posterPath && match.poster_path) {
    entry.posterPath = match.poster_path;
    changed = true;
  }
  return changed;
}

function applyTvDetail(entry: SeriesEntry, detail: TmdbTvDetail) {
  let changed = false;
  if (!entry.posterPath && detail.poster_path) {
    entry.posterPath = detail.poster_path;
    changed = true;
  }
  if (
    Number.isInteger(detail.number_of_seasons) &&
    detail.number_of_seasons >= 1 &&
    entry.numberOfSeasons !== detail.number_of_seasons
  ) {
    entry.numberOfSeasons = detail.number_of_seasons;
    changed = true;
  }
  if (
    Number.isInteger(detail.number_of_episodes) &&
    detail.number_of_episodes >= 1 &&
    entry.numberOfEpisodes !== detail.number_of_episodes
  ) {
    entry.numberOfEpisodes = detail.number_of_episodes;
    changed = true;
  }
  return changed;
}

async function enrichSeries() {
  const path = resolve(ROOT, "src/data/series.json");
  const series = JSON.parse(readFileSync(path, "utf-8")) as SeriesEntry[];
  let updated = 0;
  const claimedTmdbIds = new Set(
    series.map((entry) => entry.tmdbId).filter((id): id is number => id != null),
  );

  for (const entry of series) {
    try {
      if (!entry.tmdbId) {
        const data = await tmdb<{ tv_results: TmdbMatch[] }>(
          `/find/${entry.tvdbId}?external_source=tvdb_id&language=en-US`,
        );
        const match = data.tv_results[0];
        if (match && claimedTmdbIds.has(match.id)) {
          console.warn(
            `series skip duplicate tmdbId ${match.id}: ${entry.title} (tvdb ${entry.tvdbId})`,
          );
        } else if (match && applyMatch(entry, match)) {
          claimedTmdbIds.add(match.id);
          updated += 1;
          console.log(`series ${entry.title} → ${match.id}`);
        } else if (!match) {
          console.warn(`series no match: ${entry.title} (tvdb ${entry.tvdbId})`);
        }
      }

      if (entry.tmdbId) {
        const needsCounts =
          entry.numberOfSeasons === undefined ||
          entry.numberOfEpisodes === undefined;
        const needsPoster = !entry.posterPath;
        if (needsCounts || needsPoster) {
          const detail = await tmdb<TmdbTvDetail>(
            `/tv/${entry.tmdbId}?language=en-US`,
          );
          if (applyTvDetail(entry, detail)) {
            updated += 1;
            console.log(
              `series counts ${entry.title} → S${detail.number_of_seasons}/E${detail.number_of_episodes}`,
            );
          }
        }
      }
    } catch (error) {
      console.warn(`series fail: ${entry.title}`, error);
    }
    await sleep(120);
  }

  writeFileSync(path, JSON.stringify(series, null, 2) + "\n");
  console.log(`Series enriched: ${updated}`);
}

async function enrichMovies() {
  const path = resolve(ROOT, "src/data/movies.json");
  const movies = JSON.parse(readFileSync(path, "utf-8")) as MovieEntry[];
  let updated = 0;

  for (const entry of movies) {
    if (entry.tmdbId && entry.posterPath) continue;
    try {
      if (entry.tmdbId && !entry.posterPath) {
        const detail = await tmdb<{ poster_path: string | null }>(
          `/movie/${entry.tmdbId}?language=en-US`,
        );
        if (detail.poster_path) {
          entry.posterPath = detail.poster_path;
          updated += 1;
          console.log(`movie poster ${entry.title} → ${detail.poster_path}`);
        }
      } else {
        const params = new URLSearchParams({
          query: entry.title,
          language: "en-US",
        });
        if (entry.releaseDate) {
          params.set("primary_release_year", entry.releaseDate.slice(0, 4));
        }
        const data = await tmdb<{ results: TmdbMatch[] }>(
          `/search/movie?${params}`,
        );
        const match = data.results[0];
        if (match && applyMatch(entry, match)) {
          updated += 1;
          console.log(`movie ${entry.title} → ${match.id}`);
        } else if (!match) {
          console.warn(`movie no match: ${entry.title}`);
        }
      }
    } catch (error) {
      console.warn(`movie fail: ${entry.title}`, error);
    }
    await sleep(250);
  }

  writeFileSync(path, JSON.stringify(movies, null, 2) + "\n");
  console.log(`Movies enriched: ${updated}`);
}

async function main() {
  loadEnvLocal();
  const seriesOnly = process.argv.includes("--series-only");
  await enrichSeries();
  if (!seriesOnly) {
    await enrichMovies();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
