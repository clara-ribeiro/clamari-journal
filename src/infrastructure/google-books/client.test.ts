import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import volumeFixture from "./fixtures/volume-detail.json";

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

describe("google books client", () => {
  beforeEach(() => {
    delete process.env.GOOGLE_BOOKS_API_KEY;
  });

  afterEach(() => {
    delete process.env.GOOGLE_BOOKS_API_KEY;
    vi.resetModules();
  });

  it("rejects empty volume ids", async () => {
    const { getBookById } = await import("./client");
    await expect(getBookById("  ")).rejects.toMatchObject({
      code: "invalid_query",
    });
  });

  it("fetches and normalizes a volume, applying personal page count", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(volumeFixture));
    vi.stubGlobal("fetch", fetchMock);

    const { getBookById } = await import("./client");
    const metadata = await getBookById("ZfEo1C04xdEC", {
      customPageCount: 999,
    });

    expect(metadata.id).toBeTruthy();
    expect(metadata.pageCount).toBe(999);
    expect(metadata.pageCountSource).toBe("personal");
    expect(String(fetchMock.mock.calls[0]![0])).toContain(
      "/volumes/ZfEo1C04xdEC",
    );
    expect(fetchMock.mock.calls[0]![1]).toMatchObject({
      next: expect.objectContaining({
        tags: ["google-books:detail"],
      }),
    });
  });

  it("appends the API key when configured", async () => {
    process.env.GOOGLE_BOOKS_API_KEY = "secret-key";
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(volumeFixture));
    vi.stubGlobal("fetch", fetchMock);

    const { getBookById } = await import("./client");
    await getBookById("abc");

    expect(String(fetchMock.mock.calls[0]![0])).toContain("key=secret-key");
  });

  it("maps HTTP 404 to GoogleBooksError not_found", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({}, 404)),
    );

    const { getBookById } = await import("./client");
    await expect(getBookById("missing")).rejects.toMatchObject({
      name: "GoogleBooksError",
      code: "not_found",
    });
  });

  it("builds mode-specific search queries", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ kind: "books#volumes", totalItems: 0, items: [] }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const {
      searchBooks,
      searchBooksByAuthor,
      searchBooksByIsbn,
      searchBooksByTitle,
    } = await import("./client");

    await searchBooks("percy");
    await searchBooksByTitle("lightning");
    await searchBooksByAuthor("riordan");
    await searchBooksByIsbn("978-1-42-310145-1");

    const urls = fetchMock.mock.calls.map((call) => String(call[0]));
    expect(urls[0]).toContain("q=percy");
    expect(urls[1]).toContain(encodeURIComponent("intitle:lightning"));
    expect(urls[2]).toContain(encodeURIComponent("inauthor:riordan"));
    expect(urls[3]).toContain(encodeURIComponent("isbn:9781423101451"));
    expect(fetchMock.mock.calls[0]![1]).toMatchObject({
      next: expect.objectContaining({ tags: ["google-books:search"] }),
    });
  });

  it("rejects empty search queries", async () => {
    const { searchBooks, searchBooksByIsbn } = await import("./client");
    await expect(searchBooks("   ")).rejects.toMatchObject({
      code: "invalid_query",
    });
    await expect(searchBooksByIsbn("---")).rejects.toMatchObject({
      code: "invalid_query",
    });
  });
});
