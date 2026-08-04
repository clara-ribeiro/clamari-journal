/**
 * Resolve TMDB ids for imported entries (requires TMDB_ACCESS_TOKEN).
 *
 * Usage:
 *   npx tsx scripts/enrich-tmdb.ts
 *
 * Updates src/data/series.json (via tvdbId) and src/data/movies.json (via title search).
 * Safe to re-run — only fills missing tmdbId fields.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const TMDB_BASE = "https://api.themoviedb.org/3";

type SeriesEntry = {
  tvdbId: number;
  tmdbId?: number;
  title: string;
  [key: string]: unknown;
};

type MovieEntry = {
  tmdbId?: number;
  title: string;
  releaseDate?: string;
  [key: string]: unknown;
};

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

async function enrichSeries() {
  const path = resolve(ROOT, "src/data/series.json");
  const series = JSON.parse(readFileSync(path, "utf-8")) as SeriesEntry[];
  let updated = 0;

  for (const entry of series) {
    if (entry.tmdbId) continue;
    try {
      const data = await tmdb<{ tv_results: Array<{ id: number }> }>(
        `/find/${entry.tvdbId}?external_source=tvdb_id&language=en-US`,
      );
      const id = data.tv_results[0]?.id;
      if (id) {
        entry.tmdbId = id;
        updated += 1;
        console.log(`series ${entry.title} → ${id}`);
      } else {
        console.warn(`series no match: ${entry.title} (tvdb ${entry.tvdbId})`);
      }
    } catch (error) {
      console.warn(`series fail: ${entry.title}`, error);
    }
    await sleep(250);
  }

  writeFileSync(path, JSON.stringify(series, null, 2) + "\n");
  console.log(`Series enriched: ${updated}`);
}

async function enrichMovies() {
  const path = resolve(ROOT, "src/data/movies.json");
  const movies = JSON.parse(readFileSync(path, "utf-8")) as MovieEntry[];
  let updated = 0;

  for (const entry of movies) {
    if (entry.tmdbId) continue;
    try {
      const params = new URLSearchParams({
        query: entry.title,
        language: "en-US",
      });
      if (entry.releaseDate) {
        params.set("year", entry.releaseDate.slice(0, 4));
      }
      const data = await tmdb<{ results: Array<{ id: number; title: string }> }>(
        `/search/movie?${params}`,
      );
      const id = data.results[0]?.id;
      if (id) {
        entry.tmdbId = id;
        updated += 1;
        console.log(`movie ${entry.title} → ${id}`);
      } else {
        console.warn(`movie no match: ${entry.title}`);
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
  await enrichSeries();
  await enrichMovies();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
