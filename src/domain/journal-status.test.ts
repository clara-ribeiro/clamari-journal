import { describe, expect, it } from "vitest";
import type { WatchedEpisode } from "./entities/series";
import {
  hasWatchedAllReleasedEpisodes,
  resolveJournalBookStatus,
  resolveJournalMovieStatus,
  resolveJournalSeriesStatus,
  uniqueRegularWatchedCount,
  uniqueWatchDates,
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

  it("treats up-to-date as watching when coverage is incomplete", () => {
    expect(resolveJournalSeriesStatus("up-to-date", [s1e1], 10)).toBe(
      "watching",
    );
    expect(resolveJournalSeriesStatus("up-to-date", [s1e1, s1e2], 2)).toBe(
      "completed",
    );
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
      resolveJournalBookStatus("reading", 380, 380, undefined),
    ).toEqual({ status: "finished", currentPage: 380 });
    expect(
      resolveJournalBookStatus("abandoned", 10, 200, [
        { page: 200 },
      ]),
    ).toEqual({ status: "finished", currentPage: 200 });
  });

  it("fills currentPage for finished books when only the total is known", () => {
    expect(
      resolveJournalBookStatus("finished", undefined, 416, undefined),
    ).toEqual({ status: "finished", currentPage: 416 });
  });

  it("promotes want-to-read once a page is recorded", () => {
    expect(
      resolveJournalBookStatus("want-to-read", 12, 300, undefined),
    ).toEqual({ status: "reading", currentPage: 12 });
  });

  it("keeps paused and abandoned while pages remain", () => {
    expect(
      resolveJournalBookStatus("paused", 40, 300, undefined),
    ).toEqual({ status: "paused", currentPage: 40 });
    expect(
      resolveJournalBookStatus("abandoned", 12, 300, undefined),
    ).toEqual({ status: "abandoned", currentPage: 12 });
  });
});
