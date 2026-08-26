import type {
  BookEntry,
  BookFormat,
  BookQuote,
  BookStatus,
  Goals,
  MovieEntry,
  MovieStatus,
  ReadingUpdate,
  SeriesEntry,
  SeriesStatus,
  WatchedEpisode,
} from "@/domain/entities";
import type { RatingValue } from "@/domain/value-objects/rating";
import { isValidRating } from "@/domain/value-objects/rating";

const MOVIE_STATUSES = [
  "watchlist",
  "watched",
  "rewatch",
] as const satisfies readonly MovieStatus[];

const SERIES_STATUSES = [
  "watchlist",
  "watching",
  "up-to-date",
  "paused",
  "completed",
  "abandoned",
] as const satisfies readonly SeriesStatus[];

const BOOK_STATUSES = [
  "want-to-read",
  "reading",
  "paused",
  "finished",
  "abandoned",
] as const satisfies readonly BookStatus[];

const BOOK_FORMATS = [
  "physical",
  "ebook",
  "audiobook",
] as const satisfies readonly BookFormat[];

const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function fail(path: string, message: string): never {
  throw new Error(`Invalid JSON at ${path}: ${message}`);
}

function requireString(
  record: Record<string, unknown>,
  key: string,
  path: string,
) {
  const value = record[key];
  if (typeof value !== "string" || value.length === 0) {
    fail(path, `expected non-empty string "${key}"`);
  }
  return value;
}

function optionalString(
  record: Record<string, unknown>,
  key: string,
  path: string,
) {
  const value = record[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    fail(path, `"${key}" must be a string when present`);
  }
  return value;
}

function optionalBoolean(
  record: Record<string, unknown>,
  key: string,
  path: string,
) {
  const value = record[key];
  if (value === undefined) return undefined;
  if (typeof value !== "boolean") {
    fail(path, `"${key}" must be a boolean when present`);
  }
  return value;
}

function optionalNumber(
  record: Record<string, unknown>,
  key: string,
  path: string,
) {
  const value = record[key];
  if (value === undefined) return undefined;
  if (typeof value !== "number" || Number.isNaN(value)) {
    fail(path, `"${key}" must be a number when present`);
  }
  return value;
}

function optionalNonNegativeNumber(
  record: Record<string, unknown>,
  key: string,
  path: string,
) {
  const value = optionalNumber(record, key, path);
  if (value === undefined) return undefined;
  if (value < 0) {
    fail(path, `"${key}" must be >= 0`);
  }
  return value;
}

function optionalPositiveInteger(
  record: Record<string, unknown>,
  key: string,
  path: string,
) {
  const value = optionalNumber(record, key, path);
  if (value === undefined) return undefined;
  if (!Number.isInteger(value) || value < 1) {
    fail(path, `"${key}" must be an integer >= 1`);
  }
  return value;
}

function requirePositiveInteger(
  record: Record<string, unknown>,
  key: string,
  path: string,
) {
  const value = optionalPositiveInteger(record, key, path);
  if (value === undefined) {
    fail(path, `"${key}" is required`);
  }
  return value;
}

function optionalStringArray(
  record: Record<string, unknown>,
  key: string,
  path: string,
) {
  const value = record[key];
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    fail(path, `"${key}" must be a string array when present`);
  }
  return value as string[];
}

function optionalRating(
  record: Record<string, unknown>,
  path: string,
): RatingValue | undefined {
  const value = optionalNumber(record, "rating", path);
  if (value === undefined) return undefined;
  if (!isValidRating(value)) {
    fail(path, `rating must be a whole-star value from 1 to 5`);
  }
  return value;
}

function requireOneOf<T extends string>(
  record: Record<string, unknown>,
  key: string,
  path: string,
  allowed: readonly T[],
): T {
  const value = requireString(record, key, path);
  if (!(allowed as readonly string[]).includes(value)) {
    fail(
      path,
      `"${key}" must be one of ${allowed.map((item) => `"${item}"`).join(", ")}`,
    );
  }
  return value as T;
}

