import { describe, expect, it } from "vitest";
import {
  isTmdbImageUrl,
  tmdbImageLoader,
  tmdbImageUrl,
} from "./tmdb-image";

describe("tmdbImageUrl", () => {
  it("builds a sized CDN URL from a poster path", () => {
    expect(tmdbImageUrl("/abc.jpg", "w342")).toBe(
      "https://image.tmdb.org/t/p/w342/abc.jpg",
    );
  });

  it("returns null for missing paths", () => {
    expect(tmdbImageUrl(null)).toBeNull();
    expect(tmdbImageUrl(undefined)).toBeNull();
    expect(tmdbImageUrl("")).toBeNull();
  });
});

describe("isTmdbImageUrl", () => {
  it("detects TMDB CDN hosts", () => {
    expect(isTmdbImageUrl("https://image.tmdb.org/t/p/w500/x.jpg")).toBe(true);
    expect(isTmdbImageUrl("https://books.google.com/cover.jpg")).toBe(false);
  });
});

describe("tmdbImageLoader", () => {
  it("rewrites a TMDB src to a width-appropriate size and appends ?w=", () => {
    const src = "https://image.tmdb.org/t/p/original/poster.jpg";
    expect(tmdbImageLoader({ src, width: 200 })).toBe(
      "https://image.tmdb.org/t/p/w342/poster.jpg?w=200",
    );
    expect(tmdbImageLoader({ src, width: 120 })).toBe(
      "https://image.tmdb.org/t/p/w185/poster.jpg?w=120",
    );
    expect(tmdbImageLoader({ src, width: 900 })).toBe(
      "https://image.tmdb.org/t/p/original/poster.jpg?w=900",
    );
  });

  it("leaves non-TMDB sources unchanged", () => {
    const src = "https://example.com/cover.jpg";
    expect(tmdbImageLoader({ src, width: 200 })).toBe(src);
  });
});
