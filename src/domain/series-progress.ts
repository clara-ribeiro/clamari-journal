import type { SeriesStatus, WatchedEpisode } from "./entities/series";

function episodeKey(season: number, episode: number): string {
  return `${season}-${episode}`;
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

/**
 * Completa only when unique regular watches cover every released episode.
 * `>=` after uniquing: extras beyond the TMDB total still mean the released set is done.
 */
export function hasWatchedAllReleasedEpisodes(
  episodes: readonly WatchedEpisode[],
  releasedCount: number | undefined,
): boolean {
  if (releasedCount == null || releasedCount < 1) return false;
  return uniqueRegularWatchedCount(episodes) >= releasedCount;
}

/** Latest `watchedAt` among regular episodes (rewatches included as dates only). */
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
 * Journal series status from progress + intent.
 *
 * Progress (unique regular watches vs TMDB `numberOfEpisodes`) wins:
 * - 100% of a known released total → `completed` (never abandoned / watching / paused)
 * - `completed` with a known incomplete total → `paused`
 * - `watchlist` once any regular episode is watched → `watching`
 * - `up-to-date` that is not 100% → `watching`
 *
 * Partial progress keeps watching / paused / abandoned as recorded
 * (those three cannot be told apart from counts alone).
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

  if (status === "watchlist" && unique > 0) return "watching";
  if (status === "up-to-date") return "watching";

  return status;
}
