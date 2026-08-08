export type CatalogStatusTone = "positive" | "warning" | "neutral";

/**
 * Ready-to-render catalog card for films / series / books grids.
 * Assembled in use-cases — UI must not derive labels from raw entities.
 */
export type CatalogCardItem = {
  slug: string;
  title: string;
  href: string;
  posterUrl: string | null;
  rating?: number;
  favorite: boolean;
  hasReview: boolean;
  statusLabel: string;
  statusTone: CatalogStatusTone;
  yearLabel: string | null;
  activityLabel: string;
  favoriteLabel: string;
  reviewLabel: string;
  metaTags: string[];
  /** Client filter / sort keys */
  statusKey: string;
  sortTitle: string;
  sortDate: string | null;
  sortRating: number;
  /** Release / publication year for sorting — null when unknown */
  sortYear: number | null;
  /**
   * Calendar years this entry counts toward yearly goals
   * (finished / caught-up activity). Used by `?year=` catalog filter.
   */
  goalYears: number[];
  /** Watched episode count — used by series catalog summaries */
  watchedEpisodeCount: number;
};
