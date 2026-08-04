import type { SeriesEntry } from "@/domain/entities";

export interface SeriesRepository {
  findAll(): SeriesEntry[];
  findBySlug(slug: string): SeriesEntry | undefined;
  findByStatus(status: SeriesEntry["status"]): SeriesEntry[];
  countWatchedEpisodes(): number;
}
