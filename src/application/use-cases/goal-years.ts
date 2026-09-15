import type {
  BookEntry,
  GoalProgress,
  MovieEntry,
  SeriesEntry,
} from "@/domain/entities";
import {
  hasWatchedAllReleasedEpisodes,
  isWatchedMovieStatus,
  lastRegularWatchDate,
  watchedSeasonNumbers,
} from "@/domain/journal-status";
import {
  DEFAULT_REVIEW_LOCALE,
  pathForLocale,
  type ReviewLocale,
} from "@/lib/review-locale";

function isoYear(iso?: string | null): number | null {
  if (!iso || iso.length < 4) return null;
  const year = Number(iso.slice(0, 4));
  return Number.isFinite(year) ? year : null;
}

/** Catalog path + `?year=` for a yearly goal gauge (lands on the grid). */
export function goalCatalogHref(
  key: GoalProgress["key"] | string,
  year: number,
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): string {
  const path =
    key === "movies" ? "/films" : key === "series" ? "/series" : "/books";
  return `${pathForLocale(path, locale)}?year=${year}#main-content`;
}

export function movieCountsTowardYearGoal(
  movie: MovieEntry,
  year: number,
): boolean {
  return yearsMovieCountsToward(movie).includes(year);
}

/** Years a film counts toward annual watch goals. */
export function yearsMovieCountsToward(movie: MovieEntry): number[] {
  if (!isWatchedMovieStatus(movie.status)) return [];
  const years = new Set<number>();
  for (const date of movie.watchedDates ?? []) {
    const year = isoYear(date);
    if (year != null) years.add(year);
  }
  return [...years].sort((a, b) => a - b);
}

/**
 * Caught up with everything released so far. TMDB's released total is the only
 * reliable signal: unique regular watches must cover it, and a newly released
 * episode breaks catch-up until it is watched. Rewatches do not add coverage.
 * Without that total, trust a `completed` mark, else require every season
 * through `numberOfSeasons` to have been started.
 */
export function isSeriesCaughtUp(series: SeriesEntry): boolean {
  if (series.numberOfEpisodes !== undefined) {
    return hasWatchedAllReleasedEpisodes(
      series.watchedEpisodes,
      series.numberOfEpisodes,
    );
  }

  if (series.status === "completed") return true;
  if (
    series.status === "abandoned" ||
    series.status === "watchlist" ||
    series.status === "paused"
  ) {
    return false;
  }
  if (series.numberOfSeasons === undefined) return false;

  const seasons = watchedSeasonNumbers(series.watchedEpisodes);
  for (let season = 1; season <= series.numberOfSeasons; season += 1) {
    if (!seasons.has(season)) return false;
  }
  return series.numberOfSeasons > 0;
}

function seriesCompletionDate(series: SeriesEntry): string | undefined {
  return series.finishedAt ?? lastRegularWatchDate(series.watchedEpisodes);
}

export function seriesCountsTowardYearGoal(
  series: SeriesEntry,
  year: number,
): boolean {
  return yearsSeriesCountsToward(series).includes(year);
}

/** Years a series counts toward annual catch-up goals. */
export function yearsSeriesCountsToward(series: SeriesEntry): number[] {
  if (!isSeriesCaughtUp(series)) return [];
  const year = isoYear(seriesCompletionDate(series));
  return year != null ? [year] : [];
}

function bookActivityDate(book: BookEntry): string | null {
  return (
    book.finishedAt ??
    book.readingHistory
      ?.map((entry) => entry.date)
      .filter((date): date is string => Boolean(date))
      .sort()
      .at(-1) ??
    book.startedAt ??
    null
  );
}

/**
 * Years a finished book counts toward annual goals.
 * Undated finished books count only for `undatedFallbackYear` (active goals year).
 */
export function yearsBookCountsToward(
  book: BookEntry,
  undatedFallbackYear: number,
): number[] {
  if (book.status !== "finished") return [];
  const activityDate = bookActivityDate(book);
  if (!activityDate) return [undatedFallbackYear];
  const year = isoYear(activityDate);
  return year != null ? [year] : [];
}

export function bookCountsTowardYearGoal(
  book: BookEntry,
  year: number,
  undatedFallbackYear?: number,
): boolean {
  return yearsBookCountsToward(book, undatedFallbackYear ?? year).includes(
    year,
  );
}
