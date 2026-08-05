import {
  bookRepository,
  movieRepository,
  seriesRepository,
} from "@/infrastructure/persistence";
import { getBookById } from "@/infrastructure/google-books/client";
import { tmdbImageUrl } from "@/infrastructure/tmdb/client";
import type {
  BookEntry,
  JournalEntry,
  MovieEntry,
  SeriesEntry,
} from "@/domain/entities";

type JournalEntryBase = Omit<JournalEntry, "posterUrl"> & {
  favorite?: boolean;
  posterPath?: string;
  googleBooksId?: string;
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

/** Sync feed from personal records only — no external I/O. */
export function collectJournalEntries(): JournalEntryBase[] {
  const movies: JournalEntryBase[] = movieRepository.findAll().map((movie) => ({
    medium: "movie",
    slug: movie.slug,
    title: movie.title,
    activityDate: movieActivityDate(movie),
    rating: movie.rating,
    favorite: movie.favorite,
    href: `/movies/${movie.slug}`,
    posterPath: movie.posterPath,
  }));

  const series: JournalEntryBase[] = seriesRepository
    .findAll()
    .map((entry) => ({
      medium: "series",
      slug: entry.slug,
      title: entry.title,
      activityDate: seriesActivityDate(entry),
      rating: entry.rating,
      favorite: entry.favorite,
      href: `/series/${entry.slug}`,
      posterPath: entry.posterPath,
    }));

  const books: JournalEntryBase[] = bookRepository.findAll().map((book) => ({
    medium: "book",
    slug: book.slug,
    title: book.title ?? book.slug,
    activityDate: bookActivityDate(book),
    rating: book.rating,
    favorite: book.favorite,
    href: `/books/${book.slug}`,
    googleBooksId: book.googleBooksId,
  }));

  return [...movies, ...series, ...books].sort(compareEntriesNewestFirst);
}

/** Local poster only — listings must stay free of per-row API calls. */
function posterUrlFromPath(posterPath?: string): string | null {
  return posterPath ? tmdbImageUrl(posterPath, "w342") : null;
}

async function fetchBookCoverUrl(googleBooksId: string): Promise<string | null> {
  try {
    const volume = await getBookById(googleBooksId);
    const links = volume.volumeInfo.imageLinks;
    const url = links?.thumbnail ?? links?.smallThumbnail ?? null;
    return url ? url.replace("http://", "https://") : null;
  } catch {
    return null;
  }
}

function toJournalEntryLocal(entry: JournalEntryBase): JournalEntry {
  return {
    medium: entry.medium,
    slug: entry.slug,
    title: entry.title,
    activityDate: entry.activityDate,
    rating: entry.rating,
    href: entry.href,
    posterUrl: posterUrlFromPath(entry.posterPath),
  };
}

async function hydrateEntryPosters(
  entries: JournalEntryBase[],
): Promise<JournalEntry[]> {
  return Promise.all(
    entries.map(async (entry) => {
      const local = toJournalEntryLocal(entry);
      if (local.posterUrl) return local;
      if (entry.medium === "book" && entry.googleBooksId) {
        return {
          ...local,
          posterUrl: await fetchBookCoverUrl(entry.googleBooksId),
        };
      }
      return local;
    }),
  );
}

/**
 * Newest entries for the home section.
 * Movie/series posters come from enriched `posterPath`.
 * Book covers may be fetched for this small window only.
 */
export async function listRecentEntries(limit = 5): Promise<JournalEntry[]> {
  return hydrateEntryPosters(collectJournalEntries().slice(0, limit));
}

/** Favorited entries, newest activity first. */
export async function listFavoriteEntries(limit?: number): Promise<JournalEntry[]> {
  const favorites = collectJournalEntries().filter((entry) => entry.favorite);
  const selected = limit == null ? favorites : favorites.slice(0, limit);
  return hydrateEntryPosters(selected);
}

/**
 * Full catalog, newest → oldest.
 * Sync + local posters only (run `enrich:tmdb` for movie/series art).
 */
export function listAllEntries(): JournalEntry[] {
  return collectJournalEntries().map(toJournalEntryLocal);
}
