import { describe, expect, it } from "vitest";
import {
  bookCountsTowardYearGoal,
  computeGoalProgress,
  computeLifetimeStats,
  getLifetimeStats,
  movieCountsTowardYearGoal,
  isSeriesCaughtUp,
  seriesCountsTowardYearGoal,
} from "./stats";
import { DEFAULT_EPISODE_RUNTIME_MINUTES } from "./series";
import type { BookEntry, MovieEntry, SeriesEntry } from "@/domain/entities";

function movie(
  overrides: Partial<MovieEntry> & Pick<MovieEntry, "slug" | "title" | "status">,
): MovieEntry {
  return overrides;
}

function seriesEntry(
  overrides: Partial<SeriesEntry> &
    Pick<SeriesEntry, "slug" | "title" | "status" | "tvdbId">,
): SeriesEntry {
  return {
    watchedEpisodes: [],
    ...overrides,
  };
}

function book(
  overrides: Partial<BookEntry> &
    Pick<BookEntry, "slug" | "status" | "googleBooksId">,
): BookEntry {
  return overrides;
}

describe("year goal filters", () => {
  it("counts movies with a watch date in the goal year", () => {
    expect(
      movieCountsTowardYearGoal(
        movie({
          slug: "a",
          title: "A",
          status: "watched",
          watchedDates: ["2025-12-01", "2026-01-15"],
        }),
        2026,
      ),
    ).toBe(true);
    expect(
      movieCountsTowardYearGoal(
        movie({
          slug: "b",
          title: "B",
          status: "watched",
          watchedDates: ["2025-06-01"],
        }),
        2026,
      ),
    ).toBe(false);
  });

  it("counts completed series by finishedAt year", () => {
    expect(
      seriesCountsTowardYearGoal(
        seriesEntry({
          tvdbId: 1,
          slug: "a",
          title: "A",
          status: "completed",
          finishedAt: "2026-03-01",
        }),
        2026,
      ),
    ).toBe(true);
    expect(
      seriesCountsTowardYearGoal(
        seriesEntry({
          tvdbId: 2,
          slug: "b",
          title: "B",
          status: "completed",
          finishedAt: "2025-03-01",
        }),
        2026,
      ),
    ).toBe(false);
  });

  it("counts watching series caught up with released episodes in the goal year", () => {
    const steal = seriesEntry({
      tvdbId: 3,
      slug: "steal",
      title: "Steal",
      status: "watching",
      numberOfSeasons: 1,
      numberOfEpisodes: 6,
      watchedEpisodes: [
        { season: 1, episode: 1, watchedAt: "2026-02-08" },
        { season: 1, episode: 2, watchedAt: "2026-02-16" },
        { season: 1, episode: 3, watchedAt: "2026-02-16" },
        { season: 1, episode: 4, watchedAt: "2026-02-16" },
        { season: 1, episode: 5, watchedAt: "2026-02-16" },
        { season: 1, episode: 6, watchedAt: "2026-02-16" },
      ],
    });
    expect(isSeriesCaughtUp(steal)).toBe(true);
    expect(seriesCountsTowardYearGoal(steal, 2026)).toBe(true);

    // New season released in TMDB → no longer caught up for the goal.
    expect(
      isSeriesCaughtUp({
        ...steal,
        numberOfSeasons: 2,
        numberOfEpisodes: 12,
      }),
    ).toBe(false);
    expect(
      seriesCountsTowardYearGoal(
        { ...steal, numberOfSeasons: 2, numberOfEpisodes: 12 },
        2026,
      ),
    ).toBe(false);
  });

  it("does not count paused or incomplete watching series", () => {
    expect(
      seriesCountsTowardYearGoal(
        seriesEntry({
          tvdbId: 4,
          slug: "paused",
          title: "Paused",
          status: "paused",
          numberOfEpisodes: 6,
          watchedEpisodes: [
            { season: 1, episode: 1, watchedAt: "2026-01-01" },
            { season: 1, episode: 2, watchedAt: "2026-01-02" },
            { season: 1, episode: 3, watchedAt: "2026-01-03" },
            { season: 1, episode: 4, watchedAt: "2026-01-04" },
            { season: 1, episode: 5, watchedAt: "2026-01-05" },
            { season: 1, episode: 6, watchedAt: "2026-01-06" },
          ],
        }),
        2026,
      ),
    ).toBe(false);
    expect(
      seriesCountsTowardYearGoal(
        seriesEntry({
          tvdbId: 5,
          slug: "mid",
          title: "Mid",
          status: "watching",
          numberOfEpisodes: 8,
          watchedEpisodes: [
            { season: 1, episode: 1, watchedAt: "2026-01-01" },
            { season: 1, episode: 2, watchedAt: "2026-01-02" },
          ],
        }),
        2026,
      ),
    ).toBe(false);
  });

  it("counts finished books by activity date, and undated finished books", () => {
    expect(
      bookCountsTowardYearGoal(
        book({
          googleBooksId: "1",
          slug: "a",
          status: "finished",
          finishedAt: "2026-02-01",
          customPageCount: 200,
        }),
        2026,
      ),
    ).toBe(true);
    expect(
      bookCountsTowardYearGoal(
        book({
          googleBooksId: "2",
          slug: "b",
          status: "finished",
          readingHistory: [{ date: "2025-06-01", page: 10 }],
          customPageCount: 200,
        }),
        2026,
      ),
    ).toBe(false);
    expect(
      bookCountsTowardYearGoal(
        book({
          googleBooksId: "3",
          slug: "c",
          status: "finished",
          customPageCount: 200,
        }),
        2026,
      ),
    ).toBe(true);
  });
});

