import { describe, expect, it, vi } from "vitest";
import {
  normalizeSeason,
  normalizeSeries,
} from "@/infrastructure/tmdb/normalize";
import type { TmdbRawSeason, TmdbRawSeries } from "@/infrastructure/tmdb/raw";
import seriesFixture from "@/infrastructure/tmdb/fixtures/series-detail.json";
import seasonFixture from "@/infrastructure/tmdb/fixtures/season-detail.json";
import { getSeriesBySlug } from "./series";

vi.mock("@/infrastructure/tmdb/client", async () => {
  const { TmdbError } = await import("@/infrastructure/tmdb/errors");
  return {
    TmdbError,
    getSeriesById: vi.fn(),
    getSeason: vi.fn(),
  };
});

import { getSeason, getSeriesById } from "@/infrastructure/tmdb/client";
import { TmdbError } from "@/infrastructure/tmdb/errors";
import { seriesCopy } from "@/content/copy/series";
import { getSeriesDetail } from "./series";

const getSeriesByIdMock = vi.mocked(getSeriesById);
const getSeasonMock = vi.mocked(getSeason);

describe("getSeriesDetail", () => {
  it("returns undefined for an unknown slug without calling TMDB", async () => {
    getSeriesByIdMock.mockClear();
    getSeasonMock.mockClear();
    await expect(
      getSeriesDetail("not-a-real-series-slug-xyz"),
    ).resolves.toBeUndefined();
    expect(getSeriesByIdMock).not.toHaveBeenCalled();
    expect(getSeasonMock).not.toHaveBeenCalled();
  });

  it("merges journal data with mocked TMDB metadata for a valid slug", async () => {
    const entry = getSeriesBySlug("full-house");
    expect(entry).toBeDefined();
    expect(entry?.tmdbId).toBeTypeOf("number");

    const metadata = normalizeSeries(seriesFixture as TmdbRawSeries);
    getSeriesByIdMock.mockResolvedValueOnce(metadata);
    getSeasonMock.mockResolvedValue(
      normalizeSeason(seasonFixture as TmdbRawSeason, entry!.tmdbId!),
    );

    const detail = await getSeriesDetail("full-house");
    expect(detail?.slug).toBe("full-house");
    expect(detail?.title).toBe("Breaking Bad");
    expect(detail?.seasons.length).toBeGreaterThan(0);
    expect(getSeriesByIdMock).toHaveBeenCalledWith(entry!.tmdbId);
  });

  it("returns an unresolved notice when the entry has no TMDB id", async () => {
    getSeriesByIdMock.mockClear();
    const detail = await getSeriesDetail("prison-break-2");
    expect(detail?.metadataNotice).toBe(seriesCopy.detail.metadata.unresolved);
    expect(getSeriesByIdMock).not.toHaveBeenCalled();
  });

  it("surfaces an unavailable notice when TMDB fails", async () => {
    getSeriesByIdMock.mockRejectedValueOnce(
      new TmdbError("network", "offline"),
    );

    const detail = await getSeriesDetail("full-house");
    expect(detail?.metadataNotice).toBe(seriesCopy.detail.metadata.unavailable);
    expect(detail?.seasons).toEqual([]);
  });
});
