import type {
  BookEntry,
  BookStatus,
  MovieStatus,
  ReadingUpdate,
  SeriesEntry,
  SeriesStatus,
  WatchedEpisode,
} from "./entities";

/**
 * Single source of truth for what each journal status means.
 *
 * Progress always wins over the recorded mark: a film's watch dates, a series'
 * unique regular episodes vs TMDB's released total, a book's furthest page vs
 * its total. Incomplete series and books then follow idle time (TV Time's
 * Watch Next → "Haven't watched for a while" after ~60 days; auto-drop after
 * two years, since TV Time's "Stopped watching" was manual). Every reader
 * (JSON parse, the file repositories once per calendar day, detail coverage,
 * CLI) resolves through here against today's date, so statuses move without
 * rewriting the JSON or touching every page request.
 */

export const MOVIE_STATUSES = [
  "watchlist",
  "watched",
  "rewatch",
] as const satisfies readonly MovieStatus[];

export const SERIES_STATUSES = [
  "watchlist",
  "watching",
  "paused",
  "completed",
  "abandoned",
] as const satisfies readonly SeriesStatus[];

export const BOOK_STATUSES = [
  "want-to-read",
  "reading",
  "paused",
  "finished",
  "abandoned",
] as const satisfies readonly BookStatus[];

/** Accepted in `series.json`: `up-to-date` is a legacy alias, never a resolved status. */
export type SeriesStatusInput = SeriesStatus | "up-to-date";

export const SERIES_STATUS_INPUTS = [
  ...SERIES_STATUSES,
  "up-to-date",
] as const satisfies readonly SeriesStatusInput[];

export function isMovieStatus(value: string): value is MovieStatus {
  return (MOVIE_STATUSES as readonly string[]).includes(value);
}

/** A film with at least one viewing, however many times it was seen. */
export function isWatchedMovieStatus(
  status: string,
): status is Extract<MovieStatus, "watched" | "rewatch"> {
  return status === "watched" || status === "rewatch";
}

/**
 * TV Time moves a show from Watch Next to "Haven't watched for a while"
 * after about two months idle. Same window for books still in progress.
 */
export const JOURNAL_PAUSE_AFTER_IDLE_DAYS = 60;

/**
 * TV Time's "Stopped watching" was a tap, not a timer. Two years idle is the
 * automatic drop (Trakt/Simkl also treat drop as manual; a new log undrops).
 */
export const JOURNAL_ABANDON_AFTER_IDLE_DAYS = 730;

export type JournalStatusClock = {
  today?: string;
  startedAt?: string;
};

export function isoToday(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

function utcDayNumber(iso: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return null;
  return (
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])) /
    86_400_000
  );
}

function calendarDaysBetween(from: string, to: string): number | null {
  const start = utcDayNumber(from);
  const end = utcDayNumber(to);
  if (start == null || end == null) return null;
  return end - start;
}

/**
 * Last regular watch (or `startedAt`) vs today.
 * Undated progress stays `watching` — there is no idle clock to run.
 */
export function resolveInactivityStatus(
  lastActivity: string | undefined,
  today: string,
): "watching" | "paused" | "abandoned" {
  if (!lastActivity) return "watching";
  const days = calendarDaysBetween(lastActivity, today);
  if (days == null || days < JOURNAL_PAUSE_AFTER_IDLE_DAYS) {
    return "watching";
  }
  if (days < JOURNAL_ABANDON_AFTER_IDLE_DAYS) return "paused";
  return "abandoned";
}

export function episodeKey(season: number, episode: number): string {
  return `${season}-${episode}`;
}

function isRegular(episode: WatchedEpisode): boolean {
  return episode.season > 0;
}

/** Unique calendar dates, oldest first. Rewatches are extra dates, not extra films. */
export function uniqueWatchDates(
  dates: readonly string[] | undefined,
): string[] {
  if (!dates?.length) return [];
  return [...new Set(dates)].sort();
}

/** Regular (non-special) watches, unique by season+episode. Rewatches do not add. */
export function uniqueRegularWatchedCount(
  episodes: readonly WatchedEpisode[],
): number {
  const keys = new Set<string>();
  for (const episode of episodes) {
    if (!isRegular(episode)) continue;
    keys.add(episodeKey(episode.season, episode.episode));
  }
  return keys.size;
}

/** Regular seasons with at least one watched episode. */
export function watchedSeasonNumbers(
  episodes: readonly WatchedEpisode[],
): Set<number> {
  const seasons = new Set<number>();
  for (const episode of episodes) {
    if (isRegular(episode)) seasons.add(episode.season);
  }
  return seasons;
}

export function hasWatchedAllReleasedEpisodes(
  episodes: readonly WatchedEpisode[],
  releasedCount: number | undefined,
): boolean {
  if (releasedCount == null || releasedCount < 1) return false;
  return uniqueRegularWatchedCount(episodes) >= releasedCount;
}

export function lastRegularWatchDate(
  episodes: readonly WatchedEpisode[],
): string | undefined {
  return episodes
    .flatMap((episode) =>
      isRegular(episode) && episode.watchedAt ? [episode.watchedAt] : [],
    )
    .sort()
    .at(-1);
}

