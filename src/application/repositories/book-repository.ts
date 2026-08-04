import type { BookEntry } from "@/domain/entities";

export interface BookRepository {
  findAll(): BookEntry[];
  findBySlug(slug: string): BookEntry | undefined;
  findByStatus(status: BookEntry["status"]): BookEntry[];
  countFinished(): number;
}
