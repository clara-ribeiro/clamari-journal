import {
  applyResolvedSeriesStatus,
  uniqueRegularWatchedCount,
} from "@/domain/journal-status";
import type { SeriesEntry } from "@/domain/entities";
import type { SeriesRepository } from "@/application/repositories/series-repository";
import seriesData from "@/data/series.json";
import { memoizeByCalendarDay } from "./calendar-day-memo";
import { parseSeriesEntries } from "./parse-json";

const parsed = parseSeriesEntries(seriesData);
const liveReleasedBySlug = new Map<string, number>();

const seriesForToday = memoizeByCalendarDay((today) =>
  parsed.map((entry) =>
    applyResolvedSeriesStatus(
      entry,
      today,
      liveReleasedBySlug.get(entry.slug),
    ),
  ),
);

export class FileSeriesRepository implements SeriesRepository {
  findAll(): SeriesEntry[] {
    return seriesForToday();
  }

  findBySlug(slug: string): SeriesEntry | undefined {
    return seriesForToday().find((entry) => entry.slug === slug);
  }

  findByStatus(status: SeriesEntry["status"]): SeriesEntry[] {
    return seriesForToday().filter((entry) => entry.status === status);
  }

  countWatchedEpisodes(): number {
    return seriesForToday().reduce(
      (total, entry) =>
        total + uniqueRegularWatchedCount(entry.watchedEpisodes),
      0,
    );
  }

  rememberReleasedEpisodeCount(slug: string, count: number): void {
    if (count < 1) return;
    if (liveReleasedBySlug.get(slug) === count) return;
    liveReleasedBySlug.set(slug, count);
    seriesForToday.invalidate();
  }
}

export const seriesRepository = new FileSeriesRepository();
