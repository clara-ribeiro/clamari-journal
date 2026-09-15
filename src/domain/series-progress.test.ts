import { describe, expect, it } from "vitest";
import type { WatchedEpisode } from "./entities/series";
import {
  hasWatchedAllReleasedEpisodes,
  resolveJournalSeriesStatus,
  uniqueRegularWatchedCount,
} from "./series-progress";

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
});
