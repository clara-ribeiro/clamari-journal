import { describe, expect, it } from "vitest";
import type { BookEntry, MovieEntry, SeriesEntry } from "@/domain/entities";
import {
  isSeriesCaughtUp,
  yearsBookCountsToward,
  yearsMovieCountsToward,
  yearsSeriesCountsToward,
} from "./goal-years";

describe("yearsMovieCountsToward", () => {
  it("collects unique watch years for watched or rewatch films", () => {
    const movie: MovieEntry = {
      slug: "a",
      title: "A",
      status: "rewatch",
      watchedDates: ["2024-01-01", "2026-06-01", "2024-12-01"],
    };
    expect(yearsMovieCountsToward(movie)).toEqual([2024, 2026]);
  });

  it("ignores watchlist films even with dates", () => {
    expect(
      yearsMovieCountsToward({
        slug: "b",
        title: "B",
        status: "watchlist",
        watchedDates: ["2026-01-01"],
      }),
    ).toEqual([]);
  });
});

describe("yearsSeriesCountsToward", () => {
  it("uses finishedAt when present on a caught-up series", () => {
    const series: SeriesEntry = {
      tvdbId: 1,
      slug: "a",
      title: "A",
      status: "completed",
      finishedAt: "2025-08-01",
      watchedEpisodes: [
        { season: 1, episode: 1, watchedAt: "2026-01-01" },
      ],
    };
    expect(yearsSeriesCountsToward(series)).toEqual([2025]);
  });

  it("falls back to the last regular episode watch date", () => {
    const series: SeriesEntry = {
      tvdbId: 2,
      slug: "b",
      title: "B",
      status: "up-to-date",
      watchedEpisodes: [
        { season: 0, episode: 1, watchedAt: "2024-01-01" },
        { season: 1, episode: 1, watchedAt: "2026-03-01" },
        { season: 1, episode: 2, watchedAt: "2026-04-01" },
      ],
    };
    expect(yearsSeriesCountsToward(series)).toEqual([2026]);
  });

  it("returns empty when not caught up", () => {
    expect(
      yearsSeriesCountsToward({
        tvdbId: 3,
        slug: "c",
        title: "C",
        status: "watching",
        numberOfEpisodes: 10,
        watchedEpisodes: [{ season: 1, episode: 1, watchedAt: "2026-01-01" }],
      }),
    ).toEqual([]);
  });
});

describe("isSeriesCaughtUp", () => {
  it("treats specials as irrelevant to season coverage fallback", () => {
    expect(
      isSeriesCaughtUp({
        tvdbId: 4,
        slug: "d",
        title: "D",
        status: "watching",
        numberOfSeasons: 2,
        watchedEpisodes: [
          { season: 0, episode: 1 },
          { season: 1, episode: 1 },
          { season: 2, episode: 1 },
        ],
      }),
    ).toBe(true);
  });
});

describe("yearsBookCountsToward", () => {
  it("prefers finishedAt, then reading history, then startedAt", () => {
    const withHistory: BookEntry = {
      googleBooksId: "1",
      slug: "a",
      status: "finished",
      readingHistory: [
        { date: "2024-01-01", page: 10 },
        { date: "2025-06-01", page: 200 },
      ],
    };
    expect(yearsBookCountsToward(withHistory, 2026)).toEqual([2025]);

    const withStart: BookEntry = {
      googleBooksId: "2",
      slug: "b",
      status: "finished",
      startedAt: "2023-01-01",
    };
    expect(yearsBookCountsToward(withStart, 2026)).toEqual([2023]);
  });

  it("uses the undated fallback year only for finished books without dates", () => {
    expect(
      yearsBookCountsToward(
        { googleBooksId: "3", slug: "c", status: "finished" },
        2026,
      ),
    ).toEqual([2026]);
    expect(
      yearsBookCountsToward(
        { googleBooksId: "4", slug: "d", status: "reading" },
        2026,
      ),
    ).toEqual([]);
  });
});
