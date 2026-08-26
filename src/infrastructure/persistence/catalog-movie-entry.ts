import type { MovieEntry, MovieStatus } from "@/domain/entities";
import { isValidRating, type RatingValue } from "@/domain/value-objects/rating";
import { isReviewSlug } from "@/domain/value-objects/review-slug";
import { slugify } from "@/lib/slug";

const MOVIE_STATUSES = ["watchlist", "watched", "rewatch"] as const;

export type MovieSearchHit = {
  id: number;
  title: string;
  originalTitle?: string | null;
  year?: number | null;
  releaseDate?: string | null;
};

export type ResolveMovieSearchResult =
  | { status: "none" }
  | { status: "match"; hit: MovieSearchHit }
  | { status: "ambiguous"; hits: MovieSearchHit[] };

export type MovieCatalogDetails = {
  tmdbId: number;
  title: string;
  releaseDate?: string;
  runtimeMinutes?: number;
  posterPath?: string;
};

export type MovieJournalFields = {
  status?: MovieStatus;
  rating?: RatingValue;
  favorite?: boolean;
  watchedDates?: string[];
  tags?: string[];
  watchLocation?: string;
  streamingService?: string;
  reviewSlug?: string;
};

export class CatalogMovieError extends Error {
  constructor(
    message: string,
    readonly code: "duplicate" | "not_found" | "invalid",
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "CatalogMovieError";
  }
}

export function parseMovieQuery(input: string): {
  query: string;
  year?: number;
} {
  const trimmed = input.trim();
  const matched = /^(.*)\((\d{4})\)\s*$/.exec(trimmed);
  if (!matched) {
    return { query: trimmed };
  }
  return { query: matched[1].trim(), year: Number(matched[2]) };
}

export function resolveMovieSearch(
  hits: readonly MovieSearchHit[],
  options: { tmdbId?: number; year?: number; query?: string } = {},
): ResolveMovieSearchResult {
  let filtered = hits.filter((hit) => Number.isInteger(hit.id) && hit.id > 0);

  if (options.tmdbId != null) {
    const match = filtered.find((hit) => hit.id === options.tmdbId);
    return match ? { status: "match", hit: match } : { status: "none" };
  }

  if (options.year != null) {
    filtered = filtered.filter((hit) => hit.year === options.year);
  }

  if (filtered.length === 0) return { status: "none" };
  if (filtered.length === 1) return { status: "match", hit: filtered[0] };

  const query = options.query?.trim();
  if (query) {
    const exact = filtered.filter((hit) => titlesMatch(hit, query));
    if (exact.length === 1) return { status: "match", hit: exact[0] };
    if (exact.length > 1) {
      return { status: "ambiguous", hits: exact };
    }
  }

  return { status: "ambiguous", hits: filtered };
}

export function allocateMovieSlug(
  title: string,
  year: number | null | undefined,
  existingSlugs: Iterable<string>,
): string {
  const taken = new Set(existingSlugs);
  const base = slugify(title);
  if (!taken.has(base)) return base;

  const withYear = year ? `${base}-${year}` : null;
  if (withYear && !taken.has(withYear)) return withYear;

  const prefix = withYear ?? base;
  let n = 2;
  while (taken.has(`${prefix}-${n}`)) n += 1;
  return `${prefix}-${n}`;
}

export function buildMovieEntry(
  details: MovieCatalogDetails,
  journal: MovieJournalFields,
  existingSlugs: Iterable<string>,
): MovieEntry {
  if (!Number.isInteger(details.tmdbId) || details.tmdbId <= 0) {
    throw new CatalogMovieError("tmdbId must be a positive integer", "invalid");
  }

  const title = details.title.trim();
  if (!title) {
    throw new CatalogMovieError("title is required", "invalid");
  }

  const status = journal.status ?? "watched";
  if (!isMovieStatus(status)) {
    throw new CatalogMovieError(`invalid status "${String(status)}"`, "invalid");
  }

  if (journal.rating != null && !isValidRating(journal.rating)) {
    throw new CatalogMovieError(
      "rating must be a whole-star value from 1 to 5",
      "invalid",
    );
  }

  if (journal.reviewSlug != null && !isReviewSlug(journal.reviewSlug)) {
    throw new CatalogMovieError(
      `invalid reviewSlug "${journal.reviewSlug}"`,
      "invalid",
    );
  }

  const year = yearFromDate(details.releaseDate);
  const slug = allocateMovieSlug(title, year, existingSlugs);
  const reviewSlug = journal.reviewSlug ?? undefined;

  return compactMovieEntry({
    tmdbId: details.tmdbId,
    posterPath: cleanOptionalString(details.posterPath),
    slug,
    title,
    status,
    rating: journal.rating,
    favorite: journal.favorite || undefined,
    watchedDates: uniqueSortedDates(journal.watchedDates),
    tags: cleanStringList(journal.tags),
    watchLocation: cleanOptionalString(journal.watchLocation),
    streamingService: cleanOptionalString(journal.streamingService),
    reviewSlug,
    releaseDate: cleanOptionalString(details.releaseDate),
    runtimeMinutes: details.runtimeMinutes,
  });
}

