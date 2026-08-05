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
