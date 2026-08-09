import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import movieFixture from "./fixtures/movie-detail.json";
import seriesFixture from "./fixtures/series-detail.json";
import seasonFixture from "./fixtures/season-detail.json";

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

describe("tmdb client", () => {
  beforeEach(() => {
    process.env.TMDB_ACCESS_TOKEN = "test-token";
    delete process.env.TMDB_LANGUAGE;
  });

  afterEach(() => {
    delete process.env.TMDB_ACCESS_TOKEN;
    delete process.env.TMDB_LANGUAGE;
    vi.resetModules();
  });

  it("throws not_configured when the access token is missing", async () => {
    delete process.env.TMDB_ACCESS_TOKEN;
    const { getMovieById } = await import("./client");
    await expect(getMovieById(550)).rejects.toMatchObject({
      code: "not_configured",
    });
  });

  it("fetches and normalizes a movie detail payload", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(movieFixture));
    vi.stubGlobal("fetch", fetchMock);

    const { getMovieById } = await import("./client");
    const metadata = await getMovieById(550);

    expect(metadata.id).toBe(550);
    expect(metadata.title).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toContain("/movie/550?");
    expect(String(url)).toContain("language=en-US");
    expect(init).toMatchObject({
      headers: expect.objectContaining({
        Authorization: "Bearer test-token",
      }),
      next: expect.objectContaining({
        tags: ["tmdb:detail"],
      }),
    });
  });

  it("maps HTTP 404 to TmdbError not_found", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ status_message: "Missing" }, 404)),
    );

    const { getSeriesById } = await import("./client");
    await expect(getSeriesById(1)).rejects.toMatchObject({
      name: "TmdbError",
      code: "not_found",
    });
  });

  it("fetches season payloads for a series", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(seasonFixture));
    vi.stubGlobal("fetch", fetchMock);

    const { getSeason } = await import("./client");
    const season = await getSeason(1396, 1);

    expect(season.seasonNumber).toBeTypeOf("number");
    expect(season.episodes.length).toBeGreaterThan(0);
    expect(String(fetchMock.mock.calls[0]![0])).toContain(
      "/tv/1396/season/1?",
    );
  });

  it("searches movies with the search cache tag", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        page: 1,
        total_pages: 1,
        total_results: 0,
        results: [],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { searchMovies } = await import("./client");
    const page = await searchMovies("heat");

    expect(page.results).toEqual([]);
    expect(String(fetchMock.mock.calls[0]![0])).toContain("/search/movie?");
    expect(fetchMock.mock.calls[0]![1]).toMatchObject({
      next: expect.objectContaining({ tags: ["tmdb:search"] }),
    });
  });

  it("normalizes series detail responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(seriesFixture)));
    const { getSeriesById } = await import("./client");
    const series = await getSeriesById(1396);
    expect(series.title).toBeTruthy();
    expect(series.seasons.length).toBeGreaterThan(0);
  });
});
