/**
 * Normalized Google Books metadata for use cases and UI.
 * Built by the Google Books infrastructure adapter — never pass raw provider payloads to components.
 */

export type GoogleBooksPageCountSource = "provider" | "personal" | "unknown";

export type GoogleBooksIdentifiers = {
  isbn10: string | null;
  isbn13: string | null;
  other: Array<{ type: string; value: string }>;
};

export type GoogleBooksSearchHit = {
  id: string;
  title: string;
  subtitle: string | null;
  authors: string[];
  publisher: string | null;
  publishedDate: string | null;
  year: number | null;
  pageCount: number | null;
  language: string | null;
  categories: string[];
  description: string | null;
  coverUrl: string | null;
  identifiers: GoogleBooksIdentifiers;
};

export type GoogleBooksSearchPage = {
  totalItems: number;
  results: GoogleBooksSearchHit[];
};

export type GoogleBooksMetadata = {
  id: string;
  title: string;
  subtitle: string | null;
  authors: string[];
  publisher: string | null;
  publishedDate: string | null;
  year: number | null;
  /** Effective page count after optional personal override */
  pageCount: number | null;
  pageCountSource: GoogleBooksPageCountSource;
  /** Page count reported by Google Books before personal override */
  providerPageCount: number | null;
  language: string | null;
  categories: string[];
  description: string | null;
  coverUrl: string | null;
  identifiers: GoogleBooksIdentifiers;
};

export type GoogleBooksSearchMode = "query" | "title" | "author" | "isbn";
