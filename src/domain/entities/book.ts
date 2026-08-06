import type { RatingValue } from "@/domain/value-objects/rating";

export type BookStatus =
  | "want-to-read"
  | "reading"
  | "paused"
  | "finished"
  | "abandoned";

export type BookFormat = "physical" | "ebook" | "audiobook";

export type ReadingUpdate = {
  date: string;
  page?: number;
  note?: string;
};

export type BookQuote = {
  text: string;
  page?: number;
  note?: string;
};

export type BookEntry = {
  googleBooksId: string;
  slug: string;
  /** Fallback title until Google Books enrichment */
  title?: string;
  status: BookStatus;
  rating?: RatingValue;
  favorite?: boolean;
  startedAt?: string;
  finishedAt?: string;
  currentPage?: number;
  customPageCount?: number;
  format?: BookFormat;
  tags?: string[];
  reviewSlug?: string;
  /** Absolute cover URL — filled by offline enrich (no per-request API). */
  coverUrl?: string;
  readingHistory?: ReadingUpdate[];
  quotes?: BookQuote[];
};
