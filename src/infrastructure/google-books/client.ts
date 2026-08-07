import "server-only";

/**
 * Google Books API client + normalized metadata adapter (server-side only).
 * GOOGLE_BOOKS_API_KEY is optional for low-volume public queries and never
 * exposed to the client.
 */

import type {
  GoogleBooksMetadata,
  GoogleBooksSearchMode,
  GoogleBooksSearchPage,
} from "@/application/dto/google-books-metadata";
import {
  GOOGLE_BOOKS_BASE_URL,
  GOOGLE_BOOKS_DETAIL_REVALIDATE_SECONDS,
  GOOGLE_BOOKS_REQUEST_TIMEOUT_MS,
  GOOGLE_BOOKS_SEARCH_MAX_RESULTS,
  GOOGLE_BOOKS_SEARCH_REVALIDATE_SECONDS,
} from "./config";
import {
  GoogleBooksError,
  googleBooksErrorFromHttpStatus,
  googleBooksErrorFromUnknown,
} from "./errors";
import {
  normalizeSearchPage,
  normalizeVolume,
  withPersonalPageCount,
} from "./normalize";
import type {
  GoogleBooksRawSearchResponse,
  GoogleBooksRawVolume,
} from "./raw";

export { GoogleBooksError } from "./errors";
export type { GoogleBooksErrorCode } from "./errors";
export {
  GOOGLE_BOOKS_DETAIL_REVALIDATE_SECONDS,
  GOOGLE_BOOKS_SEARCH_REVALIDATE_SECONDS,
} from "./config";
export {
  coverUrlFromVolumeId,
  selectCoverUrl,
  toSecureCoverUrl,
  withPersonalPageCount,
} from "./normalize";

type GoogleBooksCacheKind = "search" | "detail";

function buildSearchQuery(mode: GoogleBooksSearchMode, value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new GoogleBooksError(
      "invalid_query",
      "Google Books search query must not be empty",
    );
  }

  switch (mode) {
    case "title":
      return `intitle:${trimmed}`;
    case "author":
      return `inauthor:${trimmed}`;
    case "isbn": {
      const compact = trimmed.replace(/[-\s]/g, "");
      if (!compact) {
        throw new GoogleBooksError(
          "invalid_query",
          "Google Books ISBN search query must not be empty",
        );
      }
      return `isbn:${compact}`;
    }
    case "query":
    default:
      return trimmed;
  }
}

async function googleBooksFetch<T>(
  path: string,
  kind: GoogleBooksCacheKind,
  init?: RequestInit,
): Promise<T> {
  const url = new URL(`${GOOGLE_BOOKS_BASE_URL}${path}`);
  const key = process.env.GOOGLE_BOOKS_API_KEY?.trim();
  if (key) {
    url.searchParams.set("key", key);
  }

  const revalidate =
    kind === "search"
      ? GOOGLE_BOOKS_SEARCH_REVALIDATE_SECONDS
      : GOOGLE_BOOKS_DETAIL_REVALIDATE_SECONDS;

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    GOOGLE_BOOKS_REQUEST_TIMEOUT_MS,
  );

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
    const response = await fetch(url.toString(), {
      ...init,
      signal: controller.signal,
      next: {
        revalidate,
        tags: [`google-books:${kind}`],
      },
    });

    if (!response.ok) {
      throw googleBooksErrorFromHttpStatus(response.status);
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new GoogleBooksError(
        "bad_response",
        "Google Books returned malformed JSON",
      );
    }
  } catch (error) {
    throw googleBooksErrorFromUnknown(error);
  } finally {
    clearTimeout(timeout);
  }
}

async function searchVolumes(
  mode: GoogleBooksSearchMode,
  value: string,
): Promise<GoogleBooksSearchPage> {
  const params = new URLSearchParams({
    q: buildSearchQuery(mode, value),
    maxResults: String(GOOGLE_BOOKS_SEARCH_MAX_RESULTS),
    printType: "books",
  });
  const raw = await googleBooksFetch<GoogleBooksRawSearchResponse>(
    `/volumes?${params}`,
    "search",
  );
  return normalizeSearchPage(raw);
}

/** Free-text search across Google Books volumes. */
export async function searchBooks(query: string): Promise<GoogleBooksSearchPage> {
  return searchVolumes("query", query);
}

export async function searchBooksByTitle(
  title: string,
): Promise<GoogleBooksSearchPage> {
  return searchVolumes("title", title);
}

export async function searchBooksByAuthor(
  author: string,
): Promise<GoogleBooksSearchPage> {
  return searchVolumes("author", author);
}

export async function searchBooksByIsbn(
  isbn: string,
): Promise<GoogleBooksSearchPage> {
  return searchVolumes("isbn", isbn);
}

export async function getBookById(
  id: string,
  options?: { customPageCount?: number | null },
): Promise<GoogleBooksMetadata> {
  const volumeId = id.trim();
  if (!volumeId) {
    throw new GoogleBooksError(
      "invalid_query",
      "Google Books volume id must not be empty",
    );
  }

  const raw = await googleBooksFetch<GoogleBooksRawVolume>(
    `/volumes/${encodeURIComponent(volumeId)}`,
    "detail",
  );
  return withPersonalPageCount(normalizeVolume(raw), options?.customPageCount);
}
