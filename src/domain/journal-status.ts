import type { BookStatus, MovieStatus } from "./entities";
import type { SeriesStatus, WatchedEpisode } from "./entities/series";

function episodeKey(season: number, episode: number): string {
  return `${season}-${episode}`;
}

/** Unique calendar dates, oldest first. Rewatches are extra dates, not extra films. */
export function uniqueWatchDates(
  dates: readonly string[] | undefined,
): string[] {
  if (!dates?.length) return [];
  return [...new Set(dates)].sort((a, b) => a.localeCompare(b));
}

/** Regular (non-special) watches, unique by season+episode. Rewatches do not add. */
export function uniqueRegularWatchedCount(
  episodes: readonly WatchedEpisode[],
): number {
  const keys = new Set<string>();
  for (const episode of episodes) {
    if (episode.season <= 0) continue;
    keys.add(episodeKey(episode.season, episode.episode));
  }
  return keys.size;
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
  const dates = episodes
    .filter((episode) => episode.season > 0 && episode.watchedAt)
    .map((episode) => episode.watchedAt as string)
    .sort();
  return dates.at(-1);
}

/**
 * Films: date count is the status.
 * 0 dates keep watchlist vs an explicit watched mark; 1 date → watched; 2+ → rewatch.
 */
export function resolveJournalMovieStatus(
  status: MovieStatus,
  dates: readonly string[] | undefined,
): MovieStatus {
  const unique = uniqueWatchDates(dates);
  if (unique.length >= 2) return "rewatch";
  if (unique.length === 1) return "watched";
  if (status === "rewatch") return "watched";
  return status;
}

/**
 * Series: coverage vs TMDB total wins.
 * 100% → completed. Incomplete completed → paused.
 * Watchlist with any regular watch → watching. up-to-date is an alias (100% completed, else watching).
 * watching / paused / abandoned stay as intent while progress is partial.
 */
export function resolveJournalSeriesStatus(
  status: SeriesStatus,
  episodes: readonly WatchedEpisode[],
  releasedCount: number | undefined,
): SeriesStatus {
  if (hasWatchedAllReleasedEpisodes(episodes, releasedCount)) {
    return "completed";
  }

  const unique = uniqueRegularWatchedCount(episodes);

  if (status === "completed") {
    if (releasedCount == null || releasedCount < 1) return status;
    return "paused";
  }

  if (status === "up-to-date") return "watching";
  if (status === "watchlist" && unique > 0) return "watching";
  return status;
}

export type BookStatusResolution = {
  status: BookStatus;
  currentPage: number | undefined;
};

function furthestPage(
  currentPage: number | undefined,
  readingHistory: readonly { page?: number }[] | undefined,
): number | undefined {
  const fromHistory = (readingHistory ?? [])
    .map((entry) => entry.page)
    .filter((page): page is number => page != null);
  const historyMax =
    fromHistory.length > 0 ? Math.max(...fromHistory) : undefined;
  if (currentPage == null) return historyMax;
  if (historyMax == null) return currentPage;
  return Math.max(currentPage, historyMax);
}

/**
 * Books: page progress vs `customPageCount` wins when both are known.
 * Finished without a page still counts as finished; currentPage fills to the total.
 */
export function resolveJournalBookStatus(
  status: BookStatus,
  currentPage: number | undefined,
  customPageCount: number | undefined,
  readingHistory: readonly { page?: number }[] | undefined,
): BookStatusResolution {
  const page = furthestPage(currentPage, readingHistory);

  if (customPageCount != null && page != null && page >= customPageCount) {
    return { status: "finished", currentPage: customPageCount };
  }

  if (status === "finished") {
    return {
      status: "finished",
      currentPage: page ?? customPageCount,
    };
  }

  if (status === "want-to-read" && page != null && page > 0) {
    return { status: "reading", currentPage: page };
  }

  return { status, currentPage: page ?? currentPage };
}
