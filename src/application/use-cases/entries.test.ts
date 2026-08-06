import { describe, expect, it } from "vitest";
import {
  bookActivityDate,
  movieActivityDate,
  seriesActivityDate,
  getHomeFeeds,
  listAllEntries,
} from "./entries";
import type { BookEntry, MovieEntry, SeriesEntry } from "@/domain/entities";

describe("activity dates", () => {
  it("uses the latest movie watch date", () => {
    const movie = {
      slug: "x",
      title: "X",
      status: "watched",
      watchedDates: ["2024-01-01", "2025-06-01", "2024-12-01"],
    } satisfies MovieEntry;

    expect(movieActivityDate(movie)).toBe("2025-06-01");
  });

  it("uses the latest series activity among finish and episode dates", () => {
    const series = {
      tvdbId: 1,
      slug: "x",
      title: "X",
      status: "completed",
      finishedAt: "2025-01-10",
      watchedEpisodes: [{ season: 1, episode: 1, watchedAt: "2025-01-20" }],
    } satisfies SeriesEntry;

    expect(seriesActivityDate(series)).toBe("2025-01-20");
  });

  it("returns null when a book has no dates", () => {
    const book = {
      googleBooksId: "id",
      slug: "x",
      title: "X",
      status: "finished",
    } satisfies BookEntry;

    expect(bookActivityDate(book)).toBeNull();
  });
});

describe("catalog feeds", () => {
  it("lists all entries with href and posterUrl fields", () => {
    const entries = listAllEntries();
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0]).toMatchObject({
      medium: expect.any(String),
      slug: expect.any(String),
      title: expect.any(String),
      href: expect.stringMatching(/^\//),
    });
    expect(entries[0]).toHaveProperty("posterUrl");
  });

  it("orders home feeds without duplicate collect passes diverging", () => {
    const { recentEntries, favoriteEntries } = getHomeFeeds(5);
    expect(recentEntries.length).toBeLessThanOrEqual(5);
    expect(favoriteEntries.length).toBeLessThanOrEqual(5);
    expect(favoriteEntries.every((entry) => entry.href.length > 0)).toBe(true);
  });
});
