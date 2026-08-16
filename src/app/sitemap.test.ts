import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap, { INDEXABLE_STATIC_PATHS } from "@/app/sitemap";

describe("robots", () => {
  it("allows public routes and points at the sitemap", () => {
    const result = robots();
    expect(result.rules).toMatchObject({ userAgent: "*", allow: "/" });
    expect(result.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});

describe("sitemap", () => {
  it("covers home, catalogs, stats, feeds, and detail routes", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => new URL(entry.url).pathname);

    for (const path of INDEXABLE_STATIC_PATHS) {
      expect(urls).toContain(path);
    }

    expect(urls.some((path) => path.startsWith("/films/"))).toBe(true);
    expect(urls.some((path) => path.startsWith("/series/"))).toBe(true);
    expect(urls.some((path) => path.startsWith("/books/"))).toBe(true);
    expect(urls.length).toBeGreaterThan(INDEXABLE_STATIC_PATHS.length);
  });
});

describe("provider secrets stay server-only", () => {
  it("marks TMDB and Google Books clients as server-only", () => {
    const tmdb = readFileSync("src/infrastructure/tmdb/client.ts", "utf8");
    const books = readFileSync(
      "src/infrastructure/google-books/client.ts",
      "utf8",
    );

    expect(tmdb.startsWith('import "server-only"')).toBe(true);
    expect(books.startsWith('import "server-only"')).toBe(true);
  });

  it("does not expose provider tokens via NEXT_PUBLIC_* in app code", () => {
    const layout = readFileSync("src/app/layout.tsx", "utf8");
    expect(layout).not.toMatch(/NEXT_PUBLIC_(TMDB_|GOOGLE_BOOKS_)/);
    expect(layout).not.toMatch(/TMDB_ACCESS_TOKEN/);
    expect(layout).not.toMatch(/GOOGLE_BOOKS_API_KEY/);
  });
});
