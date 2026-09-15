import { describe, expect, it } from "vitest";
import { catalogCopy } from "@/content/copy/catalog";
import { catalogCopyPt } from "@/content/copy/pt/catalog";
import type { WatchedEpisode } from "./entities/series";
import {
  BOOK_STATUSES,
  hasWatchedAllReleasedEpisodes,
  journalProgressPercent,
  isWatchedMovieStatus,
  MOVIE_STATUSES,
  resolveJournalBookStatus,
  resolveJournalMovieStatus,
  resolveJournalSeriesStatus,
  SERIES_STATUSES,
  uniqueRegularWatchedCount,
  uniqueWatchDates,
  watchedSeasonNumbers,
} from "./journal-status";

const s1e1: WatchedEpisode = { season: 1, episode: 1 };
const s1e2: WatchedEpisode = { season: 1, episode: 2 };
const special: WatchedEpisode = { season: 0, episode: 1 };

describe("uniqueRegularWatchedCount", () => {
  it("counts each season+episode once and ignores specials", () => {
    expect(
      uniqueRegularWatchedCount([
        s1e1,
        { ...s1e1, watchedAt: "2026-02-01" },
        s1e2,
        special,
      ]),
    ).toBe(2);
  });
});

describe("hasWatchedAllReleasedEpisodes", () => {
  it("requires a known released total equalled by unique regular watches", () => {
    expect(hasWatchedAllReleasedEpisodes([s1e1, s1e2], 2)).toBe(true);
    expect(hasWatchedAllReleasedEpisodes([s1e1, s1e1], 2)).toBe(false);
    expect(hasWatchedAllReleasedEpisodes([s1e1, s1e2, s1e1], 2)).toBe(true);
  });

  it("treats extras beyond the released total as still complete", () => {
    expect(
      hasWatchedAllReleasedEpisodes(
        [s1e1, s1e2, { season: 1, episode: 3 }],
        2,
      ),
    ).toBe(true);
  });

  it("is false when the released total is unknown", () => {
    expect(hasWatchedAllReleasedEpisodes([s1e1], undefined)).toBe(false);
    expect(hasWatchedAllReleasedEpisodes([s1e1], 0)).toBe(false);
  });
});

describe("resolveJournalSeriesStatus", () => {
  it("keeps completed only when unique watches cover the released total", () => {
    expect(resolveJournalSeriesStatus("completed", [s1e1, s1e2], 2)).toBe(
      "completed",
    );
    expect(resolveJournalSeriesStatus("completed", [s1e1, s1e1], 2)).toBe(
      "paused",
    );
  });

  it("promotes any in-progress status to completed at 100% coverage", () => {
    expect(resolveJournalSeriesStatus("watching", [s1e1, s1e2], 2)).toBe(
      "completed",
    );
    expect(resolveJournalSeriesStatus("paused", [s1e1, s1e2], 2)).toBe(
      "completed",
    );
    expect(resolveJournalSeriesStatus("abandoned", [s1e1, s1e2], 2)).toBe(
      "completed",
    );
    expect(resolveJournalSeriesStatus("watchlist", [s1e1, s1e2], 2)).toBe(
      "completed",
    );
    expect(resolveJournalSeriesStatus("watching", [s1e1], 2)).toBe("watching");
    expect(resolveJournalSeriesStatus("paused", [s1e1], 10)).toBe("paused");
    expect(resolveJournalSeriesStatus("abandoned", [s1e1], 10)).toBe(
      "abandoned",
    );
  });

  it("keeps an empty watchlist and does not invent coverage", () => {
    expect(resolveJournalSeriesStatus("watchlist", [], 2)).toBe("watchlist");
    expect(resolveJournalSeriesStatus("watchlist", [s1e1], 2)).toBe("watching");
  });

  it("keeps completed when the released total is unknown", () => {
    expect(resolveJournalSeriesStatus("completed", [s1e1], undefined)).toBe(
      "completed",
    );
  });

  it("resolves the legacy up-to-date alias to watching, or completed at 100%", () => {
    expect(resolveJournalSeriesStatus("up-to-date", [s1e1], 10)).toBe(
      "watching",
    );
    expect(resolveJournalSeriesStatus("up-to-date", [s1e1, s1e2], 2)).toBe(
      "completed",
    );
  });
});

describe("isWatchedMovieStatus", () => {
  it("counts any viewing, and excludes the watchlist", () => {
    expect(isWatchedMovieStatus("watched")).toBe(true);
    expect(isWatchedMovieStatus("rewatch")).toBe(true);
    expect(isWatchedMovieStatus("watchlist")).toBe(false);
  });
});