function optionalOneOf<T extends string>(
  record: Record<string, unknown>,
  key: string,
  path: string,
  allowed: readonly T[],
): T | undefined {
  const value = optionalString(record, key, path);
  if (value === undefined) return undefined;
  if (value.length === 0) {
    fail(path, `"${key}" must be non-empty when present`);
  }
  if (!(allowed as readonly string[]).includes(value)) {
    fail(
      path,
      `"${key}" must be one of ${allowed.map((item) => `"${item}"`).join(", ")}`,
    );
  }
  return value as T;
}

/** Calendar date as `YYYY-MM-DD` within a sane journal range. */
export function parseIsoDate(value: string, path: string): string {
  const match = ISO_DATE_RE.exec(value);
  if (!match) {
    fail(path, `expected ISO date YYYY-MM-DD`);
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < MIN_YEAR || year > MAX_YEAR) {
    fail(path, `year must be between ${MIN_YEAR} and ${MAX_YEAR}`);
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    fail(path, `not a valid calendar date`);
  }
  return value;
}

function optionalIsoDate(
  record: Record<string, unknown>,
  key: string,
  path: string,
) {
  const value = optionalString(record, key, path);
  if (value === undefined) return undefined;
  return parseIsoDate(value, `${path}.${key}`);
}

function optionalIsoDateArray(
  record: Record<string, unknown>,
  key: string,
  path: string,
) {
  const values = optionalStringArray(record, key, path);
  if (values === undefined) return undefined;
  return values.map((value, index) =>
    parseIsoDate(value, `${path}.${key}[${index}]`),
  );
}

function assertChronology(
  start: string | undefined,
  end: string | undefined,
  path: string,
  startKey: string,
  endKey: string,
) {
  if (start === undefined || end === undefined) return;
  if (start > end) {
    fail(path, `"${startKey}" must be on or before "${endKey}"`);
  }
}

function assertUniqueKeys(
  label: string,
  values: Array<{ path: string; value: string | number }>,
) {
  const seen = new Map<string | number, string>();
  for (const entry of values) {
    const previous = seen.get(entry.value);
    if (previous !== undefined) {
      fail(
        entry.path,
        `duplicate ${label} "${entry.value}" (also at ${previous})`,
      );
    }
    seen.set(entry.value, entry.path);
  }
}

function parseWatchedEpisode(
  value: unknown,
  path: string,
): WatchedEpisode {
  if (!isRecord(value)) {
    fail(path, `must be an object`);
  }
  const season = requirePositiveInteger(value, "season", path);
  const episode = requirePositiveInteger(value, "episode", path);
  return {
    season,
    episode,
    watchedAt: optionalIsoDate(value, "watchedAt", path),
    runtimeMinutes: optionalNonNegativeNumber(value, "runtimeMinutes", path),
    rating: optionalRating(value, path),
  };
}

function parseReadingUpdate(value: unknown, path: string): ReadingUpdate {
  if (!isRecord(value)) {
    fail(path, `must be an object`);
  }
  return {
    date: parseIsoDate(requireString(value, "date", path), `${path}.date`),
    page: optionalNonNegativeNumber(value, "page", path),
    note: optionalString(value, "note", path),
  };
}

function parseBookQuote(value: unknown, path: string): BookQuote {
  if (!isRecord(value)) {
    fail(path, `must be an object`);
  }
  return {
    text: requireString(value, "text", path),
    page: optionalNonNegativeNumber(value, "page", path),
    note: optionalString(value, "note", path),
  };
}

function assertPageProgress(
  path: string,
  currentPage: number | undefined,
  customPageCount: number | undefined,
  readingHistory: ReadingUpdate[] | undefined,
  quotes: BookQuote[] | undefined,
) {
  if (
    currentPage !== undefined &&
    customPageCount !== undefined &&
    currentPage > customPageCount
  ) {
    fail(
      path,
      `"currentPage" (${currentPage}) cannot exceed "customPageCount" (${customPageCount})`,
    );
  }

  for (const [index, update] of (readingHistory ?? []).entries()) {
    if (
      update.page !== undefined &&
      customPageCount !== undefined &&
      update.page > customPageCount
    ) {
      fail(
        `${path}.readingHistory[${index}]`,
        `"page" (${update.page}) cannot exceed "customPageCount" (${customPageCount})`,
      );
    }
  }

  for (const [index, quote] of (quotes ?? []).entries()) {
    if (
      quote.page !== undefined &&
      customPageCount !== undefined &&
      quote.page > customPageCount
    ) {
      fail(
        `${path}.quotes[${index}]`,
        `"page" (${quote.page}) cannot exceed "customPageCount" (${customPageCount})`,
      );
    }
  }
}

