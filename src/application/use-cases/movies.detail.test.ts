import { describe, expect, it, vi } from "vitest";
import { normalizeMovie } from "@/infrastructure/tmdb/normalize";
import type { TmdbRawMovie } from "@/infrastructure/tmdb/raw";
import movieFixture from "@/infrastructure/tmdb/fixtures/movie-detail.json";
import { getMovieBySlug } from "./movies";

vi.mock("@/infrastructure/tmdb/client", async () => {
  const { TmdbError } = await import("@/infrastructure/tmdb/errors");
  return {
    TmdbError,
    getMovieById: vi.fn(),
  };
});

import { getMovieById } from "@/infrastructure/tmdb/client";
import { TmdbError } from "@/infrastructure/tmdb/errors";
import { filmsCopy } from "@/content/copy/films";
import { getMovieDetail } from "./movies";

const getMovieByIdMock = vi.mocked(getMovieById);

describe("getMovieDetail", () => {
  it("returns undefined for an unknown slug without calling TMDB", async () => {
    getMovieByIdMock.mockClear();
    await expect(getMovieDetail("not-a-real-film-slug-xyz")).resolves.toBeUndefined();
    expect(getMovieByIdMock).not.toHaveBeenCalled();
  });

  it("merges journal data with mocked TMDB metadata for a valid slug", async () => {
    const entry = getMovieBySlug("10-things-i-hate-about-you");
    expect(entry).toBeDefined();
    expect(entry?.tmdbId).toBeTypeOf("number");

    getMovieByIdMock.mockResolvedValueOnce(
      normalizeMovie(movieFixture as TmdbRawMovie),
    );

    const detail = await getMovieDetail("10-things-i-hate-about-you");
    expect(detail?.slug).toBe("10-things-i-hate-about-you");
    expect(detail?.cast.length).toBeGreaterThan(0);
    expect(detail?.title).toBe("Fight Club");
    expect(getMovieByIdMock).toHaveBeenCalledWith(entry!.tmdbId);
  });

  it("surfaces an unresolved notice when TMDB returns not_found", async () => {
    getMovieByIdMock.mockRejectedValueOnce(
      new TmdbError("not_found", "missing"),
    );

    const detail = await getMovieDetail("10-things-i-hate-about-you");
    expect(detail?.metadataNotice).toBe(filmsCopy.detail.metadata.unresolved);
    expect(detail?.title).toBeTruthy();
  });

  it("surfaces an unavailable notice for other TMDB failures", async () => {
    getMovieByIdMock.mockRejectedValueOnce(
      new TmdbError("timeout", "timed out"),
    );

    const detail = await getMovieDetail("10-things-i-hate-about-you");
    expect(detail?.metadataNotice).toBe(filmsCopy.detail.metadata.unavailable);
  });

  it("loads the Portuguese sibling when a .pt.md file exists", async () => {
    getMovieByIdMock.mockClear();
    getMovieByIdMock.mockResolvedValueOnce(
      normalizeMovie(movieFixture as TmdbRawMovie),
    );

    const detail = await getMovieDetail("cat-on-a-hot-tin-roof", "pt-BR");
    expect(detail?.reviewLocale).toBe("pt-BR");
    expect(detail?.title).toBe("Gata em Telhado de Zinco Quente");
    expect(detail?.reviewHtml).toContain("Cole aqui");
    expect(detail?.alternateReviewHref).toBe("/films/cat-on-a-hot-tin-roof");
    expect(detail?.metaTitle).toContain("Resenha de");
    expect(getMovieByIdMock).toHaveBeenCalledWith(261, "pt-BR");
  });

  it("returns undefined for Portuguese when no .pt.md sibling exists", async () => {
    getMovieByIdMock.mockClear();
    await expect(
      getMovieDetail("10-things-i-hate-about-you", "pt-BR"),
    ).resolves.toBeUndefined();
    expect(getMovieByIdMock).not.toHaveBeenCalled();
  });
});
