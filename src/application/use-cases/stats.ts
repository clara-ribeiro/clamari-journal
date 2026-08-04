import { goalsRepository } from "@/infrastructure/persistence";
import type { GoalProgress, Goals } from "@/domain/entities";
import { getMovieStats } from "./movies";
import { getSeriesStats } from "./series";
import { getBookStats } from "./books";

export function getGoals(): Goals {
  return goalsRepository.get();
}

export function getGoalProgress(): GoalProgress[] {
  const goals = getGoals();
  const movies = getMovieStats();
  const series = getSeriesStats();
  const books = getBookStats();

  const items: Array<{
    key: GoalProgress["key"];
    label: string;
    current: number;
    target: number;
  }> = [
    {
      key: "movies",
      label: "Movies",
      current: movies.watched,
      target: goals.movies,
    },
    {
      key: "series",
      label: "Series",
      current: series.completed,
      target: goals.series,
    },
    {
      key: "books",
      label: "Books",
      current: books.finished,
      target: goals.books,
    },
    {
      key: "pages",
      label: "Pages",
      current: books.pagesRead,
      target: goals.pages,
    },
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

export function getHomeSummary() {
  const movies = getMovieStats();
  const series = getSeriesStats();
  const books = getBookStats();
  const goals = getGoalProgress();

  return {
    movies,
    series,
    books,
    goals,
    totals: {
      works: movies.total + series.total + books.total,
      watchedEpisodes: series.watchedEpisodes,
      watchedMovies: movies.watched,
      finishedBooks: books.finished,
    },
  };
}
