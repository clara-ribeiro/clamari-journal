export type SeriesStatus =
  | "watchlist"
  | "watching"
  | "up-to-date"
  | "paused"
  | "completed"
  | "abandoned";

export type WatchedEpisode = {
  season: number;
  episode: number;
  watchedAt?: string;
  rating?: number;
  /** Episode length when known (from import or TMDB) */
  runtimeMinutes?: number;
};

/**
 * Personal series entry. Metadata comes from TMDB.
 * `tvdbId` comes from the TV Time / TheTVDB export and maps via TMDB `/find`.
 */
export type SeriesEntry = {
  /** TMDB TV id — filled after enrichment */
  tmdbId?: number;
  /** Relative TMDB poster path (e.g. `/abc.jpg`) — filled after enrichment */
  posterPath?: string;
  /** TheTVDB id from GDPR export (stable source key) */
  tvdbId: number;
  slug: string;
  /** Fallback title until TMDB enrichment */
  title: string;
  status: SeriesStatus;
  rating?: number;
  favorite?: boolean;
  startedAt?: string;
  finishedAt?: string;
  watchedEpisodes: WatchedEpisode[];
  reviewSlug?: string;
};
