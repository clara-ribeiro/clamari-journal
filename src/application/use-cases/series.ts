import { seriesRepository } from "@/infrastructure/persistence";
import type { SeriesEntry } from "@/domain/entities";

/** Used when an episode has no known runtime (common for older TV Time rows). */
export const DEFAULT_EPISODE_RUNTIME_MINUTES = 45;

export function listSeries(): SeriesEntry[] {
  return seriesRepository.findAll();
}

export function getSeriesBySlug(slug: string): SeriesEntry | undefined {
  return seriesRepository.findBySlug(slug);
}

export function getEpisodeRuntimeMinutes(
  runtimeMinutes?: number,
): number {
  return runtimeMinutes && runtimeMinutes > 0
    ? runtimeMinutes
    : DEFAULT_EPISODE_RUNTIME_MINUTES;
}

export function getSeriesStats() {
  const all = seriesRepository.findAll();
  const withProgress = all.filter((s) => s.watchedEpisodes.length > 0);

  const totalRuntimeMinutes = all.reduce(
    (sum, entry) =>
      sum +
      entry.watchedEpisodes.reduce(
        (episodeSum, episode) =>
          episodeSum + getEpisodeRuntimeMinutes(episode.runtimeMinutes),
        0,
      ),
    0,
  );

  return {
    total: all.length,
    watching: all.filter((s) => s.status === "watching").length,
    completed: all.filter((s) => s.status === "completed").length,
    paused: all.filter((s) => s.status === "paused").length,
    abandoned: all.filter((s) => s.status === "abandoned").length,
    watchlist: all.filter((s) => s.status === "watchlist").length,
    favorites: all.filter((s) => s.favorite).length,
    watchedEpisodes: seriesRepository.countWatchedEpisodes(),
    withProgress: withProgress.length,
    totalRuntimeMinutes,
  };
}
