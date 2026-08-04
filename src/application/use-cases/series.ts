import { seriesRepository } from "@/infrastructure/persistence";
import type { SeriesEntry } from "@/domain/entities";

export function listSeries(): SeriesEntry[] {
  return seriesRepository.findAll();
}

export function getSeriesBySlug(slug: string): SeriesEntry | undefined {
  return seriesRepository.findBySlug(slug);
}

export function getSeriesStats() {
  const all = seriesRepository.findAll();
  const withProgress = all.filter((s) => s.watchedEpisodes.length > 0);

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
  };
}
