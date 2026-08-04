import { movieRepository } from "@/infrastructure/persistence";
import type { MovieEntry } from "@/domain/entities";

export function listMovies(): MovieEntry[] {
  return movieRepository.findAll();
}

export function getMovieBySlug(slug: string): MovieEntry | undefined {
  return movieRepository.findBySlug(slug);
}

export function getMovieStats() {
  const all = movieRepository.findAll();
  const watched = all.filter(
    (m) => m.status === "watched" || m.status === "rewatch",
  );
  const ratings = watched
    .map((m) => m.rating)
    .filter((r): r is number => typeof r === "number");

  return {
    total: all.length,
    watched: watched.length,
    watchlist: all.filter((m) => m.status === "watchlist").length,
    favorites: all.filter((m) => m.favorite).length,
    withReview: all.filter((m) => m.reviewSlug).length,
    averageRating:
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : null,
    totalRuntimeMinutes: watched.reduce(
      (sum, m) => sum + (m.runtimeMinutes ?? 0),
      0,
    ),
  };
}