export function parseMovieEntries(data: unknown): MovieEntry[] {
  if (!Array.isArray(data)) {
    throw new Error("movies.json must be an array");
  }

  const entries = data.map((item, index) => {
    if (!isRecord(item)) {
      fail(`movies.json[${index}]`, `must be an object`);
    }
    const path = `movies.json[${index}]`;
    const tmdbId = optionalPositiveInteger(item, "tmdbId", path);
    const runtimeMinutes = optionalNonNegativeNumber(
      item,
      "runtimeMinutes",
      path,
    );

    return {
      tmdbId,
      posterPath: optionalString(item, "posterPath", path),
      tvtimeUuid: optionalString(item, "tvtimeUuid", path),
      slug: requireString(item, "slug", path),
      title: requireString(item, "title", path),
      status: requireOneOf(item, "status", path, MOVIE_STATUSES),
      rating: optionalRating(item, path),
      favorite: optionalBoolean(item, "favorite", path),
      watchedDates: optionalIsoDateArray(item, "watchedDates", path),
      tags: optionalStringArray(item, "tags", path),
      watchLocation: optionalString(item, "watchLocation", path),
      streamingService: optionalString(item, "streamingService", path),
      reviewSlug: optionalString(item, "reviewSlug", path),
      releaseDate: optionalIsoDate(item, "releaseDate", path),
      runtimeMinutes,
    } satisfies MovieEntry;
  });

  assertUniqueKeys(
    "slug",
    entries.map((entry, index) => ({
      path: `movies.json[${index}]`,
      value: entry.slug,
    })),
  );
  assertUniqueKeys(
    "tvtimeUuid",
    entries.flatMap((entry, index) =>
      entry.tvtimeUuid
        ? [{ path: `movies.json[${index}]`, value: entry.tvtimeUuid }]
        : [],
    ),
  );
  assertUniqueKeys(
    "tmdbId",
    entries.flatMap((entry, index) =>
      entry.tmdbId !== undefined
        ? [{ path: `movies.json[${index}]`, value: entry.tmdbId }]
        : [],
    ),
  );

  return entries;
}

export function parseSeriesEntries(data: unknown): SeriesEntry[] {
  if (!Array.isArray(data)) {
    throw new Error("series.json must be an array");
  }

  const entries = data.map((item, index) => {
    if (!isRecord(item)) {
      fail(`series.json[${index}]`, `must be an object`);
    }
    const path = `series.json[${index}]`;
    const watchedEpisodesRaw = item.watchedEpisodes;
    if (!Array.isArray(watchedEpisodesRaw)) {
      fail(path, `"watchedEpisodes" must be an array`);
    }

    const watchedEpisodes = watchedEpisodesRaw.map((episode, episodeIndex) =>
      parseWatchedEpisode(
        episode,
        `${path}.watchedEpisodes[${episodeIndex}]`,
      ),
    );

    const startedAt = optionalIsoDate(item, "startedAt", path);
    const finishedAt = optionalIsoDate(item, "finishedAt", path);
    assertChronology(startedAt, finishedAt, path, "startedAt", "finishedAt");

    return {
      tmdbId: optionalPositiveInteger(item, "tmdbId", path),
      posterPath: optionalString(item, "posterPath", path),
      numberOfSeasons: optionalPositiveInteger(item, "numberOfSeasons", path),
      numberOfEpisodes: optionalPositiveInteger(item, "numberOfEpisodes", path),
      tvdbId: requirePositiveInteger(item, "tvdbId", path),
      slug: requireString(item, "slug", path),
      title: requireString(item, "title", path),
      status: requireOneOf(item, "status", path, SERIES_STATUSES),
      rating: optionalRating(item, path),
      favorite: optionalBoolean(item, "favorite", path),
      startedAt,
      finishedAt,
      reviewSlug: optionalString(item, "reviewSlug", path),
      watchedEpisodes,
    } satisfies SeriesEntry;
  });

  assertUniqueKeys(
    "slug",
    entries.map((entry, index) => ({
      path: `series.json[${index}]`,
      value: entry.slug,
    })),
  );
  assertUniqueKeys(
    "tvdbId",
    entries.map((entry, index) => ({
      path: `series.json[${index}]`,
      value: entry.tvdbId,
    })),
  );
  assertUniqueKeys(
    "tmdbId",
    entries.flatMap((entry, index) =>
      entry.tmdbId !== undefined
        ? [{ path: `series.json[${index}]`, value: entry.tmdbId }]
        : [],
    ),
  );

  return entries;
}

