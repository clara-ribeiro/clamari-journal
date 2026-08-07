import { describe, expect, it } from "vitest";
import {
  parseBookEntries,
  parseGoals,
  parseIsoDate,
  parseMovieEntries,
  parseSeriesEntries,
} from "./parse-json";

describe("parseIsoDate", () => {
  it("accepts calendar YYYY-MM-DD dates", () => {
    expect(parseIsoDate("2024-02-29", "x")).toBe("2024-02-29");
  });

  it("rejects malformed and impossible dates", () => {
    expect(() => parseIsoDate("2024/02/29", "x")).toThrow(/ISO date/);
    expect(() => parseIsoDate("2023-02-29", "x")).toThrow(/valid calendar/);
    expect(() => parseIsoDate("0001-01-01", "x")).toThrow(/year must be/);
  });
});

describe("parseMovieEntries", () => {
  const base = {
    slug: "heat",
    title: "Heat",
    status: "watched",
  };

  it("parses a valid movie and optional fields", () => {
    const [movie] = parseMovieEntries([
      {
        ...base,
        tmdbId: 949,
        tvtimeUuid: "abc",
        rating: 4.5,
        favorite: true,
        watchedDates: ["2024-01-02"],
        releaseDate: "1995-12-15",
        runtimeMinutes: 170,
      },
    ]);
    expect(movie.slug).toBe("heat");
    expect(movie.rating).toBe(4.5);
    expect(movie.watchedDates).toEqual(["2024-01-02"]);
  });

  it("rejects invalid status, rating, and negatives", () => {
    expect(() =>
      parseMovieEntries([{ ...base, status: "finished" }]),
    ).toThrow(/status/);
    expect(() => parseMovieEntries([{ ...base, rating: 4.25 }])).toThrow(
      /rating/,
    );
    expect(() =>
      parseMovieEntries([{ ...base, runtimeMinutes: -1 }]),
    ).toThrow(/runtimeMinutes/);
  });

  it("rejects duplicate slug and provider keys", () => {
    expect(() =>
      parseMovieEntries([
        { ...base, slug: "a" },
        { ...base, slug: "a", title: "Other" },
      ]),
    ).toThrow(/duplicate slug/);
    expect(() =>
      parseMovieEntries([
        { ...base, slug: "a", tmdbId: 1 },
        { ...base, slug: "b", title: "Other", tmdbId: 1 },
      ]),
    ).toThrow(/duplicate tmdbId/);
  });
});

describe("parseSeriesEntries", () => {
  const base = {
    tvdbId: 123,
    slug: "the-wire",
    title: "The Wire",
    status: "completed",
    watchedEpisodes: [{ season: 1, episode: 1, watchedAt: "2018-01-01" }],
  };

  it("parses episodes and chronology", () => {
    const [series] = parseSeriesEntries([
      {
        ...base,
        startedAt: "2018-01-01",
        finishedAt: "2018-06-01",
      },
    ]);
    expect(series.watchedEpisodes[0]?.season).toBe(1);
  });

  it("rejects invalid episode numbers and inverted dates", () => {
    expect(() =>
      parseSeriesEntries([
        {
          ...base,
          watchedEpisodes: [{ season: 0, episode: 1 }],
        },
      ]),
    ).toThrow(/season/);
    expect(() =>
      parseSeriesEntries([
        {
          ...base,
          startedAt: "2019-01-01",
          finishedAt: "2018-01-01",
        },
      ]),
    ).toThrow(/startedAt/);
  });

  it("rejects duplicate tvdbId", () => {
    expect(() =>
      parseSeriesEntries([
        { ...base, slug: "a" },
        { ...base, slug: "b", title: "Other" },
      ]),
    ).toThrow(/duplicate tvdbId/);
  });
});

describe("parseBookEntries", () => {
  const base = {
    googleBooksId: "abc123",
    slug: "dune",
    title: "Dune",
    status: "reading",
    customPageCount: 100,
  };

  it("deep-parses reading history and quotes", () => {
    const [book] = parseBookEntries([
      {
        ...base,
        currentPage: 40,
        format: "ebook",
        readingHistory: [{ date: "2024-03-01", page: 20, note: "slow start" }],
        quotes: [{ text: "Fear is the mind-killer", page: 12 }],
      },
    ]);
    expect(book.readingHistory?.[0]?.page).toBe(20);
    expect(book.quotes?.[0]?.text).toMatch(/Fear/);
  });

  it("rejects progress beyond customPageCount and bad format", () => {
    expect(() =>
      parseBookEntries([{ ...base, currentPage: 101 }]),
    ).toThrow(/currentPage/);
    expect(() =>
      parseBookEntries([
        {
          ...base,
          readingHistory: [{ date: "2024-03-01", page: 200 }],
        },
      ]),
    ).toThrow(/readingHistory/);
    expect(() =>
      parseBookEntries([{ ...base, format: "paperback" }]),
    ).toThrow(/format/);
  });

  it("rejects duplicate googleBooksId", () => {
    expect(() =>
      parseBookEntries([
        { ...base, slug: "a" },
        { ...base, slug: "b", title: "Other" },
      ]),
    ).toThrow(/duplicate googleBooksId/);
  });
});

describe("parseGoals", () => {
  it("parses valid goals", () => {
    expect(
      parseGoals({ year: 2026, movies: 50, books: 20, series: 10, pages: 6000 }),
    ).toEqual({
      year: 2026,
      movies: 50,
      books: 20,
      series: 10,
      pages: 6000,
    });
  });

  it("rejects negative targets", () => {
    expect(() =>
      parseGoals({ year: 2026, movies: -1, books: 1, series: 1, pages: 1 }),
    ).toThrow(/movies/);
  });
});

describe("real journal fixtures", () => {
  it("accepts repository-managed JSON files", async () => {
    const movies = await import("@/data/movies.json");
    const series = await import("@/data/series.json");
    const books = await import("@/data/books.json");
    const goals = await import("@/data/goals.json");

    expect(parseMovieEntries(movies.default).length).toBeGreaterThan(0);
    expect(parseSeriesEntries(series.default).length).toBeGreaterThan(0);
    expect(parseBookEntries(books.default).length).toBeGreaterThan(0);
    expect(parseGoals(goals.default).year).toBe(2026);
  });
});
