import { bookRepository } from "@/infrastructure/persistence";
import type { BookEntry } from "@/domain/entities";

export function listBooks(): BookEntry[] {
  return bookRepository.findAll();
}

export function getBookBySlug(slug: string): BookEntry | undefined {
  return bookRepository.findBySlug(slug);
}

export function getBookStats() {
  const all = bookRepository.findAll();
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
