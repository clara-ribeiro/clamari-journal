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

export type MovieDetail = {
  title: string;
  fields: DetailField[];
  note: string;
};

export type SeriesDetail = {
  title: string;
  fields: DetailField[];
  episodesHeading: string;
  episodes: EpisodePreview[];
};

export type BookDetail = {
  title: string;
  fields: DetailField[];
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
};
