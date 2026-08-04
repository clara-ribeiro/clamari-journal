import type { MovieEntry } from "@/domain/entities";
import type { MovieRepository } from "@/application/repositories/movie-repository";
import moviesData from "@/data/movies.json";

const movies = moviesData as MovieEntry[];

export class FileMovieRepository implements MovieRepository {
  findAll(): MovieEntry[] {
    return movies;
  }

  findBySlug(slug: string): MovieEntry | undefined {
    return movies.find((movie) => movie.slug === slug);
  }

  findByStatus(status: MovieEntry["status"]): MovieEntry[] {
    return movies.filter((movie) => movie.status === status);
  }

  countWatched(): number {
    return movies.filter(
      (movie) => movie.status === "watched" || movie.status === "rewatch",
    ).length;
  }
}

export const movieRepository = new FileMovieRepository();
