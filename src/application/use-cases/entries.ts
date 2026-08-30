import {
  bookRepository,
  movieRepository,
  seriesRepository,
} from "@/composition/repositories";
import type { JournalEntry } from "@/application/dto";
import type {
  BookEntry,
  MovieEntry,
  SeriesEntry,
} from "@/domain/entities";
import type { ReviewMedium } from "@/application/repositories/review-repository";
import { tmdbImageUrl } from "@/lib/tmdb-image";
import {
  DEFAULT_REVIEW_LOCALE,
  reviewPagePath,
  type ReviewLocale,
} from "@/lib/review-locale";
import { catalogHasReview, localizedWorkTitle } from "./catalog-locale";

type JournalEntryBase = Omit<JournalEntry, "posterUrl"> & {
  favorite?: boolean;
  hasReview?: boolean;
  posterPath?: string;
  coverUrl?: string;
  reviewMedium: ReviewMedium;
  reviewSlug?: string | null;
};

function latestIsoDate(dates: Array<string | undefined>): string | null {
  const valid = dates.filter((d): d is string => Boolean(d));
  if (valid.length === 0) return null;
  return valid.reduce((latest, date) => (date > latest ? date : latest));
}

export function movieActivityDate(movie: MovieEntry): string | null {
  return latestIsoDate(movie.watchedDates ?? []);
}

export function seriesActivityDate(series: SeriesEntry): string | null {
  return latestIsoDate([
    series.finishedAt,
    series.startedAt,
    ...series.watchedEpisodes.map((episode) => episode.watchedAt),
  ]);
}

export function bookActivityDate(book: BookEntry): string | null {
  return latestIsoDate([
    book.finishedAt,
    book.startedAt,
    ...(book.readingHistory?.map((entry) => entry.date) ?? []),
  ]);
}

function compareEntriesNewestFirst(a: JournalEntryBase, b: JournalEntryBase) {
  if (a.activityDate && b.activityDate) {
    return b.activityDate.localeCompare(a.activityDate);
  }
  if (a.activityDate) return -1;
  if (b.activityDate) return 1;
  return a.title.localeCompare(b.title);
}

export function collectJournalEntriesFrom(
  movies: MovieEntry[],
  seriesList: SeriesEntry[],
  books: BookEntry[],
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): JournalEntryBase[] {
  const movieEntries: JournalEntryBase[] = movies.map((movie) => ({
    medium: "movie",
    slug: movie.slug,
    title: localizedWorkTitle("films", movie.reviewSlug, movie.title, locale),
    activityDate: movieActivityDate(movie),
    rating: movie.rating,
    favorite: movie.favorite,
    reviewMedium: "films",
    reviewSlug: movie.reviewSlug,
    hasReview: catalogHasReview("films", movie.reviewSlug, locale),
    href: reviewPagePath("films", movie.slug, locale),
    posterPath: movie.posterPath,
  }));

  const seriesEntries: JournalEntryBase[] = seriesList.map((entry) => ({
    medium: "series",
    slug: entry.slug,
    title: localizedWorkTitle(
      "series",
      entry.reviewSlug,
      entry.title,
      locale,
    ),
    activityDate: seriesActivityDate(entry),
    rating: entry.rating,
    favorite: entry.favorite,
    reviewMedium: "series",
    reviewSlug: entry.reviewSlug,
    hasReview: catalogHasReview("series", entry.reviewSlug, locale),
    href: reviewPagePath("series", entry.slug, locale),
    posterPath: entry.posterPath,
  }));

  const bookEntries: JournalEntryBase[] = books.map((book) => ({
    medium: "book",
    slug: book.slug,
    title: localizedWorkTitle(
      "books",
      book.reviewSlug,
      book.title ?? book.slug,
      locale,
    ),
    activityDate: bookActivityDate(book),
    rating: book.rating,
    favorite: book.favorite,
    reviewMedium: "books",
    reviewSlug: book.reviewSlug,
    hasReview: catalogHasReview("books", book.reviewSlug, locale),
    href: reviewPagePath("books", book.slug, locale),
    coverUrl: book.coverUrl,
  }));

  return [...movieEntries, ...seriesEntries, ...bookEntries].sort(
    compareEntriesNewestFirst,
  );
}

/** Sync feed from personal records only — no external I/O. */
export function collectJournalEntries(
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): JournalEntryBase[] {
  return collectJournalEntriesFrom(
    movieRepository.findAll(),
    seriesRepository.findAll(),
    bookRepository.findAll(),
    locale,
  );
}

function toJournalEntry(entry: JournalEntryBase): JournalEntry {
  const posterUrl =
    entry.coverUrl ??
    (entry.posterPath ? tmdbImageUrl(entry.posterPath, "w342") : null);

  return {
    medium: entry.medium,
    slug: entry.slug,
    title: entry.title,
    activityDate: entry.activityDate,
    rating: entry.rating,
    href: entry.href,
    posterUrl,
  };
}

/** Newest entries for the home section (local posters/covers only). */
export function listRecentEntries(
  limit = 5,
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): JournalEntry[] {
  return collectJournalEntries(locale).slice(0, limit).map(toJournalEntry);
}

/** Favorited entries, newest activity first. */
export function listFavoriteEntries(
  limit?: number,
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): JournalEntry[] {
  const favorites = collectJournalEntries(locale).filter(
    (entry) => entry.favorite,
  );
  const selected = limit == null ? favorites : favorites.slice(0, limit);
  return selected.map(toJournalEntry);
}

/** Entries with a review, newest activity first. */
export function listReviewEntries(
  limit?: number,
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): JournalEntry[] {
  const reviews = collectJournalEntries(locale).filter(
    (entry) => entry.hasReview,
  );
  const selected = limit == null ? reviews : reviews.slice(0, limit);
  return selected.map(toJournalEntry);
}

/**
 * Full catalog, newest → oldest.
 * Local posters only (run `enrich:tmdb` / store `coverUrl` for art).
 */
export function listAllEntries(
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): JournalEntry[] {
  return collectJournalEntries(locale).map(toJournalEntry);
}

/** Single catalog pass for the home page feeds. */
export function getHomeFeeds(
  limit = 5,
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): {
  recentEntries: JournalEntry[];
  reviewEntries: JournalEntry[];
  favoriteEntries: JournalEntry[];
} {
  const all = collectJournalEntries(locale);

  return {
    recentEntries: all.slice(0, limit).map(toJournalEntry),
    reviewEntries: all
      .filter((entry) => entry.hasReview)
      .slice(0, limit)
      .map(toJournalEntry),
    favoriteEntries: all
      .filter((entry) => entry.favorite)
      .slice(0, limit)
      .map(toJournalEntry),
  };
}
