import type { BookRepository } from "@/application/repositories/book-repository";
import type { GoalsRepository } from "@/application/repositories/goals-repository";
import type { MovieRepository } from "@/application/repositories/movie-repository";
import type { SeriesRepository } from "@/application/repositories/series-repository";
import { bookRepository as bookRepo } from "@/infrastructure/persistence/file-book-repository";
import { goalsRepository as goalsRepo } from "@/infrastructure/persistence/file-goals-repository";
import { movieRepository as movieRepo } from "@/infrastructure/persistence/file-movie-repository";
import { seriesRepository as seriesRepo } from "@/infrastructure/persistence/file-series-repository";

/** Composition root — the only place application ports bind to infrastructure. */
export const movieRepository: MovieRepository = movieRepo;
export const seriesRepository: SeriesRepository = seriesRepo;
export const bookRepository: BookRepository = bookRepo;
export const goalsRepository: GoalsRepository = goalsRepo;
