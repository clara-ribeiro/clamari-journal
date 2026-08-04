import type { MovieEntry } from "@/domain/entities";

export interface MovieRepository {
  findAll(): MovieEntry[];
  findBySlug(slug: string): MovieEntry | undefined;
  findByStatus(status: MovieEntry["status"]): MovieEntry[];
  countWatched(): number;
}
