import { applyResolvedBookStatus } from "@/domain/journal-status";
import type { BookEntry } from "@/domain/entities";
import type { BookRepository } from "@/application/repositories/book-repository";
import booksData from "@/data/books.json";
import { memoizeByCalendarDay } from "./calendar-day-memo";
import { parseBookEntries } from "./parse-json";

const parsed = parseBookEntries(booksData);

const booksForToday = memoizeByCalendarDay((today) =>
  parsed.map((book) => applyResolvedBookStatus(book, today)),
);

export class FileBookRepository implements BookRepository {
  findAll(): BookEntry[] {
    return booksForToday();
  }

  findBySlug(slug: string): BookEntry | undefined {
    return booksForToday().find((book) => book.slug === slug);
  }

  findByStatus(status: BookEntry["status"]): BookEntry[] {
    return booksForToday().filter((book) => book.status === status);
  }

  countFinished(): number {
    return booksForToday().filter((book) => book.status === "finished").length;
  }
}

export const bookRepository = new FileBookRepository();
