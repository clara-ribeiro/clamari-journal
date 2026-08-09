import { describe, expect, it } from "vitest";
import {
  GoogleBooksError,
  googleBooksErrorFromHttpStatus,
  googleBooksErrorFromUnknown,
} from "./errors";
import {
  coverUrlFromVolumeId,
  normalizeSearchPage,
  normalizeVolume,
  toSecureCoverUrl,
  withPersonalPageCount,
} from "./normalize";
import type {
  GoogleBooksRawSearchResponse,
  GoogleBooksRawVolume,
} from "./raw";
import volumeFixture from "./fixtures/volume-detail.json";
import sparseFixture from "./fixtures/volume-sparse.json";
import searchFixture from "./fixtures/volume-search.json";

describe("googleBooksErrorFromHttpStatus", () => {
  it("maps provider statuses to stable categories", () => {
    expect(googleBooksErrorFromHttpStatus(404).code).toBe("not_found");
    expect(googleBooksErrorFromHttpStatus(429).code).toBe("rate_limited");
    expect(googleBooksErrorFromHttpStatus(500).code).toBe("upstream");
  });

  it("does not embed provider payloads in messages", () => {
    expect(googleBooksErrorFromHttpStatus(500).message).not.toMatch(/\{/);
  });
});

describe("googleBooksErrorFromUnknown", () => {
  it("maps abort errors to timeout", () => {
    const abort = new Error("aborted");
    abort.name = "AbortError";
    expect(googleBooksErrorFromUnknown(abort).code).toBe("timeout");
  });

  it("preserves GoogleBooksError instances", () => {
    const original = new GoogleBooksError("not_found", "missing");
    expect(googleBooksErrorFromUnknown(original)).toBe(original);
  });
});

describe("cover helpers", () => {
  it("upgrades http covers to https", () => {
    expect(toSecureCoverUrl("http://books.google.com/x")).toBe(
      "https://books.google.com/x",
    );
  });

  it("builds a canonical https cover url from a volume id", () => {
    expect(coverUrlFromVolumeId("ku9TsH3M1-YC")).toBe(
      "https://books.google.com/books/content?id=ku9TsH3M1-YC&printsec=frontcover&img=1&zoom=2&source=gbs_api",
    );
  });
});

describe("normalizeVolume", () => {
  it("normalizes rich volume metadata from fixtures", () => {
    const book = normalizeVolume(volumeFixture as GoogleBooksRawVolume);

    expect(book).toMatchObject({
      id: "ku9TsH3M1-YC",
      title: "The Lightning Thief",
      subtitle: "Percy Jackson and the Olympians, Book One",
      authors: ["Rick Riordan"],
      publisher: "Disney Hyperion",
      year: 2005,
      pageCount: 377,
      pageCountSource: "provider",
      providerPageCount: 377,
      language: "en",
    });
    expect(book.identifiers).toEqual({
      isbn10: "0786838655",
      isbn13: "9780786838653",
      other: [{ type: "OTHER", value: "OL123" }],
    });
    expect(book.coverUrl).toMatch(/^https:\/\//);
    expect(book.coverUrl).toContain("zoom=3");
  });

  it("tolerates sparse volumes with missing optional fields", () => {
    const book = normalizeVolume(sparseFixture as GoogleBooksRawVolume);
    expect(book).toMatchObject({
      id: "sparse-id",
      title: "Untitled Draft",
      authors: [],
      pageCount: null,
      pageCountSource: "unknown",
      coverUrl: null,
      identifiers: { isbn10: null, isbn13: null, other: [] },
    });
  });

  it("rejects volumes without a title", () => {
    expect(() =>
      normalizeVolume({ id: "x", volumeInfo: {} } as GoogleBooksRawVolume),
    ).toThrow(GoogleBooksError);
  });
});

describe("withPersonalPageCount", () => {
  it("lets a personal custom page count override provider data", () => {
    const book = normalizeVolume(volumeFixture as GoogleBooksRawVolume);
    const overridden = withPersonalPageCount(book, 384);

    expect(overridden.pageCount).toBe(384);
    expect(overridden.pageCountSource).toBe("personal");
    expect(overridden.providerPageCount).toBe(377);
  });

  it("ignores non-positive overrides", () => {
    const book = normalizeVolume(volumeFixture as GoogleBooksRawVolume);
    expect(withPersonalPageCount(book, 0).pageCountSource).toBe("provider");
    expect(withPersonalPageCount(book, null).pageCount).toBe(377);
  });
});

describe("normalizeSearchPage", () => {
  it("drops malformed hits and secures thumbnail urls", () => {
    const page = normalizeSearchPage(
      searchFixture as GoogleBooksRawSearchResponse,
    );

    expect(page.totalItems).toBe(2);
    expect(page.results).toHaveLength(1);
    expect(page.results[0]).toMatchObject({
      id: "ku9TsH3M1-YC",
      title: "The Lightning Thief",
      year: 2005,
    });
    expect(page.results[0]?.coverUrl).toMatch(/^https:\/\//);
    expect(page.results[0]?.coverUrl).toContain("zoom=2");
  });
});
