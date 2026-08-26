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

  it("rejects a non-array payload and non-object rows", () => {
    expect(() => parseMovieEntries({ slug: "heat" })).toThrow(/must be an array/);
    expect(() => parseMovieEntries(["heat"])).toThrow(/must be an object/);
  });

  it("rejects empty required strings and mistyped optionals", () => {
    expect(() => parseMovieEntries([{ ...base, slug: "" }])).toThrow(/slug/);
    expect(() => parseMovieEntries([{ ...base, favorite: "yes" }])).toThrow(
      /favorite/,
    );
    expect(() => parseMovieEntries([{ ...base, tags: [1] }])).toThrow(/tags/);
  });

  it("parses a valid movie and optional fields", () => {
    const [movie] = parseMovieEntries([
      {
        ...base,
        tmdbId: 949,
        tvtimeUuid: "abc",
        rating: 4,
        favorite: true,
        watchedDates: ["2024-01-02"],
        releaseDate: "1995-12-15",
        runtimeMinutes: 170,
      },
    ]);
    expect(movie.slug).toBe("heat");
    expect(movie.rating).toBe(4);
    expect(movie.watchedDates).toEqual(["2024-01-02"]);
  });

  it("rejects invalid status, rating, and negatives", () => {
    expect(() =>
      parseMovieEntries([{ ...base, status: "finished" }]),
    ).toThrow(/status/);
    expect(() => parseMovieEntries([{ ...base, rating: 4.5 }])).toThrow(
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
    expect(() =>
      parseMovieEntries([
        { ...base, slug: "a", tvtimeUuid: "same" },
        { ...base, slug: "b", title: "Other", tvtimeUuid: "same" },
      ]),
    ).toThrow(/duplicate tvtimeUuid/);
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

  it("rejects a non-array payload and missing watchedEpisodes", () => {
    expect(() => parseSeriesEntries({ slug: "the-wire" })).toThrow(
      /must be an array/,
    );
    expect(() =>
      parseSeriesEntries([{ ...base, watchedEpisodes: undefined }]),
    ).toThrow(/watchedEpisodes/);
  });

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

  it("rejects duplicate tvdbId and slug", () => {
    expect(() =>
      parseSeriesEntries([
        { ...base, slug: "a" },
        { ...base, slug: "b", title: "Other" },
      ]),
    ).toThrow(/duplicate tvdbId/);
    expect(() =>
      parseSeriesEntries([
        { ...base, slug: "a", tvdbId: 1 },
        { ...base, slug: "a", title: "Other", tvdbId: 2 },
      ]),
    ).toThrow(/duplicate slug/);
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

  it("rejects a non-array payload", () => {
    expect(() => parseBookEntries({ slug: "dune" })).toThrow(/must be an array/);
  });

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
    expect(() =>
      parseBookEntries([
        {
          ...base,
          quotes: [{ text: "Fear is the mind-killer", page: 200 }],
        },
      ]),
    ).toThrow(/quotes/);
    expect(() =>
      parseBookEntries([
        {
          ...base,
          startedAt: "2024-06-01",
          finishedAt: "2024-01-01",
        },
      ]),
    ).toThrow(/startedAt/);
  });

  it("rejects duplicate googleBooksId and slug", () => {
    expect(() =>
      parseBookEntries([
        { ...base, slug: "a" },
        { ...base, slug: "b", title: "Other" },
      ]),
    ).toThrow(/duplicate googleBooksId/);
    expect(() =>
      parseBookEntries([
        { ...base, slug: "a", googleBooksId: "one" },
        { ...base, slug: "a", title: "Other", googleBooksId: "two" },
      ]),
    ).toThrow(/duplicate slug/);
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

  it("rejects a non-object payload, missing keys, and out-of-range years", () => {
    expect(() => parseGoals([2026])).toThrow(/must be an object/);
    expect(() => parseGoals({ year: 2026, movies: 1 })).toThrow(/must include/);
    expect(() =>
      parseGoals({ year: 1899, movies: 1, books: 1, series: 1, pages: 1 }),
    ).toThrow(/year/);
    expect(() =>
      parseGoals({ year: 2101, movies: 1, books: 1, series: 1, pages: 1 }),
    ).toThrow(/year/);
  });
});

describe("real journal fixtures", () => {
  it(
    "accepts repository-managed JSON files",
    async () => {
      const movies = await import("@/data/movies.json");
      const series = await import("@/data/series.json");
      const books = await import("@/data/books.json");
      const goals = await import("@/data/goals.json");

      expect(parseMovieEntries(movies.default).length).toBeGreaterThan(0);
      expect(parseSeriesEntries(series.default).length).toBeGreaterThan(0);
      expect(parseBookEntries(books.default).length).toBeGreaterThan(0);
      expect(parseGoals(goals.default).year).toBe(2026);
    },
    20_000,
  );
});
