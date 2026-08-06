import "server-only";

/**
 * TMDB API client (server-side only).
 * Requires TMDB_ACCESS_TOKEN in environment variables.
 */

import { tmdbImageUrl } from "@/lib/tmdb-image";

export { tmdbImageUrl };

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function getAccessToken(): string {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) {
    throw new Error("TMDB_ACCESS_TOKEN is not configured");
  }
  return token;
}

async function tmdbFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${TMDB_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
      ...init?.headers,
    },
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status} ${path}`);
  }

  return response.json() as Promise<T>;
}

export type TmdbSearchResult = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  overview: string;
};

export type TmdbPagedResponse<T> = {
  page: number;
  results: T[];
  total_results: number;
  total_pages: number;
};

export async function searchMovies(query: string) {
  const params = new URLSearchParams({ query, language: "en-US" });
  return tmdbFetch<TmdbPagedResponse<TmdbSearchResult>>(
    `/search/movie?${params}`,
  );
}

export async function searchSeries(query: string) {
  const params = new URLSearchParams({ query, language: "en-US" });
  return tmdbFetch<TmdbPagedResponse<TmdbSearchResult>>(
    `/search/tv?${params}`,
  );
}

export async function getMovieById(id: number) {
  const params = new URLSearchParams({
    language: "en-US",
    append_to_response: "credits,videos",
  });
  return tmdbFetch(`/movie/${id}?${params}`);
}

export async function getSeriesById(id: number) {
  const params = new URLSearchParams({
    language: "en-US",
    append_to_response: "credits,videos",
  });
  return tmdbFetch(`/tv/${id}?${params}`);
}

export async function getSeason(seriesId: number, seasonNumber: number) {
  const params = new URLSearchParams({ language: "en-US" });
  return tmdbFetch(`/tv/${seriesId}/season/${seasonNumber}?${params}`);
}

/** Resolve TheTVDB id → TMDB TV id */
export async function findSeriesByTvdbId(tvdbId: number) {
  const params = new URLSearchParams({
    external_source: "tvdb_id",
    language: "en-US",
  });
  return tmdbFetch<{ tv_results: Array<{ id: number; name: string }> }>(
    `/find/${tvdbId}?${params}`,
  );
}
