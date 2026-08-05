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
  rating?: number;
  favorite?: boolean;
  startedAt?: string;
  finishedAt?: string;
  currentPage?: number;
  customPageCount?: number;
  format?: BookFormat;
  tags?: string[];
  reviewSlug?: string;
  readingHistory?: ReadingUpdate[];
  quotes?: BookQuote[];
};
