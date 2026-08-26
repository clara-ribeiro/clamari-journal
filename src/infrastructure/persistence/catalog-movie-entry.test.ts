import { describe, expect, it } from "vitest";
import type { MovieEntry } from "@/domain/entities";
import {
  allocateMovieSlug,
  buildMovieEntry,
  CatalogMovieError,
  findMovieByTmdbId,
  findSlugInsertIndex,
  mergeMovieJournal,
  movieEntryToJson,
  parseMovieQuery,
  resolveMovieSearch,
} from "./catalog-movie-entry";

const heat = {
  id: 949,
  title: "Heat",
  originalTitle: "Heat",
  year: 1995,
  releaseDate: "1995-12-15",
};

const heat1986 = {
  id: 10876,
  title: "Heat",
  originalTitle: "Heat",
  year: 1986,
  releaseDate: "1986-03-13",
};

const heatwave = {
  id: 1,
  title: "Heatwave",
  year: 2022,
  releaseDate: "2022-01-01",
};

describe("parseMovieQuery", () => {
  it("extracts a trailing year in parentheses", () => {
    expect(parseMovieQuery("Heat (1995)")).toEqual({
      query: "Heat",
      year: 1995,
    });
  });

  it("returns the trimmed query when no year is present", () => {
    expect(parseMovieQuery("  Poor Things  ")).toEqual({
      query: "Poor Things",
    });
  });
});

describe("resolveMovieSearch", () => {
  it("returns none when there are no usable hits", () => {
    expect(resolveMovieSearch([])).toEqual({ status: "none" });
    expect(resolveMovieSearch([{ id: 0, title: "Bad" }])).toEqual({
      status: "none",
    });
  });

  it("picks the only remaining hit", () => {
    expect(resolveMovieSearch([heat, heat1986], { year: 1995 })).toEqual({
      status: "match",
      hit: heat,
    });
  });

  it("picks an original-title exact match", () => {
    const substance = {
      id: 3,
      title: "A substância",
      originalTitle: "The Substance",
      year: 2024,
    };
    expect(
      resolveMovieSearch(
        [{ id: 1, title: "Something Else", year: 2020 }, substance],
        { query: "the substance" },
      ),
    ).toEqual({ status: "match", hit: substance });
  });

  it("picks an exact title when several results remain", () => {
    expect(
      resolveMovieSearch([heatwave, heat], { query: "Heat" }),
    ).toEqual({ status: "match", hit: heat });
  });

  it("stays ambiguous when two films share the exact title", () => {
    const result = resolveMovieSearch([heat, heat1986, heatwave], {
      query: "Heat",
    });
    expect(result).toEqual({ status: "ambiguous", hits: [heat, heat1986] });
  });

  it("resolves by tmdb id even among duplicates", () => {
    expect(
      resolveMovieSearch([heat, heat1986], { tmdbId: 10876 }),
    ).toEqual({ status: "match", hit: heat1986 });
    expect(resolveMovieSearch([heat], { tmdbId: 1 })).toEqual({
      status: "none",
    });
  });
});

describe("allocateMovieSlug", () => {
  it("uses the title slug, then year, then a numeric suffix", () => {
    expect(allocateMovieSlug("Heat", 1995, [])).toBe("heat");
    expect(allocateMovieSlug("Heat", 1995, ["heat"])).toBe("heat-1995");
    expect(allocateMovieSlug("Heat", 1995, ["heat", "heat-1995"])).toBe(
      "heat-1995-2",
    );
    expect(allocateMovieSlug("Heat", undefined, ["heat"])).toBe("heat-2");
  });
});

