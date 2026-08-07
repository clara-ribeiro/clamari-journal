/**
 * TMDB adapter configuration.
 *
 * Language defaults to English (`en-US`). Override with `TMDB_LANGUAGE`
 * (e.g. `pt-BR`) — applied to search and detail requests.
 */

export const TMDB_BASE_URL = "https://api.themoviedb.org/3";

/** Default ISO 639-1 + region used when `TMDB_LANGUAGE` is unset. */
export const TMDB_DEFAULT_LANGUAGE = "en-US";

/** Abort in-flight provider calls after this many milliseconds. */
export const TMDB_REQUEST_TIMEOUT_MS = 10_000;

/** Detail / season / find: cache for one day. */
export const TMDB_DETAIL_REVALIDATE_SECONDS = 60 * 60 * 24;

/** Search: shorter TTL — queries are more volatile than stable ids. */
export const TMDB_SEARCH_REVALIDATE_SECONDS = 60 * 60;

export const TMDB_PRINCIPAL_CAST_LIMIT = 12;

export function getTmdbLanguage(): string {
  const configured = process.env.TMDB_LANGUAGE?.trim();
  return configured && configured.length > 0
    ? configured
    : TMDB_DEFAULT_LANGUAGE;
}
