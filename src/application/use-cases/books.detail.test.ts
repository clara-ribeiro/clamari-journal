import { describe, expect, it, vi } from "vitest";
import { normalizeVolume } from "@/infrastructure/google-books/normalize";
import type { GoogleBooksRawVolume } from "@/infrastructure/google-books/raw";
import volumeFixture from "@/infrastructure/google-books/fixtures/volume-detail.json";
import { getBookBySlug } from "./books";

vi.mock("@/infrastructure/google-books/client", async () => {
  const { GoogleBooksError } = await import(
    "@/infrastructure/google-books/errors"
  );
  return {
    GoogleBooksError,
    getBookById: vi.fn(),
  };
});

import { getBookById } from "@/infrastructure/google-books/client";
import { GoogleBooksError } from "@/infrastructure/google-books/errors";
import { booksCopy } from "@/content/copy/books";
import { getBookDetail } from "./books";

const getBookByIdMock = vi.mocked(getBookById);

describe("getBookDetail", () => {
  it("returns undefined for an unknown slug without calling Google Books", async () => {
    getBookByIdMock.mockClear();
    await expect(
      getBookDetail("not-a-real-book-slug-xyz"),
    ).resolves.toBeUndefined();
    expect(getBookByIdMock).not.toHaveBeenCalled();
  });

  it("merges journal data with mocked Google Books metadata for a valid slug", async () => {
    const entry = getBookBySlug("the-lightning-thief");
    expect(entry).toBeDefined();

    getBookByIdMock.mockResolvedValueOnce(
      normalizeVolume(volumeFixture as GoogleBooksRawVolume),
    );

    const detail = await getBookDetail("the-lightning-thief");
    expect(detail?.slug).toBe("the-lightning-thief");
    expect(detail?.title).toBeTruthy();
    expect(getBookByIdMock).toHaveBeenCalledWith(
      entry!.googleBooksId,
      expect.objectContaining({
        customPageCount: entry!.customPageCount ?? null,
      }),
    );
  });

  it("surfaces an unresolved notice when Google Books returns not_found", async () => {
    getBookByIdMock.mockRejectedValueOnce(
      new GoogleBooksError("not_found", "missing"),
    );

    const detail = await getBookDetail("the-lightning-thief");
    expect(detail?.metadataNotice).toBe(booksCopy.detail.metadata.unresolved);
  });

  it("surfaces an unavailable notice for other Google Books failures", async () => {
    getBookByIdMock.mockRejectedValueOnce(
      new GoogleBooksError("timeout", "timed out"),
    );

    const detail = await getBookDetail("the-lightning-thief");
    expect(detail?.metadataNotice).toBe(booksCopy.detail.metadata.unavailable);
  });
});
