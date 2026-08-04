import type { SeriesEntry } from "@/domain/entities";
import type { SeriesRepository } from "@/application/repositories/series-repository";
import seriesData from "@/data/series.json";

const series = seriesData as SeriesEntry[];

export class FileSeriesRepository implements SeriesRepository {
  findAll(): SeriesEntry[] {
    return series;
  }

  findBySlug(slug: string): SeriesEntry | undefined {
    return series.find((entry) => entry.slug === slug);
  }

  findByStatus(status: SeriesEntry["status"]): SeriesEntry[] {
    return series.filter((entry) => entry.status === status);
  }

  countWatchedEpisodes(): number {
    return series.reduce(
      (total, entry) => total + entry.watchedEpisodes.length,
      0,
    );
  }
}

export const seriesRepository = new FileSeriesRepository();
