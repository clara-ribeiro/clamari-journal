/**
 * Re-export concrete adapters for scripts and the composition root.
 * Application code should import ports from `@/composition/repositories`.
 */
export { movieRepository, FileMovieRepository } from "./file-movie-repository";
export { seriesRepository, FileSeriesRepository } from "./file-series-repository";
export { bookRepository, FileBookRepository } from "./file-book-repository";
export { goalsRepository, FileGoalsRepository } from "./file-goals-repository";
export {
  reviewRepository,
  FileReviewRepository,
} from "./file-review-repository";
export { compileReviewMarkdown } from "./compile-review-markdown";
