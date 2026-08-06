import { describe, expect, it } from "vitest";
import {
  computeGoalProgress,
  computeLifetimeStats,
  getLifetimeStats,
} from "./stats";
import { DEFAULT_EPISODE_RUNTIME_MINUTES } from "./series";

describe("computeGoalProgress", () => {
  it("computes percent and remaining from targets", () => {
    const progress = computeGoalProgress(
      { year: 2026, movies: 100, series: 20, books: 10, pages: 1000 },
      {
        total: 0,
        watched: 40,
        watchlist: 0,
        favorites: 0,
        withReview: 0,
        averageRating: null,
        totalRuntimeMinutes: 0,
      },
      {
        total: 0,
        watching: 0,
        completed: 5,
        paused: 0,
        abandoned: 0,
        watchlist: 0,
        favorites: 0,
        watchedEpisodes: 0,
        withProgress: 0,
        totalRuntimeMinutes: 0,
      },
      {
        total: 0,
        finished: 2,
        reading: 0,
        favorites: 0,
        pagesRead: 250,
      },
    );

    expect(progress.find((g) => g.key === "movies")).toMatchObject({
      current: 40,
      target: 100,
      percent: 40,
      remaining: 60,
    });
    expect(progress.find((g) => g.key === "pages")).toMatchObject({
      current: 250,
      percent: 25,
      remaining: 750,
    });
  });

  it("clamps percent at 100 and avoids divide-by-zero", () => {
    const progress = computeGoalProgress(
      { year: 2026, movies: 0, series: 1, books: 1, pages: 1 },
      {
        total: 0,
        watched: 3,
        watchlist: 0,
        favorites: 0,
        withReview: 0,
        averageRating: null,
        totalRuntimeMinutes: 0,
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
        totalRuntimeMinutes: 0,
      },
      {
        total: 0,
        finished: 0,
        reading: 0,
        favorites: 0,
        pagesRead: 0,
      },
    );

    expect(progress.find((g) => g.key === "movies")).toMatchObject({
      percent: 0,
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