export function mergeMovieJournal(
  current: MovieEntry,
  patch: MovieJournalFields,
): MovieEntry {
  if (patch.rating != null && !isValidRating(patch.rating)) {
    throw new CatalogMovieError(
      "rating must be a whole-star value from 1 to 5",
      "invalid",
    );
  }
  if (patch.reviewSlug != null && !isReviewSlug(patch.reviewSlug)) {
    throw new CatalogMovieError(
      `invalid reviewSlug "${patch.reviewSlug}"`,
      "invalid",
    );
  }
  if (patch.status != null && !isMovieStatus(patch.status)) {
    throw new CatalogMovieError(
      `invalid status "${String(patch.status)}"`,
      "invalid",
    );
  }

  const watchedDates =
    patch.watchedDates !== undefined
      ? uniqueSortedDates([
          ...(current.watchedDates ?? []),
          ...patch.watchedDates,
        ])
      : current.watchedDates;

  const tags =
    patch.tags !== undefined
      ? uniquePreserveOrder([...(current.tags ?? []), ...patch.tags])
      : current.tags;

  return compactMovieEntry({
    ...current,
    status: patch.status ?? current.status,
    rating: patch.rating ?? current.rating,
    favorite: patch.favorite ?? current.favorite,
    watchedDates,
    tags,
    watchLocation: patch.watchLocation ?? current.watchLocation,
    streamingService: patch.streamingService ?? current.streamingService,
    reviewSlug: patch.reviewSlug ?? current.reviewSlug,
  });
}

export function movieEntryToJson(entry: MovieEntry): Record<string, unknown> {
  const json: Record<string, unknown> = {
    slug: entry.slug,
    title: entry.title,
    status: entry.status,
  };
  if (entry.releaseDate) json.releaseDate = entry.releaseDate;
  if (entry.runtimeMinutes != null) json.runtimeMinutes = entry.runtimeMinutes;
  if (entry.watchedDates?.length) json.watchedDates = entry.watchedDates;
  if (entry.tmdbId != null) json.tmdbId = entry.tmdbId;
  if (entry.posterPath) json.posterPath = entry.posterPath;
  if (entry.rating != null) json.rating = entry.rating;
  if (entry.favorite) json.favorite = true;
  if (entry.tags?.length) json.tags = entry.tags;
  if (entry.watchLocation) json.watchLocation = entry.watchLocation;
  if (entry.streamingService) json.streamingService = entry.streamingService;
  if (entry.reviewSlug) json.reviewSlug = entry.reviewSlug;
  if (entry.tvtimeUuid) json.tvtimeUuid = entry.tvtimeUuid;
  return json;
}

export function findSlugInsertIndex(
  slugs: readonly string[],
  slug: string,
): number {
  const index = slugs.findIndex((value) => value.localeCompare(slug) > 0);
  return index === -1 ? slugs.length : index;
}

export function findMovieByTmdbId(
  movies: readonly Pick<MovieEntry, "tmdbId">[],
  tmdbId: number,
): number {
  return movies.findIndex((movie) => movie.tmdbId === tmdbId);
}

function titlesMatch(hit: MovieSearchHit, query: string): boolean {
  const expected = query.trim().toLowerCase();
  if (hit.title.trim().toLowerCase() === expected) return true;
  return hit.originalTitle?.trim().toLowerCase() === expected;
}

function isMovieStatus(value: string): value is MovieStatus {
  return (MOVIE_STATUSES as readonly string[]).includes(value);
}

function yearFromDate(value: string | undefined): number | undefined {
  if (!value || value.length < 4) return undefined;
  const year = Number(value.slice(0, 4));
  return Number.isInteger(year) ? year : undefined;
}

function uniqueSortedDates(values: string[] | undefined): string[] | undefined {
  if (!values?.length) return undefined;
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function uniquePreserveOrder(values: string[]): string[] | undefined {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const cleaned = value.trim();
    if (!cleaned || seen.has(cleaned)) continue;
    seen.add(cleaned);
    result.push(cleaned);
  }
  return result.length > 0 ? result : undefined;
}

function cleanStringList(values: string[] | undefined): string[] | undefined {
  return uniquePreserveOrder(values ?? []);
}

function cleanOptionalString(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function compactMovieEntry(entry: MovieEntry): MovieEntry {
  return {
    tmdbId: entry.tmdbId,
    posterPath: entry.posterPath,
    tvtimeUuid: entry.tvtimeUuid,
    slug: entry.slug,
    title: entry.title,
    status: entry.status,
    rating: entry.rating,
    favorite: entry.favorite || undefined,
    watchedDates: entry.watchedDates?.length ? entry.watchedDates : undefined,
    tags: entry.tags?.length ? entry.tags : undefined,
    watchLocation: entry.watchLocation,
    streamingService: entry.streamingService,
    reviewSlug: entry.reviewSlug,
    releaseDate: entry.releaseDate,
    runtimeMinutes: entry.runtimeMinutes,
  };
}
