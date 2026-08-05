export type MovieStatus = "watchlist" | "watched" | "rewatch";

/**
 * Personal movie entry. Metadata (poster, genres, cast) comes from TMDB.
 * `tvtimeUuid` / `title` / `releaseDate` come from the TV Time import
 * and are used until `tmdbId` is resolved.
 */
export type MovieEntry = {
  /** TMDB movie id — filled after enrichment */
  tmdbId?: number;
  /** Relative TMDB poster path (e.g. `/abc.jpg`) — filled after enrichment */
  posterPath?: string;
  /** TV Time UUID from GDPR export (stable source key) */
  tvtimeUuid?: string;
  slug: string;
  /** Fallback title until TMDB enrichment */
  title: string;
  status: MovieStatus;
  rating?: number;
  favorite?: boolean;
  watchedDates?: string[];
  tags?: string[];
  reviewSlug?: string;
  /** ISO date from source, helps TMDB matching */
  releaseDate?: string;
  runtimeMinutes?: number;
};
