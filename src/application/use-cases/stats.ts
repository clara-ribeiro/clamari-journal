import {
  bookRepository,
  goalsRepository,
  movieRepository,
  seriesRepository,
} from "@/composition/repositories";
import type { GoalMetric, StatsMetric } from "@/application/dto";
import type { GoalProgress, Goals } from "@/domain/entities";
import { statsCopy } from "@/content/copy/stats";
import { formatDuration } from "@/lib/formatters/formatDuration";
import { computeBookStats } from "./books";
import { computeMovieStats } from "./movies";
import { computeSeriesStats } from "./series";

export function getGoals(): Goals {
  return goalsRepository.get();
}

export function computeGoalProgress(
  goals: Goals,
  movies: ReturnType<typeof computeMovieStats>,
  series: ReturnType<typeof computeSeriesStats>,
  books: ReturnType<typeof computeBookStats>,
): GoalProgress[] {
  const items: Array<{
    key: GoalProgress["key"];
    current: number;
    target: number;
  }> = [
    { key: "movies", current: movies.watched, target: goals.movies },
    { key: "series", current: series.completed, target: goals.series },
    { key: "books", current: books.finished, target: goals.books },
    { key: "pages", current: books.pagesRead, target: goals.pages },
  ];

  return items.map((item) => {
    const percent =
      item.target > 0
        ? Math.min(100, Math.round((item.current / item.target) * 100))
        : 0;
    return {
      ...item,
      percent,
      remaining: Math.max(0, item.target - item.current),
    };
  });
}

export function getGoalProgress(): GoalProgress[] {
  return computeGoalProgress(
    getGoals(),
    computeMovieStats(movieRepository.findAll()),
    computeSeriesStats(seriesRepository.findAll()),
    computeBookStats(bookRepository.findAll()),
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

/** Lifetime totals for the home stats collage. */
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
  const goals = computeGoalProgress(getGoals(), movies, series, books);

  const totalWatch =
    movies.totalRuntimeMinutes + series.totalRuntimeMinutes;

  const metrics: StatsMetric[] = [
    {
      id: "works",
      value: String(movies.total + series.total + books.total),
      label: statsCopy.metrics.works,
    },
    {
      id: "films-watched",
      value: String(movies.watched),
      label: statsCopy.metrics.filmsWatched,
    },
    {
      id: "series-completed",
      value: String(series.completed),
      label: statsCopy.metrics.seriesCompleted,
    },
    {
      id: "episodes",
      value: String(series.watchedEpisodes),
      label: statsCopy.metrics.episodesWatched,
    },
    {
      id: "books-finished",
      value: String(books.finished),
      label: statsCopy.metrics.booksFinished,
    },
    {
      id: "pages",
      value: String(books.pagesRead),
      label: statsCopy.metrics.pagesRead,
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
      id: "total-time",
      value: formatDuration(totalWatch),
      label: statsCopy.metrics.totalWatchTime,
    },
  ];

  return {
    metrics,
    goals: goals.map((goal) => ({
      key: goal.key,
      value: `${goal.current}/${goal.target}`,
      label: `${statsCopy.goalLabels[goal.key]} · ${goal.percent}% · ${goal.remaining} ${statsCopy.remainingSuffix}`,
    })),
  };
}
