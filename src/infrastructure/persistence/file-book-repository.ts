import type { BookEntry } from "@/domain/entities";
import type { BookRepository } from "@/application/repositories/book-repository";
import booksData from "@/data/books.json";

const books = booksData as BookEntry[];

export class FileBookRepository implements BookRepository {
  findAll(): BookEntry[] {
    return books;
  }

  findBySlug(slug: string): BookEntry | undefined {
    return books.find((book) => book.slug === slug);
  }

  findByStatus(status: BookEntry["status"]): BookEntry[] {
    return books.filter((book) => book.status === status);
  }

  countFinished(): number {
    return books.filter((book) => book.status === "finished").length;
  }
}

export const bookRepository = new FileBookRepository();
