import "server-only";

/**
 * TMDB API client + normalized metadata adapter (server-side only).
 * Requires TMDB_ACCESS_TOKEN. Optional TMDB_LANGUAGE (default en-US).
 */

import type {
  TmdbMovieMetadata,
  TmdbSearchPage,
  TmdbSeasonMetadata,
  TmdbSeriesMetadata,
  TmdbTvdbLookup,
} from "@/application/dto/tmdb-metadata";
import { tmdbImageUrl } from "@/lib/tmdb-image";
import {
  getTmdbLanguage,
  TMDB_BASE_URL,
  TMDB_DETAIL_REVALIDATE_SECONDS,
  TMDB_REQUEST_TIMEOUT_MS,
  TMDB_SEARCH_REVALIDATE_SECONDS,
} from "./config";
import {
  TmdbError,
  tmdbErrorFromHttpStatus,
  tmdbErrorFromUnknown,
} from "./errors";
import {
  normalizeMovie,
  normalizeSearchPage,
  normalizeSeason,
  normalizeSeries,
  normalizeTvdbLookup,
} from "./normalize";
import type {
  TmdbRawFindResponse,
  TmdbRawMovie,
  TmdbRawPagedResponse,
  TmdbRawSearchResult,
  TmdbRawSeason,
  TmdbRawSeries,
} from "./raw";

export { tmdbImageUrl };
export { TmdbError } from "./errors";
export type { TmdbErrorCode } from "./errors";
export {
  TMDB_DEFAULT_LANGUAGE,
  TMDB_DETAIL_REVALIDATE_SECONDS,
  TMDB_SEARCH_REVALIDATE_SECONDS,
  getTmdbLanguage,
} from "./config";

type TmdbCacheKind = "search" | "detail";

function getAccessToken(): string {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) {
    throw new TmdbError(
      "not_configured",
      "TMDB_ACCESS_TOKEN is not configured",
    );
  }
  return token;
}

async function tmdbFetch<T>(
  path: string,
  kind: TmdbCacheKind,
  init?: RequestInit,
): Promise<T> {
  const revalidate =
    kind === "search"
      ? TMDB_SEARCH_REVALIDATE_SECONDS
      : TMDB_DETAIL_REVALIDATE_SECONDS;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TMDB_REQUEST_TIMEOUT_MS);

  if (init?.signal) {
    if (init.signal.aborted) {
      controller.abort();
    } else {
      init.signal.addEventListener("abort", () => controller.abort(), {
        once: true,
      });
    }
  }

  try {
    const response = await fetch(`${TMDB_BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
        ...init?.headers,
      },
      next: {
        revalidate,
        tags: [`tmdb:${kind}`],
      },
    });

    if (!response.ok) {
      throw tmdbErrorFromHttpStatus(response.status);
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new TmdbError("bad_response", "TMDB returned malformed JSON");
    }
  } catch (error) {
    throw tmdbErrorFromUnknown(error);
  } finally {
    clearTimeout(timeout);
  }
}

function languageParams(
  extra?: Record<string, string>,
  language?: string,
): URLSearchParams {
  return new URLSearchParams({
    language: language?.trim() || getTmdbLanguage(),
    ...extra,
  });
}

export async function searchMovies(query: string): Promise<TmdbSearchPage> {
  const params = languageParams({ query });
  const raw = await tmdbFetch<TmdbRawPagedResponse<TmdbRawSearchResult>>(
    `/search/movie?${params}`,
    "search",
  );
  return normalizeSearchPage(raw);
}

export async function searchSeries(query: string): Promise<TmdbSearchPage> {
  const params = languageParams({ query });
  const raw = await tmdbFetch<TmdbRawPagedResponse<TmdbRawSearchResult>>(
    `/search/tv?${params}`,
    "search",
  );
  return normalizeSearchPage(raw);
}

export async function getMovieById(
  id: number,
  language?: string,
): Promise<TmdbMovieMetadata> {
  const params = languageParams(
    { append_to_response: "credits,videos" },
    language,
  );
  const raw = await tmdbFetch<TmdbRawMovie>(`/movie/${id}?${params}`, "detail");
  return normalizeMovie(raw);
}

export async function getSeriesById(
  id: number,
  language?: string,
): Promise<TmdbSeriesMetadata> {
  const params = languageParams(
    { append_to_response: "credits,videos" },
    language,
  );
  const raw = await tmdbFetch<TmdbRawSeries>(`/tv/${id}?${params}`, "detail");
  return normalizeSeries(raw);
}

export async function getSeason(
  seriesId: number,
  seasonNumber: number,
  language?: string,
): Promise<TmdbSeasonMetadata> {
  const params = languageParams(undefined, language);
  const raw = await tmdbFetch<TmdbRawSeason>(
    `/tv/${seriesId}/season/${seasonNumber}?${params}`,
    "detail",
  );
  return normalizeSeason(raw, seriesId);
}

/** Resolve TheTVDB id → TMDB TV id (null when TMDB has no match). */
export async function findSeriesByTvdbId(
  tvdbId: number,
): Promise<TmdbTvdbLookup | null> {
  const params = languageParams({ external_source: "tvdb_id" });
  const raw = await tmdbFetch<TmdbRawFindResponse>(
    `/find/${tvdbId}?${params}`,
    "detail",
  );
  return normalizeTvdbLookup(raw);
}