describe("computeGoalProgress", () => {
  it("scopes current totals to the goal year", () => {
    const progress = computeGoalProgress(
      { year: 2026, movies: 100, series: 20, books: 10, pages: 1000 },
      [
        movie({
          slug: "in-year",
          title: "In",
          status: "watched",
          watchedDates: ["2026-01-01"],
        }),
        movie({
          slug: "prior-year",
          title: "Prior",
          status: "watched",
          watchedDates: ["2025-01-01"],
        }),
        movie({
          slug: "watchlist",
          title: "List",
          status: "watchlist",
        }),
      ],
      [
        seriesEntry({
          tvdbId: 1,
          slug: "done-2026",
          title: "Done",
          status: "completed",
          finishedAt: "2026-05-01",
        }),
        seriesEntry({
          tvdbId: 2,
          slug: "done-2025",
          title: "Old",
          status: "completed",
          finishedAt: "2025-05-01",
        }),
      ],
      [
        book({
          googleBooksId: "1",
          slug: "read-2026",
          status: "finished",
          finishedAt: "2026-04-01",
          customPageCount: 250,
        }),
        book({
          googleBooksId: "2",
          slug: "read-2025",
          status: "finished",
          finishedAt: "2025-04-01",
          customPageCount: 400,
        }),
        book({
          googleBooksId: "3",
          slug: "undated",
          status: "finished",
          customPageCount: 100,
        }),
      ],
    );

    expect(progress.find((g) => g.key === "movies")).toMatchObject({
      current: 1,
      target: 100,
      percent: 1,
      remaining: 99,
    });
    expect(progress.find((g) => g.key === "series")).toMatchObject({
      current: 1,
      percent: 5,
      remaining: 19,
    });
    expect(progress.find((g) => g.key === "books")).toMatchObject({
      current: 2,
      percent: 20,
      remaining: 8,
    });
    expect(progress.find((g) => g.key === "pages")).toMatchObject({
      current: 350,
      percent: 35,
      remaining: 650,
    });
  });

  it("reports real percent above 100 and avoids divide-by-zero", () => {
    const progress = computeGoalProgress(
      { year: 2026, movies: 0, series: 1, books: 1, pages: 1 },
      [
        movie({
          slug: "a",
          title: "A",
          status: "watched",
          watchedDates: ["2026-01-01"],
        }),
      ],
      [
        seriesEntry({
          tvdbId: 1,
          slug: "a",
          title: "A",
          status: "completed",
          finishedAt: "2026-01-01",
        }),
        seriesEntry({
          tvdbId: 2,
          slug: "b",
          title: "B",
          status: "completed",
          finishedAt: "2026-02-01",
        }),
        seriesEntry({
          tvdbId: 3,
          slug: "c",
          title: "C",
          status: "completed",
          finishedAt: "2026-03-01",
        }),
        seriesEntry({
          tvdbId: 4,
          slug: "d",
          title: "D",
          status: "completed",
          finishedAt: "2026-04-01",
        }),
      ],
      [],
    );

    expect(progress.find((g) => g.key === "movies")).toMatchObject({
      percent: 0,
      exceeded: false,
      remaining: 0,
    });
    expect(progress.find((g) => g.key === "series")).toMatchObject({
      percent: 400,
      exceeded: true,
      remaining: 0,
    });
  });
});

describe("computeLifetimeStats", () => {
  it("rounds watched hours from combined runtime", () => {
    const stats = computeLifetimeStats(
      {
        total: 0,
        watched: 0,
        watchlist: 0,
        favorites: 0,
        withReview: 0,
        averageRating: null,
        totalRuntimeMinutes: 90,
      },
      {
        total: 0,
        watching: 0,
        completed: 0,
        paused: 0,
        abandoned: 0,
        watchlist: 0,
        favorites: 0,
        watchedEpisodes: 0,
        withProgress: 0,
        totalRuntimeMinutes: 30,
      },
      {
        total: 0,
        finished: 0,
        reading: 0,
        favorites: 0,
        pagesRead: 120,
      },
    );

    expect(stats).toEqual({ pagesRead: 120, watchedHours: 2 });
  });

  it("reads live catalog totals", () => {
    const stats = getLifetimeStats();
    expect(stats.pagesRead).toBeGreaterThan(0);
    expect(stats.watchedHours).toBeGreaterThan(0);
  });
});

describe("DEFAULT_EPISODE_RUNTIME_MINUTES", () => {
  it("uses a 45-minute fallback for unknown episode lengths", () => {
    expect(DEFAULT_EPISODE_RUNTIME_MINUTES).toBe(45);
  });
});
