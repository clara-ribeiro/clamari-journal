import { bookRepository } from "@/composition/repositories";
import type { BookDetail, CatalogListItem } from "@/application/dto";
import type { BookEntry } from "@/domain/entities";
import { booksCopy } from "@/content/copy/books";

export function listBooks(): BookEntry[] {
  return bookRepository.findAll();
}

export function getBookBySlug(slug: string): BookEntry | undefined {
  return bookRepository.findBySlug(slug);
}

export function computeBookStats(all: BookEntry[]) {
  const finished = all.filter((b) => b.status === "finished");
  const reading = all.filter((b) => b.status === "reading");

  return {
    total: all.length,
    finished: finished.length,
    reading: reading.length,
    favorites: all.filter((b) => b.favorite).length,
    pagesRead: finished.reduce(
      (sum, b) => sum + (b.customPageCount ?? b.currentPage ?? 0),
      0,
    ),
  };
}

export function getBookStats() {
  return computeBookStats(bookRepository.findAll());
}

export function listBookCatalogItems(): CatalogListItem[] {
  return listBooks().map((book) => ({
    slug: book.slug,
    title: book.title ?? book.slug,
    href: `/books/${book.slug}`,
    meta: book.status,
  }));
}

export function getBookDetail(slug: string): BookDetail | undefined {
  const book = getBookBySlug(slug);
  if (!book) return undefined;

  return {
    title: book.title ?? book.slug,
    backHref: "/books",
    fields: [
      { label: booksCopy.detail.fields.status, value: book.status },
      {
        label: booksCopy.detail.fields.rating,
        value: book.rating != null ? String(book.rating) : "—",
      },
      {
        label: booksCopy.detail.fields.pages,
        value:
          book.customPageCount != null
            ? String(book.customPageCount)
            : "—",
      },
      {
        label: booksCopy.detail.fields.format,
        value: book.format ?? "—",
      },
    ],
  };
}

export function getBooksPageSummary() {
  const stats = getBookStats();
  return booksCopy.list.summary
    .replace("{finished}", String(stats.finished))
    .replace("{reading}", String(stats.reading))
    .replace("{total}", String(stats.total));
}
