import { describe, expect, it } from "vitest";
import {
  bookActivityDate,
  movieActivityDate,
  seriesActivityDate,
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
