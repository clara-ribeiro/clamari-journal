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
import { tmdbImageUrl } from "@/lib/tmdb-image";

type JournalEntryBase = Omit<JournalEntry, "posterUrl"> & {
  favorite?: boolean;
  hasReview?: boolean;
  posterPath?: string;
  coverUrl?: string;
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
): JournalEntryBase[] {
  const movieEntries: JournalEntryBase[] = movies.map((movie) => ({
    medium: "movie",
    slug: movie.slug,
    title: movie.title,
    activityDate: movieActivityDate(movie),
    rating: movie.rating,
    favorite: movie.favorite,
    hasReview: Boolean(movie.reviewSlug),
    href: `/films/${movie.slug}`,
    posterPath: movie.posterPath,
  }));

  const seriesEntries: JournalEntryBase[] = seriesList.map((entry) => ({
    medium: "series",
    slug: entry.slug,
    title: entry.title,
    activityDate: seriesActivityDate(entry),
    rating: entry.rating,
    favorite: entry.favorite,
    hasReview: Boolean(entry.reviewSlug),
    href: `/series/${entry.slug}`,
    posterPath: entry.posterPath,
  }));

  const bookEntries: JournalEntryBase[] = books.map((book) => ({
    medium: "book",
    slug: book.slug,
    title: book.title ?? book.slug,
    activityDate: bookActivityDate(book),
    rating: book.rating,
    favorite: book.favorite,
    hasReview: Boolean(book.reviewSlug),
    href: `/books/${book.slug}`,
    coverUrl: book.coverUrl,
  }));

  return [...movieEntries, ...seriesEntries, ...bookEntries].sort(
    compareEntriesNewestFirst,
  );
}

/** Sync feed from personal records only — no external I/O. */
export function collectJournalEntries(): JournalEntryBase[] {
  return collectJournalEntriesFrom(
    movieRepository.findAll(),
    seriesRepository.findAll(),
    bookRepository.findAll(),
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
export function listRecentEntries(limit = 5): JournalEntry[] {
  return collectJournalEntries().slice(0, limit).map(toJournalEntry);
}

/** Favorited entries, newest activity first. */
export function listFavoriteEntries(limit?: number): JournalEntry[] {
  const favorites = collectJournalEntries().filter((entry) => entry.favorite);
  const selected = limit == null ? favorites : favorites.slice(0, limit);
  return selected.map(toJournalEntry);
}

/** Entries with a review, newest activity first. */
export function listReviewEntries(limit?: number): JournalEntry[] {
  const reviews = collectJournalEntries().filter((entry) => entry.hasReview);
  const selected = limit == null ? reviews : reviews.slice(0, limit);
  return selected.map(toJournalEntry);
}

/**
 * Full catalog, newest → oldest.
 * Local posters only (run `enrich:tmdb` / store `coverUrl` for art).
 */
export function listAllEntries(): JournalEntry[] {
  return collectJournalEntries().map(toJournalEntry);
}

/** Single catalog pass for the home page feeds. */
export function getHomeFeeds(limit = 5): {
  recentEntries: JournalEntry[];
  reviewEntries: JournalEntry[];
  favoriteEntries: JournalEntry[];
} {
  const all = collectJournalEntries();
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