describe("watchedSeasonNumbers", () => {
  it("collects regular seasons and ignores specials", () => {
    expect([
      ...watchedSeasonNumbers([s1e1, s1e2, { season: 3, episode: 1 }, special]),
    ]).toEqual([1, 3]);
  });
});

describe("status vocabularies", () => {
  it("labels every resolvable status in both locales, and nothing else", () => {
    for (const catalog of [catalogCopy, catalogCopyPt]) {
      expect(Object.keys(catalog.status.films).sort()).toEqual(
        [...MOVIE_STATUSES].sort(),
      );
      expect(Object.keys(catalog.status.series).sort()).toEqual(
        [...SERIES_STATUSES].sort(),
      );
      expect(Object.keys(catalog.status.books).sort()).toEqual(
        [...BOOK_STATUSES].sort(),
      );
    }
  });
});

describe("uniqueWatchDates / resolveJournalMovieStatus", () => {
  it("dedupes and sorts dates", () => {
    expect(
      uniqueWatchDates(["2026-08-25", "2026-08-09", "2026-08-25"]),
    ).toEqual(["2026-08-09", "2026-08-25"]);
  });

  it("derives watched and rewatch from unique date count", () => {
    expect(resolveJournalMovieStatus("watchlist", ["2024-01-01"])).toBe(
      "watched",
    );
    expect(
      resolveJournalMovieStatus("watched", ["2026-08-25", "2026-08-09"]),
    ).toBe("rewatch");
    expect(resolveJournalMovieStatus("rewatch", ["2024-01-01"])).toBe(
      "watched",
    );
  });

  it("keeps an explicit watched mark with no dates, and a watchlist with none", () => {
    expect(resolveJournalMovieStatus("watched", undefined)).toBe("watched");
    expect(resolveJournalMovieStatus("watchlist", [])).toBe("watchlist");
    expect(resolveJournalMovieStatus("rewatch", [])).toBe("watched");
  });
});

describe("resolveJournalBookStatus", () => {
  it("promotes to finished when the furthest page reaches the total", () => {
    expect(
      resolveJournalBookStatus({
        status: "reading",
        currentPage: 380,
        customPageCount: 380,
      }),
    ).toEqual({ status: "finished", currentPage: 380 });
    expect(
      resolveJournalBookStatus({
        status: "abandoned",
        currentPage: 10,
        customPageCount: 200,
        readingHistory: [{ date: "2026-01-01", page: 200 }],
      }),
    ).toEqual({ status: "finished", currentPage: 200 });
  });

  it("fills currentPage to the total for finished books, even with earlier history", () => {
    expect(
      resolveJournalBookStatus({ status: "finished", customPageCount: 416 }),
    ).toEqual({ status: "finished", currentPage: 416 });
    expect(
      resolveJournalBookStatus({
        status: "finished",
        currentPage: 100,
        customPageCount: 320,
        readingHistory: [{ date: "2020-01-15", page: 100 }],
      }),
    ).toEqual({ status: "finished", currentPage: 320 });
  });

  it("promotes want-to-read once a page is recorded", () => {
    expect(
      resolveJournalBookStatus({
        status: "want-to-read",
        currentPage: 12,
        customPageCount: 300,
      }),
    ).toEqual({ status: "reading", currentPage: 12 });
  });

  it("keeps paused and abandoned while pages remain", () => {
    expect(
      resolveJournalBookStatus({
        status: "paused",
        currentPage: 40,
        customPageCount: 300,
      }),
    ).toEqual({ status: "paused", currentPage: 40 });
    expect(
      resolveJournalBookStatus({
        status: "abandoned",
        currentPage: 12,
        customPageCount: 300,
      }),
    ).toEqual({ status: "abandoned", currentPage: 12 });
  });

  it("takes the furthest page from the reading history", () => {
    expect(
      resolveJournalBookStatus({
        status: "reading",
        currentPage: 80,
        customPageCount: 300,
        readingHistory: [
          { date: "2026-01-01", page: 120 },
          { date: "2026-02-01" },
        ],
      }),
    ).toEqual({ status: "reading", currentPage: 120 });
  });
});

describe("journalProgressPercent", () => {
  it("rounds a known fraction and stays null without a total", () => {
    expect(journalProgressPercent(80, 320)).toBe(25);
    expect(journalProgressPercent(6, 6)).toBe(100);
    expect(journalProgressPercent(4, 3)).toBe(100);
    expect(journalProgressPercent(10, undefined)).toBeNull();
    expect(journalProgressPercent(undefined, 320)).toBeNull();
  });
});