export function parseBookEntries(data: unknown): BookEntry[] {
  if (!Array.isArray(data)) {
    throw new Error("books.json must be an array");
  }

  const entries = data.map((item, index) => {
    if (!isRecord(item)) {
      fail(`books.json[${index}]`, `must be an object`);
    }
    const path = `books.json[${index}]`;

    let readingHistory: ReadingUpdate[] | undefined;
    if (item.readingHistory !== undefined) {
      if (!Array.isArray(item.readingHistory)) {
        fail(path, `"readingHistory" must be an array when present`);
      }
      readingHistory = item.readingHistory.map((update, updateIndex) =>
        parseReadingUpdate(update, `${path}.readingHistory[${updateIndex}]`),
      );
    }

    let quotes: BookQuote[] | undefined;
    if (item.quotes !== undefined) {
      if (!Array.isArray(item.quotes)) {
        fail(path, `"quotes" must be an array when present`);
      }
      quotes = item.quotes.map((quote, quoteIndex) =>
        parseBookQuote(quote, `${path}.quotes[${quoteIndex}]`),
      );
    }

    const startedAt = optionalIsoDate(item, "startedAt", path);
    const finishedAt = optionalIsoDate(item, "finishedAt", path);
    assertChronology(startedAt, finishedAt, path, "startedAt", "finishedAt");

    const currentPage = optionalNonNegativeNumber(item, "currentPage", path);
    const customPageCount = optionalPositiveInteger(
      item,
      "customPageCount",
      path,
    );
    assertPageProgress(
      path,
      currentPage,
      customPageCount,
      readingHistory,
      quotes,
    );

    return {
      googleBooksId: requireString(item, "googleBooksId", path),
      slug: requireString(item, "slug", path),
      title: optionalString(item, "title", path),
      status: requireOneOf(item, "status", path, BOOK_STATUSES),
      rating: optionalRating(item, path),
      favorite: optionalBoolean(item, "favorite", path),
      startedAt,
      finishedAt,
      currentPage,
      customPageCount,
      format: optionalOneOf(item, "format", path, BOOK_FORMATS),
      tags: optionalStringArray(item, "tags", path),
      reviewSlug: optionalString(item, "reviewSlug", path),
      coverUrl: optionalString(item, "coverUrl", path),
      readingHistory,
      quotes,
    } satisfies BookEntry;
  });

  assertUniqueKeys(
    "slug",
    entries.map((entry, index) => ({
      path: `books.json[${index}]`,
      value: entry.slug,
    })),
  );
  assertUniqueKeys(
    "googleBooksId",
    entries.map((entry, index) => ({
      path: `books.json[${index}]`,
      value: entry.googleBooksId,
    })),
  );

  return entries;
}

export function parseGoals(data: unknown): Goals {
  if (!isRecord(data)) {
    throw new Error("goals.json must be an object");
  }
  const path = "goals.json";
  const year = optionalNumber(data, "year", path);
  const movies = optionalNumber(data, "movies", path);
  const books = optionalNumber(data, "books", path);
  const series = optionalNumber(data, "series", path);
  const pages = optionalNumber(data, "pages", path);

  if (
    year === undefined ||
    movies === undefined ||
    books === undefined ||
    series === undefined ||
    pages === undefined
  ) {
    fail(path, `must include numeric year/movies/books/series/pages`);
  }
  if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) {
    fail(path, `"year" must be an integer between ${MIN_YEAR} and ${MAX_YEAR}`);
  }
  for (const [key, value] of [
    ["movies", movies],
    ["books", books],
    ["series", series],
    ["pages", pages],
  ] as const) {
    if (!Number.isInteger(value) || value < 0) {
      fail(path, `"${key}" must be an integer >= 0`);
    }
  }

  return { year, movies, books, series, pages };
}
