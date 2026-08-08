import {
  bookRepository,
  goalsRepository,
  movieRepository,
  seriesRepository,
} from "@/composition/repositories";
import type { GoalMetric, StatsMetric } from "@/application/dto";
import type {
  BookEntry,
  GoalProgress,
  Goals,
  MovieEntry,
  SeriesEntry,
} from "@/domain/entities";
import { statsCopy } from "@/content/copy/stats";
import { formatDuration } from "@/lib/formatters/formatDuration";
import { computeBookStats } from "./books";
import {
  bookCountsTowardYearGoal,
  goalCatalogHref,
  movieCountsTowardYearGoal,
  seriesCountsTowardYearGoal,
} from "./goal-years";
import { computeMovieStats } from "./movies";
import { computeSeriesStats } from "./series";

export {
  bookCountsTowardYearGoal,
  goalCatalogHref,
  isSeriesCaughtUp,
  movieCountsTowardYearGoal,
  seriesCountsTowardYearGoal,
  yearsBookCountsToward,
  yearsMovieCountsToward,
  yearsSeriesCountsToward,
} from "./goal-years";

export function getGoals(): Goals {
  return goalsRepository.get();
}

export function computeGoalProgress(
  goals: Goals,
  movies: MovieEntry[],
  series: SeriesEntry[],
  books: BookEntry[],
): GoalProgress[] {
  const year = goals.year;
  const yearMovies = movies.filter((movie) =>
    movieCountsTowardYearGoal(movie, year),
  );
  const yearSeries = series.filter((entry) =>
    seriesCountsTowardYearGoal(entry, year),
  );
  const yearBooks = books.filter((book) =>
    bookCountsTowardYearGoal(book, year, year),
  );

  const items: Array<{
    key: GoalProgress["key"];
    current: number;
    target: number;
  }> = [
    { key: "movies", current: yearMovies.length, target: goals.movies },
    { key: "series", current: yearSeries.length, target: goals.series },
    { key: "books", current: yearBooks.length, target: goals.books },
    {
      key: "pages",
      current: yearBooks.reduce(
        (sum, book) => sum + (book.customPageCount ?? book.currentPage ?? 0),
        0,
      ),
      target: goals.pages,
    },
  ];

  return items.map((item) => {
    const percent =
      item.target > 0 ? Math.round((item.current / item.target) * 100) : 0;
    return {
      ...item,
      percent,
      exceeded: item.target > 0 && item.current > item.target,
      remaining: Math.max(0, item.target - item.current),
    };
  });
}

export function getGoalProgress(): GoalProgress[] {
  return computeGoalProgress(
    getGoals(),
    movieRepository.findAll(),
    seriesRepository.findAll(),
    bookRepository.findAll(),
  );
}

export function computeLifetimeStats(
  movies: ReturnType<typeof computeMovieStats>,
  series: ReturnType<typeof computeSeriesStats>,
  books: ReturnType<typeof computeBookStats>,
) {
  const totalRuntimeMinutes =
    movies.totalRuntimeMinutes + series.totalRuntimeMinutes;

  return {
    pagesRead: books.pagesRead,
    watchedHours: Math.round(totalRuntimeMinutes / 60),
  };
}

/** Lifetime totals for the home stats collage teaser. */
export function getLifetimeStats() {
  return computeLifetimeStats(
    computeMovieStats(movieRepository.findAll()),
    computeSeriesStats(seriesRepository.findAll()),
    computeBookStats(bookRepository.findAll()),
  );
}

export function getStatsPageData(): {
  metrics: StatsMetric[];
  goals: GoalMetric[];
} {
  const movieEntries = movieRepository.findAll();
  const seriesEntries = seriesRepository.findAll();
  const bookEntries = bookRepository.findAll();

  const movies = computeMovieStats(movieEntries);
  const series = computeSeriesStats(seriesEntries);
  const books = computeBookStats(bookEntries);
  const goalsConfig = getGoals();
  const goals = computeGoalProgress(
    goalsConfig,
    movieEntries,
    seriesEntries,
    bookEntries,
  );

  const formatCount = (value: number) => value.toLocaleString("en-US");

  /** Collage order matches the stats page layout (alternating image/stat rows). */
  const metrics: StatsMetric[] = [
    {
      id: "works",
      value: formatCount(movies.total + series.total + books.total),
      label: statsCopy.metrics.works,
    },
    {
      id: "film-time",
      value: formatDuration(movies.totalRuntimeMinutes),
      label: statsCopy.metrics.filmWatchTime,
    },
    {
      id: "series-time",
      value: formatDuration(series.totalRuntimeMinutes),
      label: statsCopy.metrics.seriesWatchTime,
    },
    {
      id: "pages",
      value: formatCount(books.pagesRead),
      label: statsCopy.metrics.pagesRead,
    },
    {
      id: "films-watched",
      value: formatCount(movies.watched),
      label: statsCopy.metrics.filmsWatched,
    },
    {
      id: "series-completed",
      value: formatCount(series.completed),
      label: statsCopy.metrics.seriesCompleted,
    },
    {
      id: "episodes",
      value: formatCount(series.watchedEpisodes),
      label: statsCopy.metrics.episodesWatched,
    },
    {
      id: "books-finished",
      value: formatCount(books.finished),
      label: statsCopy.metrics.booksFinished,
    },
  ];

  return {
    metrics,
    goals: goals.map((goal) => ({
      key: goal.key,
      value: `${goal.current}/${goal.target}`,
      label: `${statsCopy.goalLabels[goal.key]} · ${goal.percent}% · ${goal.remaining} ${statsCopy.remainingSuffix}`,
      current: goal.current,
      target: goal.target,
      percent: goal.percent,
      exceeded: goal.exceeded,
      year: goalsConfig.year,
      href: goalCatalogHref(goal.key, goalsConfig.year),
    })),
  };
}
