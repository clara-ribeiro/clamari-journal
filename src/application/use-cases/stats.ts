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
import { computeMovieStats } from "./movies";
import { computeSeriesStats } from "./series";

export function getGoals(): Goals {
  return goalsRepository.get();
}

function isoYear(iso?: string | null): number | null {
  if (!iso || iso.length < 4) return null;
  const year = Number(iso.slice(0, 4));
  return Number.isFinite(year) ? year : null;
}

export function movieCountsTowardYearGoal(
  movie: MovieEntry,
  year: number,
): boolean {
  if (movie.status !== "watched" && movie.status !== "rewatch") return false;
  return (movie.watchedDates ?? []).some((date) => isoYear(date) === year);
}

/** Regular (non-special) watched episodes, unique by season+episode. */
function regularWatchedEpisodeKeys(series: SeriesEntry): Set<string> {
  const keys = new Set<string>();
  for (const episode of series.watchedEpisodes) {
    if (episode.season <= 0) continue;
    keys.add(`${episode.season}-${episode.episode}`);
  }
  return keys;
}

/**
 * Caught up with everything released so far: finished show, marked up-to-date,
 * or watched at least as many regular episodes as TMDB reports (preferred),
 * else every season number through `numberOfSeasons`.
 * When a new season/episode lands in TMDB, catch-up fails until watched again.
 */
export function isSeriesCaughtUp(series: SeriesEntry): boolean {
  if (series.status === "completed" || series.status === "up-to-date") {
    return true;
  }
  if (
    series.status === "abandoned" ||
    series.status === "watchlist" ||
    series.status === "paused"
  ) {
    return false;
  }

  const watched = regularWatchedEpisodeKeys(series);
  if (series.numberOfEpisodes !== undefined) {
    return watched.size >= series.numberOfEpisodes;
  }
  if (series.numberOfSeasons !== undefined) {
    const seasons = new Set(
      [...watched].map((key) => Number(key.split("-")[0])),
    );
    for (let season = 1; season <= series.numberOfSeasons; season += 1) {
      if (!seasons.has(season)) return false;
    }
    return series.numberOfSeasons > 0;
  }
  return false;
}

export function seriesCountsTowardYearGoal(
  series: SeriesEntry,
  year: number,
): boolean {
  if (!isSeriesCaughtUp(series)) return false;

  const lastRegularWatch = series.watchedEpisodes
    .filter((episode) => episode.season > 0 && episode.watchedAt)
    .map((episode) => episode.watchedAt as string)
    .sort()
    .at(-1);

  const completedAt = series.finishedAt ?? lastRegularWatch;
  return isoYear(completedAt) === year;
}

export function bookCountsTowardYearGoal(
  book: BookEntry,
  year: number,
): boolean {
  if (book.status !== "finished") return false;

  // Books often lack finishedAt in the catalog — fall back to reading history /
  // startedAt, and count undated finished books toward the active goals year.
  const activityDate =
    book.finishedAt ??
    book.readingHistory
      ?.map((entry) => entry.date)
      .filter((date): date is string => Boolean(date))
      .sort()
      .at(-1) ??
    book.startedAt ??
    null;

  if (!activityDate) return true;
  return isoYear(activityDate) === year;
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
    bookCountsTowardYearGoal(book, year),
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
  const goals = computeGoalProgress(
    getGoals(),
    movieEntries,
    seriesEntries,
    bookEntries,
  );

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
      current: goal.current,
      target: goal.target,
      percent: goal.percent,
      exceeded: goal.exceeded,
    })),
  };
}