describe("buildMovieEntry", () => {
  it("builds a watched catalog row from TMDB details", () => {
    const entry = buildMovieEntry(
      {
        tmdbId: 1022796,
        title: "Poor Things",
        releaseDate: "2023-12-07",
        runtimeMinutes: 141,
        posterPath: "/abc.jpg",
      },
      {
        rating: 4,
        favorite: true,
        watchedDates: ["2024-03-12"],
        tags: ["yorgos"],
        reviewSlug: "poor-things",
      },
      [],
    );

    expect(entry).toMatchObject({
      slug: "poor-things",
      title: "Poor Things",
      status: "watched",
      tmdbId: 1022796,
      posterPath: "/abc.jpg",
      rating: 4,
      favorite: true,
      reviewSlug: "poor-things",
    });
  });

  it("rejects invalid identifiers, titles, statuses, and ratings", () => {
    expect(() =>
      buildMovieEntry({ tmdbId: 0, title: "X" }, {}, []),
    ).toThrow(CatalogMovieError);
    expect(() =>
      buildMovieEntry({ tmdbId: 1, title: "   " }, {}, []),
    ).toThrow(/title is required/);
    expect(() =>
      buildMovieEntry(
        { tmdbId: 1, title: "X" },
        { status: "finished" as never },
        [],
      ),
    ).toThrow(/invalid status/);
    expect(() =>
      buildMovieEntry({ tmdbId: 1, title: "X" }, { rating: 4.25 as never }, []),
    ).toThrow(/whole-star/);
    expect(() =>
      buildMovieEntry(
        { tmdbId: 1, title: "X" },
        { reviewSlug: "Not-Kebab" },
        [],
      ),
    ).toThrow(/reviewSlug/);
  });

  it("omits empty optional strings and defaults status to watched", () => {
    const entry = buildMovieEntry(
      { tmdbId: 2, title: "X", posterPath: "  ", releaseDate: "ab" },
      { tags: [" ", "noir", "noir"], watchLocation: "  " },
      [],
    );
    expect(entry.status).toBe("watched");
    expect(entry.posterPath).toBeUndefined();
    expect(entry.tags).toEqual(["noir"]);
    expect(entry.watchLocation).toBeUndefined();
    expect(entry.slug).toBe("x");
  });
});

describe("mergeMovieJournal / json helpers", () => {
  const current: MovieEntry = {
    slug: "hereditary",
    title: "Hereditary",
    status: "watched",
    tmdbId: 493922,
    watchedDates: ["2021-01-02"],
    tvtimeUuid: "abc",
  };

  it("merges new watch dates and review without dropping source keys", () => {
    const merged = mergeMovieJournal(current, {
      rating: 5,
      watchedDates: ["2026-08-25"],
      reviewSlug: "hereditary",
      tags: ["horror"],
    });
    expect(merged.watchedDates).toEqual(["2021-01-02", "2026-08-25"]);
    expect(merged.rating).toBe(5);
    expect(merged.tvtimeUuid).toBe("abc");
    expect(merged.reviewSlug).toBe("hereditary");
  });

  it("rejects invalid journal patches", () => {
    expect(() =>
      mergeMovieJournal(current, { rating: 4.25 as never }),
    ).toThrow(/whole-star/);
    expect(() =>
      mergeMovieJournal(current, { reviewSlug: "Nope" }),
    ).toThrow(/reviewSlug/);
    expect(() =>
      mergeMovieJournal(current, { status: "finished" as never }),
    ).toThrow(/invalid status/);
  });

  it("serializes tvtimeUuid last and skips empty collections", () => {
    expect(
      movieEntryToJson({
        slug: "heat",
        title: "Heat",
        status: "watched",
        tvtimeUuid: "abc",
        favorite: false,
        watchedDates: [],
        tags: [],
      }),
    ).toEqual({
      slug: "heat",
      title: "Heat",
      status: "watched",
      tvtimeUuid: "abc",
    });
  });

  it("serializes only defined journal fields in catalog key order", () => {
    expect(
      movieEntryToJson(
        buildMovieEntry(
          { tmdbId: 949, title: "Heat", releaseDate: "1995-12-15" },
          { favorite: true, rating: 5 },
          [],
        ),
      ),
    ).toEqual({
      slug: "heat",
      title: "Heat",
      status: "watched",
      releaseDate: "1995-12-15",
      tmdbId: 949,
      rating: 5,
      favorite: true,
    });
  });

  it("finds insert index and existing tmdb rows", () => {
    expect(findSlugInsertIndex(["heat", "hereditary"], "hamnet")).toBe(0);
    expect(findSlugInsertIndex(["heat", "zodiac"], "midway")).toBe(1);
    expect(findMovieByTmdbId([current], 493922)).toBe(0);
    expect(findMovieByTmdbId([current], 1)).toBe(-1);
  });
});
