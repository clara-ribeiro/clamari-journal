export type JournalMedium = "movie" | "series" | "book";

/**
 * Ready-to-render journal entry for feeds and cards.
 * Built by application use-cases — UI must not assemble this.
 */
export type JournalEntry = {
  medium: JournalMedium;
  slug: string;
  title: string;
  /** ISO date of latest activity; null when unknown */
  activityDate: string | null;
  rating?: number;
  href: string;
  /** Absolute poster/cover URL, or null until enrichment */
  posterUrl: string | null;
};

/** Row for medium catalog list pages. */
export type CatalogListItem = {
  slug: string;
  title: string;
  href: string;
  meta: string;
};

/** Key/value rows for medium detail pages. */
export type DetailField = {
  label: string;
  value: string;
};

export type EpisodePreview = {
  id: string;
  label: string;
  date: string;
};

/** Chronological personal viewing row for film detail. */
export type MovieViewingRecord = {
  dateLabel: string;
  kindLabel: string;
};

/** Principal cast row ready for the film detail template. */
export type MovieCastMember = {
  id: number;
  name: string;
  role: string;
  profileUrl: string | null;
};

/**
 * Complete film detail DTO — TMDB metadata + personal journal fields.
 * Built by `getMovieDetail`; UI must not assemble URLs or summary strings.
 */
export type MovieDetail = {
  slug: string;
  title: string;
  originalTitle: string | null;
  yearLabel: string | null;
  runtimeLabel: string | null;
  genres: string[];
  synopsis: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  directorsLabel: string | null;
  writersLabel: string | null;
  cast: MovieCastMember[];
  countriesLabel: string | null;
  languagesLabel: string | null;
  trailer: { name: string; url: string } | null;
  /** Present when TMDB id is missing or the provider call failed */
  metadataNotice: string | null;

  statusLabel: string;
  rating?: number;
  favorite: boolean;
  favoriteLabel: string;
  tags: string[];
  watchLocation: string | null;
  streamingService: string | null;
  viewingCount: number;
  viewingCountLabel: string;
  viewings: MovieViewingRecord[];
  viewingsEmptyLabel: string;

  /** Filename stem under `src/content/reviews/films/` when a review is planned */
  reviewSlug: string | null;
  /** Sanitized HTML from the review file; null when the file is missing */
  reviewHtml: string | null;
  reviewEmptyLabel: string;

  metaTitle: string;
  metaDescription: string;
};

/** Episode row for series detail season accordions. */
export type SeriesEpisodeDetail = {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  codeLabel: string;
  title: string;
  runtimeLabel: string | null;
  airDateLabel: string | null;
  watched: boolean;
  watchedDateLabel: string | null;
  rating?: number;
  isNext: boolean;
};

/** Season accordion payload for series detail. */
export type SeriesSeasonDetail = {
  id: string;
  seasonNumber: number;
  title: string;
  isSpecials: boolean;
  progressLabel: string;
  episodeCount: number;
  watchedCount: number;
  episodes: SeriesEpisodeDetail[];
};

/**
 * Complete series detail DTO — TMDB metadata + personal progress.
 * Built by `getSeriesDetail`; UI must not assemble URLs or summary strings.
 */
export type SeriesDetail = {
  slug: string;
  title: string;
  originalTitle: string | null;
  yearLabel: string | null;
  genres: string[];
  synopsis: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  creatorsLabel: string | null;
  writersLabel: string | null;
  cast: MovieCastMember[];
  countriesLabel: string | null;
  languagesLabel: string | null;
  productionStatusLabel: string | null;
  trailer: { name: string; url: string } | null;
  metadataNotice: string | null;

  statusLabel: string;
  rating?: number;
  favorite: boolean;
  favoriteLabel: string;
  startedLabel: string | null;
  finishedLabel: string | null;
  watchedEpisodesLabel: string;
  watchedTimeLabel: string | null;
  progressLabel: string | null;
  progressPercent: number | null;
  nextEpisodeLabel: string | null;

  seasons: SeriesSeasonDetail[];
  seasonsEmptyLabel: string;

  reviewSlug: string | null;
  reviewHtml: string | null;
  reviewEmptyLabel: string;

  metaTitle: string;
  metaDescription: string;
};

/** Chronological reading-history row for book detail. */
export type BookHistoryRecord = {
  id: string;
  dateLabel: string;
  pageLabel: string | null;
  note: string | null;
};

/** Favorite quotation row for book detail. */
export type BookQuoteRecord = {
  id: string;
  text: string;
  pageLabel: string | null;
  note: string | null;
};

/** Personal note extracted from reading history. */
export type BookNoteRecord = {
  id: string;
  dateLabel: string;
  text: string;
};

/**
 * Complete book detail DTO — Google Books metadata + personal reading record.
 * Built by `getBookDetail`; UI must not assemble URLs or summary strings.
 */
export type BookDetail = {
  slug: string;
  title: string;
  subtitle: string | null;
  authorsLabel: string | null;
  yearLabel: string | null;
  categories: string[];
  synopsis: string | null;
  /** Short plain-text excerpt for the typographic hero backdrop */
  heroExcerpt: string | null;
  coverUrl: string | null;
  publisherLabel: string | null;
  pageCountLabel: string | null;
  languageLabel: string | null;
  isbn10Label: string | null;
  isbn13Label: string | null;
  metadataNotice: string | null;

  statusLabel: string;
  rating?: number;
  favorite: boolean;
  favoriteLabel: string;
  formatLabel: string | null;
  tags: string[];
  startedLabel: string | null;
  finishedLabel: string | null;
  currentPageLabel: string | null;
  progressLabel: string | null;
  progressPercent: number | null;

  quotes: BookQuoteRecord[];
  quotesEmptyLabel: string;
  history: BookHistoryRecord[];
  historyEmptyLabel: string;
  notes: BookNoteRecord[];
  notesEmptyLabel: string;

  reviewSlug: string | null;
  reviewHtml: string | null;
  reviewEmptyLabel: string;

  metaTitle: string;
  metaDescription: string;
};

export type StatsMetric = {
  id: string;
  value: string;
  label: string;
};

export type GoalMetric = {
  key: string;
  value: string;
  label: string;
  current: number;
  target: number;
  percent: number;
  exceeded: boolean;
  /** Goal calendar year from goals.json */
  year: number;
  /** Catalog deep-link with year filter for this goal */
  href: string;
};
