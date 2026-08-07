/**
 * Google Books adapter configuration.
 * `GOOGLE_BOOKS_API_KEY` is optional for low-volume public queries and stays server-side.
 */

export const GOOGLE_BOOKS_BASE_URL = "https://www.googleapis.com/books/v1";

/** Abort in-flight provider calls after this many milliseconds. */
export const GOOGLE_BOOKS_REQUEST_TIMEOUT_MS = 10_000;

/** Volume detail: cache for one day. */
export const GOOGLE_BOOKS_DETAIL_REVALIDATE_SECONDS = 60 * 60 * 24;

/** Search: shorter TTL — queries are more volatile than stable volume ids. */
export const GOOGLE_BOOKS_SEARCH_REVALIDATE_SECONDS = 60 * 60;

export const GOOGLE_BOOKS_SEARCH_MAX_RESULTS = 20;
