import type {
  BookEntry,
  BookFormat,
  BookStatus,
  Goals,
  MovieEntry,
  MovieStatus,
  SeriesEntry,
  SeriesStatus,
} from "@/domain/entities";
import type { RatingValue } from "@/domain/value-objects/rating";
import { isValidRating } from "@/domain/value-objects/rating";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(record: Record<string, unknown>, key: string, path: string) {
  const value = record[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Invalid JSON at ${path}: expected non-empty string "${key}"`);
  }
  return value;
}

function optionalNumber(record: Record<string, unknown>, key: string) {
  const value = record[key];
  if (value === undefined) return undefined;
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`Invalid JSON: "${key}" must be a number when present`);
  }
  return value;
}

function optionalBoolean(record: Record<string, unknown>, key: string) {
  const value = record[key];
  if (value === undefined) return undefined;
  if (typeof value !== "boolean") {
    throw new Error(`Invalid JSON: "${key}" must be a boolean when present`);
  }
  return value;
}

function optionalString(record: Record<string, unknown>, key: string) {
  const value = record[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    throw new Error(`Invalid JSON: "${key}" must be a string when present`);
  }
  return value;
}

function optionalStringArray(record: Record<string, unknown>, key: string) {
  const value = record[key];
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Invalid JSON: "${key}" must be a string array when present`);
  }
  return value as string[];
}

function optionalRating(record: Record<string, unknown>): RatingValue | undefined {
  const value = optionalNumber(record, "rating");
  if (value === undefined) return undefined;
  if (!isValidRating(value)) {
    throw new Error(`Invalid JSON: rating must be a half-star value from 0.5 to 5`);
  }
  return value;
}

export function parseMovieEntries(data: unknown): MovieEntry[] {
  if (!Array.isArray(data)) {
    throw new Error("movies.json must be an array");
  }

  return data.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`movies.json[${index}] must be an object`);
    }
    const path = `movies.json[${index}]`;
    return {
      tmdbId: optionalNumber(item, "tmdbId"),
      posterPath: optionalString(item, "posterPath"),
      tvtimeUuid: optionalString(item, "tvtimeUuid"),
      slug: requireString(item, "slug", path),
      title: requireString(item, "title", path),
      status: requireString(item, "status", path) as MovieStatus,
      rating: optionalRating(item),
      favorite: optionalBoolean(item, "favorite"),
      watchedDates: optionalStringArray(item, "watchedDates"),
      tags: optionalStringArray(item, "tags"),
      reviewSlug: optionalString(item, "reviewSlug"),
      releaseDate: optionalString(item, "releaseDate"),
      runtimeMinutes: optionalNumber(item, "runtimeMinutes"),
    };
  });
}

export function parseSeriesEntries(data: unknown): SeriesEntry[] {
  if (!Array.isArray(data)) {
    throw new Error("series.json must be an array");
  }

  return data.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`series.json[${index}] must be an object`);
    }
    const path = `series.json[${index}]`;
    const watchedEpisodesRaw = item.watchedEpisodes;
    if (!Array.isArray(watchedEpisodesRaw)) {
      throw new Error(`${path}.watchedEpisodes must be an array`);
    }

    const watchedEpisodes = watchedEpisodesRaw.map((episode, episodeIndex) => {
      if (!isRecord(episode)) {
        throw new Error(`${path}.watchedEpisodes[${episodeIndex}] must be an object`);
      }
      const season = episode.season;
      const ep = episode.episode;
      if (typeof season !== "number" || typeof ep !== "number") {
        throw new Error(
          `${path}.watchedEpisodes[${episodeIndex}] needs numeric season/episode`,
        );
      }
      return {
        season,
        episode: ep,
        watchedAt: optionalString(episode, "watchedAt"),
        runtimeMinutes: optionalNumber(episode, "runtimeMinutes"),
        rating: optionalRating(episode),
      };
    });

    const tvdbId = optionalNumber(item, "tvdbId");
    if (tvdbId === undefined) {
      throw new Error(`${path}: tvdbId is required`);
    }

    return {
      tmdbId: optionalNumber(item, "tmdbId"),
      posterPath: optionalString(item, "posterPath"),
      tvdbId,
      slug: requireString(item, "slug", path),
      title: requireString(item, "title", path),
      status: requireString(item, "status", path) as SeriesStatus,
      rating: optionalRating(item),
      favorite: optionalBoolean(item, "favorite"),
      startedAt: optionalString(item, "startedAt"),
      finishedAt: optionalString(item, "finishedAt"),
      reviewSlug: optionalString(item, "reviewSlug"),
      watchedEpisodes,
    };
  });
}

export function parseBookEntries(data: unknown): BookEntry[] {
  if (!Array.isArray(data)) {
    throw new Error("books.json must be an array");
  }

  return data.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`books.json[${index}] must be an object`);
    }
    const path = `books.json[${index}]`;
    return {
      googleBooksId: requireString(item, "googleBooksId", path),
      slug: requireString(item, "slug", path),
      title: optionalString(item, "title"),
      status: requireString(item, "status", path) as BookStatus,
      rating: optionalRating(item),
      favorite: optionalBoolean(item, "favorite"),
      startedAt: optionalString(item, "startedAt"),
      finishedAt: optionalString(item, "finishedAt"),
      currentPage: optionalNumber(item, "currentPage"),
      customPageCount: optionalNumber(item, "customPageCount"),
      format: optionalString(item, "format") as BookFormat | undefined,
      tags: optionalStringArray(item, "tags"),
      reviewSlug: optionalString(item, "reviewSlug"),
      coverUrl: optionalString(item, "coverUrl"),
      readingHistory: Array.isArray(item.readingHistory)
        ? (item.readingHistory as BookEntry["readingHistory"])
        : undefined,
      quotes: Array.isArray(item.quotes)
        ? (item.quotes as BookEntry["quotes"])
        : undefined,
    };
  });
}

export function parseGoals(data: unknown): Goals {
  if (!isRecord(data)) {
    throw new Error("goals.json must be an object");
  }
  const year = data.year;
  const movies = data.movies;
  const books = data.books;
  const series = data.series;
  const pages = data.pages;
  if (
    typeof year !== "number" ||
    typeof movies !== "number" ||
    typeof books !== "number" ||
    typeof series !== "number" ||
    typeof pages !== "number"
  ) {
    throw new Error("goals.json must include numeric year/movies/books/series/pages");
  }
  return { year, movies, books, series, pages };
}
