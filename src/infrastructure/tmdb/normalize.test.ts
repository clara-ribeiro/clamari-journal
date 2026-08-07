import { describe, expect, it } from "vitest";
import { tmdbErrorFromHttpStatus, tmdbErrorFromUnknown, TmdbError } from "./errors";
import {
  normalizeMovie,
  normalizeSearchPage,
  normalizeSeason,
  normalizeSeries,
  normalizeTvdbLookup,
} from "./normalize";
import type {
  TmdbRawMovie,
  TmdbRawPagedResponse,
  TmdbRawSearchResult,
  TmdbRawSeason,
  TmdbRawSeries,
  TmdbRawFindResponse,
} from "./raw";
import movieFixture from "./fixtures/movie-detail.json";
import seriesFixture from "./fixtures/series-detail.json";
import seasonFixture from "./fixtures/season-detail.json";
import searchFixture from "./fixtures/movie-search.json";
import tvdbFixture from "./fixtures/tvdb-find.json";

describe("tmdbErrorFromHttpStatus", () => {
  it("maps provider statuses to stable categories", () => {
    expect(tmdbErrorFromHttpStatus(404).code).toBe("not_found");
    expect(tmdbErrorFromHttpStatus(429).code).toBe("rate_limited");
    expect(tmdbErrorFromHttpStatus(401).code).toBe("not_configured");
    expect(tmdbErrorFromHttpStatus(500).code).toBe("upstream");
  });

  it("does not embed provider payloads in messages", () => {
    const error = tmdbErrorFromHttpStatus(500);
    expect(error.message).not.toMatch(/\{/);
    expect(error.message).toMatch(/status 500/);
  });
});

describe("tmdbErrorFromUnknown", () => {
  it("maps abort/timeout errors", () => {
    const abort = new Error("aborted");
    abort.name = "AbortError";
    expect(tmdbErrorFromUnknown(abort).code).toBe("timeout");
  });

  it("preserves TmdbError instances", () => {
    const original = new TmdbError("not_found", "missing");
    expect(tmdbErrorFromUnknown(original)).toBe(original);
  });
});

describe("normalizeMovie", () => {
  it("normalizes titles, credits, trailer, and image urls from fixtures", () => {
    const movie = normalizeMovie(movieFixture as TmdbRawMovie);

    expect(movie).toMatchObject({
      id: 550,
      title: "Fight Club",
      year: 1999,
      runtimeMinutes: 139,
      originalLanguage: "en",
    });
    expect(movie.genres.map((g) => g.name)).toEqual(["Drama", "Thriller"]);
    expect(movie.countries).toContain("United States of America");
    expect(movie.directors.map((d) => d.name)).toEqual(["David Fincher"]);
    expect(movie.writers.map((w) => w.name)).toContain("Jim Uhls");
    expect(movie.writers.map((w) => w.role)).not.toContain("Novel");
    expect(movie.cast[0]).toMatchObject({
      name: "Edward Norton",
      role: "The Narrator",
    });
    expect(movie.posterUrl).toContain("/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg");
    expect(movie.trailer).toMatchObject({
      key: "qtRKdVHc-cE",
      official: true,
      site: "YouTube",
      url: "https://www.youtube.com/watch?v=qtRKdVHc-cE",
    });
  });
});

describe("normalizeSeries", () => {
  it("normalizes production status, seasons, and episode runtime", () => {
    const series = normalizeSeries(seriesFixture as TmdbRawSeries);

    expect(series).toMatchObject({
      id: 1396,
      title: "Breaking Bad",
      status: "Ended",
      year: 2008,
      numberOfSeasons: 5,
      numberOfEpisodes: 62,
      episodeRuntimeMinutes: 46,
    });
    expect(series.seasons.map((s) => s.seasonNumber)).toEqual([0, 1]);
    expect(series.directors.some((d) => d.name === "Vince Gilligan")).toBe(
      true,
    );
    expect(series.trailer?.key).toBe("HhesaQXLuRY");
  });
});

describe("normalizeSeason", () => {
  it("normalizes episode titles, air dates, and runtimes", () => {
    const season = normalizeSeason(seasonFixture as TmdbRawSeason, 1396);

    expect(season.seriesId).toBe(1396);
    expect(season.seasonNumber).toBe(1);
    expect(season.episodes).toHaveLength(2);
    expect(season.episodes[0]).toMatchObject({
      episodeNumber: 1,
      title: "Pilot",
      runtimeMinutes: 58,
      airDate: "2008-01-20",
    });
    expect(season.episodes[1]?.stillUrl).toBeNull();
  });
});

describe("normalizeSearchPage", () => {
  it("drops malformed hits and builds poster urls", () => {
    const page = normalizeSearchPage(
      searchFixture as TmdbRawPagedResponse<TmdbRawSearchResult>,
    );

    expect(page.totalResults).toBe(2);
    expect(page.results).toHaveLength(1);
    expect(page.results[0]).toMatchObject({
      id: 550,
      title: "Fight Club",
      year: 1999,
    });
    expect(page.results[0]?.posterUrl).toContain("w342");
  });
});

describe("normalizeTvdbLookup", () => {
  it("returns the first TV match or null", () => {
    expect(normalizeTvdbLookup(tvdbFixture as TmdbRawFindResponse)).toEqual({
      tmdbId: 1396,
      title: "Breaking Bad",
    });
    expect(normalizeTvdbLookup({ tv_results: [] })).toBeNull();
  });
});