/** Whole-number percent, capped at 100. Missing totals stay unknown. */
export function journalProgressPercent(
  current: number | null | undefined,
  total: number | null | undefined,
): number | null {
  if (current == null || total == null || total < 1) return null;
  return Math.min(100, Math.round((current / total) * 100));
}

/**
 * Films: the number of viewings is the status.
 * No dates keeps an explicit `watched` mark or the watchlist; one date is
 * `watched`; two or more are a `rewatch`.
 */
export function resolveJournalMovieStatus(
  status: MovieStatus,
  dates: readonly string[] | undefined,
): MovieStatus {
  const viewings = uniqueWatchDates(dates).length;
  if (viewings >= 2) return "rewatch";
  if (viewings === 1) return "watched";
  return status === "rewatch" ? "watched" : status;
}

/**
 * Series: coverage of TMDB's released total wins.
 * Full coverage is always `completed`, including rows imported as abandoned.
 * A `completed` mark that misses the total uses idle time, unless the total is
 * unknown and there is nothing to contradict it. Incomplete shows ignore the
 * JSON watching/paused/abandoned mark and classify from the last regular watch.
 */
export function resolveJournalSeriesStatus(
  status: SeriesStatusInput,
  episodes: readonly WatchedEpisode[],
  releasedCount: number | undefined,
  clock?: JournalStatusClock,
): SeriesStatus {
  const unique = uniqueRegularWatchedCount(episodes);
  if (releasedCount != null && releasedCount >= 1 && unique >= releasedCount) {
    return "completed";
  }

  const totalUnknown = releasedCount == null || releasedCount <= 0;
  if (unique === 0) {
    return status === "completed" && totalUnknown ? "completed" : "watchlist";
  }
  if (status === "completed" && totalUnknown) return "completed";

  return resolveInactivityStatus(
    lastRegularWatchDate(episodes) ?? clock?.startedAt,
    clock?.today ?? isoToday(),
  );
}

export type BookProgress = {
  status: BookStatus;
  currentPage?: number;
  customPageCount?: number;
  readingHistory?: readonly ReadingUpdate[];
  startedAt?: string;
};

export type ResolvedBookProgress = {
  status: BookStatus;
  currentPage: number | undefined;
};

/** Furthest page reached, from the current page or any reading update. */
function furthestPage(progress: BookProgress): number | undefined {
  const pages = (progress.readingHistory ?? [])
    .flatMap((entry) => (entry.page != null ? [entry.page] : []))
    .concat(progress.currentPage != null ? [progress.currentPage] : []);
  return pages.length > 0 ? Math.max(...pages) : undefined;
}

function lastBookActivityDate(progress: BookProgress): string | undefined {
  const historyDates = (progress.readingHistory ?? [])
    .map((entry) => entry.date)
    .filter((date): date is string => Boolean(date))
    .sort();
  return historyDates.at(-1) ?? progress.startedAt;
}

function resolveBookInactivityStatus(
  lastActivity: string | undefined,
  today: string,
): Extract<BookStatus, "reading" | "paused" | "abandoned"> {
  const live = resolveInactivityStatus(lastActivity, today);
  return live === "watching" ? "reading" : live;
}

/**
 * Books: page progress against `customPageCount` wins when both are known.
 * Reaching the total is always `finished`. A `finished` mark stays finished
 * and `currentPage` fills to the total; earlier history pages are checkpoints,
 * not leftover unread progress. Incomplete books then follow the same idle
 * windows as series (`reading` / `paused` / `abandoned`).
 */
export function resolveJournalBookStatus(
  progress: BookProgress,
  clock?: JournalStatusClock,
): ResolvedBookProgress {
  const { status, customPageCount } = progress;
  const page = furthestPage(progress);

  if (customPageCount != null && page != null && page >= customPageCount) {
    return { status: "finished", currentPage: customPageCount };
  }

  if (status === "finished") {
    return {
      status: "finished",
      currentPage: customPageCount ?? page,
    };
  }

  if (page == null || page <= 0) {
    return { status: "want-to-read", currentPage: page };
  }

  return {
    status: resolveBookInactivityStatus(
      lastBookActivityDate(progress),
      clock?.today ?? isoToday(),
    ),
    currentPage: page,
  };
}

/** Re-apply live series status (and finishedAt) for a calendar day. */
export function applyResolvedSeriesStatus(
  entry: SeriesEntry,
  today?: string,
): SeriesEntry {
  const status = resolveJournalSeriesStatus(
    entry.status,
    entry.watchedEpisodes,
    entry.numberOfEpisodes,
    { startedAt: entry.startedAt, today },
  );
  const finishedAt =
    status === "completed"
      ? (entry.finishedAt ?? lastRegularWatchDate(entry.watchedEpisodes))
      : undefined;
  if (status === entry.status && finishedAt === entry.finishedAt) {
    return entry;
  }
  return { ...entry, status, finishedAt };
}

/** Re-apply live book status (and currentPage) for a calendar day. */
export function applyResolvedBookStatus(
  book: BookEntry,
  today?: string,
): BookEntry {
  const { status, currentPage } = resolveJournalBookStatus(
    {
      status: book.status,
      currentPage: book.currentPage,
      customPageCount: book.customPageCount,
      readingHistory: book.readingHistory,
      startedAt: book.startedAt,
    },
    { today },
  );
  if (status === book.status && currentPage === book.currentPage) {
    return book;
  }
  return { ...book, status, currentPage };
}
