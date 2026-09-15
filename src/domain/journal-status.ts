import type {
  BookStatus,
  MovieStatus,
  ReadingUpdate,
  SeriesStatus,
  WatchedEpisode,
} from "./entities";

/**
 * Single source of truth for what each journal status means.
 *
 * Progress always wins over the recorded mark: a film's watch dates, a series'
 * unique regular episodes vs TMDB's released total, a book's furthest page vs
 * its total. Every reader (JSON parse, CLI, enrich scripts) resolves through
 * here so the site can never show a status its own progress contradicts.
 */

export const MOVIE_STATUSES = [
  "watchlist",
  "watched",
  "rewatch",
] as const satisfies readonly MovieStatus[];

export const SERIES_STATUSES = [
  "watchlist",
  "watching",
  "paused",
  "completed",
  "abandoned",
] as const satisfies readonly SeriesStatus[];

export const BOOK_STATUSES = [
  "want-to-read",
  "reading",
  "paused",
  "finished",
  "abandoned",
] as const satisfies readonly BookStatus[];

/** Accepted in `series.json`: `up-to-date` is a legacy alias, never a resolved status. */
export type SeriesStatusInput = SeriesStatus | "up-to-date";

export const SERIES_STATUS_INPUTS = [
  ...SERIES_STATUSES,
  "up-to-date",
] as const satisfies readonly SeriesStatusInput[];

export function isMovieStatus(value: string): value is MovieStatus {
  return (MOVIE_STATUSES as readonly string[]).includes(value);
}

/** A film with at least one viewing, however many times it was seen. */
export function isWatchedMovieStatus(
  status: string,
): status is Extract<MovieStatus, "watched" | "rewatch"> {
  return status === "watched" || status === "rewatch";
}

function liveSeriesStatus(status: SeriesStatusInput): SeriesStatus {
  return status === "up-to-date" ? "watching" : status;
}

export function episodeKey(season: number, episode: number): string {
  return `${season}-${episode}`;
}

function isRegular(episode: WatchedEpisode): boolean {
  return episode.season > 0;
}

/** Unique calendar dates, oldest first. Rewatches are extra dates, not extra films. */
export function uniqueWatchDates(
  dates: readonly string[] | undefined,
): string[] {
  if (!dates?.length) return [];
  return [...new Set(dates)].sort();
}

/** Regular (non-special) watches, unique by season+episode. Rewatches do not add. */
export function uniqueRegularWatchedCount(
  episodes: readonly WatchedEpisode[],
): number {
  const keys = new Set<string>();
  for (const episode of episodes) {
    if (!isRegular(episode)) continue;
    keys.add(episodeKey(episode.season, episode.episode));
  }
  return keys.size;
}

/** Regular seasons with at least one watched episode. */
export function watchedSeasonNumbers(
  episodes: readonly WatchedEpisode[],
): Set<number> {
  const seasons = new Set<number>();
  for (const episode of episodes) {
    if (isRegular(episode)) seasons.add(episode.season);
  }
  return seasons;
}

export function hasWatchedAllReleasedEpisodes(
  episodes: readonly WatchedEpisode[],
  releasedCount: number | undefined,
): boolean {
  if (releasedCount == null || releasedCount < 1) return false;
  return uniqueRegularWatchedCount(episodes) >= releasedCount;
}

export function lastRegularWatchDate(
  episodes: readonly WatchedEpisode[],
): string | undefined {
  return episodes
    .flatMap((episode) =>
      isRegular(episode) && episode.watchedAt ? [episode.watchedAt] : [],
    )
    .sort()
    .at(-1);
}

/** Whole-number percent, capped at 100. Missing totals stay unknown. */
export function journalProgressPercent(
  current: number | null | undefined,
  total: number | null | undefined,
): number | null {
  if (current == null || total == null || total < 1) return null;
  return Math.min(100, Math.round((current / total) * 100));
}

/**
 * Films: the number of viewings is the status.
 * No dates keeps an explicit `watched` mark or the watchlist; one date is
 * `watched`; two or more are a `rewatch`.
 */
export function resolveJournalMovieStatus(
  status: MovieStatus,
  dates: readonly string[] | undefined,
): MovieStatus {
  const viewings = uniqueWatchDates(dates).length;
  if (viewings >= 2) return "rewatch";
  if (viewings === 1) return "watched";
  return status === "rewatch" ? "watched" : status;
}

/**
 * Series: coverage of TMDB's released total wins.
 * Full coverage is always `completed`, including rows imported as abandoned.
 * A `completed` mark that misses the total falls back to `paused`, unless the
 * total is unknown and there is nothing to contradict it.
 * `watching` / `paused` / `abandoned` stay as intent while progress is partial.
 */
export function resolveJournalSeriesStatus(
  status: SeriesStatusInput,
  episodes: readonly WatchedEpisode[],
  releasedCount: number | undefined,
): SeriesStatus {
  const unique = uniqueRegularWatchedCount(episodes);
  if (releasedCount != null && releasedCount >= 1 && unique >= releasedCount) {
    return "completed";
  }

  if (status === "completed") {
    const totalIsKnown = releasedCount != null && releasedCount > 0;
    return totalIsKnown ? "paused" : "completed";
  }

  const live = liveSeriesStatus(status);
  if (live === "watchlist" && unique > 0) return "watching";
  return live;
}

export type BookProgress = {
  status: BookStatus;
  currentPage?: number;
  customPageCount?: number;
  readingHistory?: readonly ReadingUpdate[];
};

export type ResolvedBookProgress = {
  status: BookStatus;
  currentPage: number | undefined;
};

/** Furthest page reached, from the current page or any reading update. */
function furthestPage(progress: BookProgress): number | undefined {
  const pages = (progress.readingHistory ?? [])
    .flatMap((entry) => (entry.page != null ? [entry.page] : []))
    .concat(progress.currentPage != null ? [progress.currentPage] : []);
  return pages.length > 0 ? Math.max(...pages) : undefined;
}

/**
 * Books: page progress against `customPageCount` wins when both are known.
 * Reaching the total is always `finished`. A `finished` mark stays finished
 * and `currentPage` fills to the total; earlier history pages are checkpoints,
 * not leftover unread progress.
 */
export function resolveJournalBookStatus(
  progress: BookProgress,
): ResolvedBookProgress {
  const { status, customPageCount } = progress;
  const page = furthestPage(progress);

  if (customPageCount != null && page != null && page >= customPageCount) {
    return { status: "finished", currentPage: customPageCount };
  }

  if (status === "finished") {
    return {
      status: "finished",
      currentPage: customPageCount ?? page,
    };
  }

  if (status === "want-to-read" && page != null && page > 0) {
    return { status: "reading", currentPage: page };
  }

  return { status, currentPage: page };
}
