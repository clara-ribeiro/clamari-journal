import { describe, expect, it } from "vitest";
import type { BookEntry } from "@/domain/entities";
import type { GoogleBooksMetadata } from "@/application/dto/google-books-metadata";
import {
  buildHeroExcerpt,
  computeBookStats,
  listBookCatalogItems,
  mapBookDetail,
  stripHtml,
} from "@/application/use-cases/books";
import { booksCopy } from "@/content/copy/books";
import { catalogCopy } from "@/content/copy/catalog";

const baseEntry: BookEntry = {
  googleBooksId: "ZfEo1C04xdEC",
  slug: "the-titans-curse",
  title: "The Titan's Curse",
  status: "finished",
  favorite: true,
  rating: 5,
  startedAt: "2020-01-01",
  finishedAt: "2020-02-01",
  customPageCount: 320,
  format: "physical",
  tags: ["percy-jackson"],
  readingHistory: [
    { date: "2020-01-15", page: 100, note: "Halfway and hooked." },
    { date: "2020-01-01", page: 1 },
  ],
  quotes: [
    {
      text: "The sea does not like to be restrained.",
      page: 42,
      note: "Classic line.",
    },
  ],
};

const baseMetadata: GoogleBooksMetadata = {
  id: "ZfEo1C04xdEC",
  title: "Percy Jackson and the Titan's Curse",
  subtitle: "Book 3",
  authors: ["Rick Riordan"],
  publisher: "Disney Hyperion",
  publishedDate: "2007-05-01",
  year: 2007,
  pageCount: 320,
  pageCountSource: "personal",
  providerPageCount: 312,
  language: "en",
  categories: ["Juvenile Fiction", "Fantasy"],
  description:
    "<p>When the goddess Artemis goes missing, she is believed to have been kidnapped. And now it's up to Percy and his friends to find out what happened.</p>",
  coverUrl: "https://books.google.com/books/content?id=ZfEo1C04xdEC&img=1",
  identifiers: {
    isbn10: "1423101456",
    isbn13: "9781423101451",
    other: [],
  },
};

describe("stripHtml", () => {
  it("removes tags and collapses whitespace", () => {
    expect(stripHtml("<p>Hello &amp; <b>world</b></p>")).toBe("Hello & world");
  });
});

describe("buildHeroExcerpt", () => {
  it("returns a capped plain-text excerpt", () => {
    const long = `<p>${"word ".repeat(200)}</p>`;
    const excerpt = buildHeroExcerpt(long, 80);
    expect(excerpt).not.toBeNull();
    expect(excerpt!.length).toBeLessThanOrEqual(80);
    expect(excerpt).not.toContain("<");
  });

  it("returns null for empty description", () => {
    expect(buildHeroExcerpt(null)).toBeNull();
    expect(buildHeroExcerpt("   ")).toBeNull();
  });
});

describe("mapBookDetail", () => {
  it("merges Google Books metadata with personal reading record", () => {
    const detail = mapBookDetail(baseEntry, baseMetadata, null);

    expect(detail.title).toBe("Percy Jackson and the Titan's Curse");
    expect(detail.subtitle).toBe("Book 3");
    expect(detail.authorsLabel).toBe("Rick Riordan");
    expect(detail.pageCountLabel).toBe("320");
    expect(detail.heroExcerpt).toContain("goddess Artemis");
    expect(detail.heroExcerpt).not.toContain("<p>");
    expect(detail.statusLabel).toBe("Finished");
    expect(detail.favorite).toBe(true);
    expect(detail.formatLabel).toBe("Physical");
    expect(detail.progressPercent).toBe(100);
    expect(detail.quotes).toHaveLength(1);
    expect(detail.history).toHaveLength(2);
    expect(detail.history[0]?.dateLabel).toContain("2020");
    expect(detail.notes).toHaveLength(1);
    expect(detail.notes[0]?.text).toBe("Halfway and hooked.");
    expect(detail.metadataNotice).toBeNull();
  });

  it("surfaces a notice and falls back to entry fields when metadata is missing", () => {
    const detail = mapBookDetail(
      { ...baseEntry, coverUrl: "https://example.com/cover.jpg" },
      null,
      booksCopy.detail.metadata.unavailable,
    );

    expect(detail.title).toBe("The Titan's Curse");
    expect(detail.coverUrl).toBe("https://example.com/cover.jpg");
    expect(detail.synopsis).toBeNull();
    expect(detail.heroExcerpt).toBeNull();
    expect(detail.metadataNotice).toBe(
      booksCopy.detail.metadata.unavailable,
    );
  });

  it("computes in-progress page percent from current page", () => {
    const detail = mapBookDetail(
      {
        ...baseEntry,
        status: "reading",
        finishedAt: undefined,
        currentPage: 80,
        customPageCount: 320,
      },
      { ...baseMetadata, pageCount: 320 },
      null,
    );

    expect(detail.progressPercent).toBe(25);
    expect(detail.currentPageLabel).toBe("80 / 320");
  });
});

describe("computeBookStats", () => {
  it("sums finished pages preferring customPageCount", () => {
    const stats = computeBookStats([
      {
        googleBooksId: "1",
        slug: "a",
        status: "finished",
        favorite: true,
        customPageCount: 200,
      },
      {
        googleBooksId: "2",
        slug: "b",
        status: "finished",
        currentPage: 150,
      },
      {
        googleBooksId: "3",
        slug: "c",
        status: "reading",
        currentPage: 40,
      },
      {
        googleBooksId: "4",
        slug: "d",
        status: "want-to-read",
      },
    ]);

    expect(stats).toEqual({
      total: 4,
      finished: 2,
      reading: 1,
      favorites: 1,
      pagesRead: 350,
    });
  });
});

describe("listBookCatalogItems", () => {
  it("maps live catalog entries into sorted cards with activity labels", () => {
    const items = listBookCatalogItems();
    expect(items.length).toBeGreaterThan(0);
    expect(items).toEqual(
      [...items].sort((a, b) => a.sortTitle.localeCompare(b.sortTitle)),
    );

    const sample = items.find((item) => item.slug === "the-lightning-thief");
    expect(sample).toMatchObject({
      medium: "book",
      href: "/books/the-lightning-thief",
      statusLabel: catalogCopy.status.books.finished,
      statusTone: "positive",
    });
    expect(sample?.sortTitle.length).toBeGreaterThan(0);
    expect(Array.isArray(sample?.goalYears)).toBe(true);
  });
});
