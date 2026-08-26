import { cache } from "react";
import { bookRepository, goalsRepository } from "@/composition/repositories";
import type {
  BookDetail,
  BookHistoryRecord,
  BookNoteRecord,
  BookQuoteRecord,
  CatalogCardItem,
} from "@/application/dto";
import type { GoogleBooksMetadata } from "@/application/dto/google-books-metadata";
import type { BookEntry, BookFormat } from "@/domain/entities";
import { booksCopy } from "@/content/copy/books";
import { catalogCopy } from "@/content/copy/catalog";
import {
  getBookById,
  GoogleBooksError,
} from "@/infrastructure/google-books/client";
import { formatDate } from "@/lib/formatters/formatDate";
import { buildDetailMeta } from "@/lib/detail-meta";
import { stripHtml } from "@/lib/plain-text";
import { yearsBookCountsToward } from "./goal-years";
import { getReviewHtml } from "./reviews";

/** Cap for the typographic hero backdrop — keeps DOM/paint light. */
export const HERO_EXCERPT_MAX = 500;

export { stripHtml };

export function listBooks(): BookEntry[] {
  return bookRepository.findAll();
}

export function getBookBySlug(slug: string): BookEntry | undefined {
  return bookRepository.findBySlug(slug);
}

export function computeBookStats(all: BookEntry[]) {
  const finished = all.filter((b) => b.status === "finished");
  const reading = all.filter((b) => b.status === "reading");

  return {
    total: all.length,
    finished: finished.length,
    reading: reading.length,
    favorites: all.filter((b) => b.favorite).length,
    pagesRead: finished.reduce(
      (sum, b) => sum + (b.customPageCount ?? b.currentPage ?? 0),
      0,
    ),
  };
}

export function getBookStats() {
  return computeBookStats(bookRepository.findAll());
}

function bookStatusTone(
  status: BookEntry["status"],
): CatalogCardItem["statusTone"] {
  if (status === "want-to-read") return "warning";
  if (status === "finished" || status === "reading") return "positive";
  return "neutral";
}

function toBookCatalogCard(book: BookEntry): CatalogCardItem {
  const title = book.title ?? book.slug;
  const statusLabel = catalogCopy.status.books[book.status];
  const hasReview = Boolean(book.reviewSlug);
  const favorite = Boolean(book.favorite);
  const activityDate = book.finishedAt ?? book.startedAt ?? null;
  const activityLabel = book.finishedAt
    ? catalogCopy.card.finishedOn.replace(
        "{date}",
        formatDate(book.finishedAt),
      )
    : book.startedAt
      ? catalogCopy.card.startedOn.replace(
          "{date}",
          formatDate(book.startedAt),
        )
      : catalogCopy.card.noActivityDate;
  const pagesLabel =
    book.customPageCount != null ? `${book.customPageCount} pages` : null;

  const metaTags = [
    book.format ?? null,
    pagesLabel,
    ...(book.tags ?? []).slice(0, 2),
    statusLabel,
  ].filter((tag): tag is string => Boolean(tag));

  return {
    medium: "book",
    slug: book.slug,
    title,
    href: `/books/${book.slug}`,
    posterUrl: book.coverUrl ?? null,
    rating: book.rating,
    favorite,
    hasReview,
    statusLabel,
    statusTone: bookStatusTone(book.status),
    yearLabel: null,
    activityLabel,
    favoriteLabel: favorite
      ? catalogCopy.card.favorite
      : catalogCopy.card.notFavorite,
    reviewLabel: hasReview
      ? catalogCopy.card.withReview
      : catalogCopy.card.noReview,
    metaTags,
    statusKey: book.status,
    sortTitle: title,
    sortDate: activityDate,
    sortRating: book.rating ?? 0,
    sortYear: null,
    goalYears: yearsBookCountsToward(book, goalsRepository.get().year),
    watchedEpisodeCount: 0,
  };
}

export function listBookCatalogItems(): CatalogCardItem[] {
  return listBooks()
    .map(toBookCatalogCard)
    .sort((a, b) => a.sortTitle.localeCompare(b.sortTitle));
}

function joinNames(names: string[]): string | null {
  const cleaned = names.map((name) => name.trim()).filter(Boolean);
  if (cleaned.length === 0) return null;
  return cleaned.join(", ");
}

/** Short plain excerpt for the typographic hero — capped for paint cost. */
export function buildHeroExcerpt(
  description: string | null | undefined,
  max = HERO_EXCERPT_MAX,
): string | null {
  if (!description) return null;
  const plain = stripHtml(description);
  if (!plain) return null;
  if (plain.length <= max) return plain;
  const slice = plain.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const clipped = lastSpace > 80 ? slice.slice(0, lastSpace) : slice;
  return `${clipped}…`;
}

function formatLabel(format: BookFormat | undefined): string | null {
  if (!format) return null;
  return booksCopy.detail.format[format];
}

function pageLabel(page: number | undefined): string | null {
  if (page == null) return null;
  return booksCopy.detail.history.page.replace("{page}", String(page));
}

function buildQuotes(entry: BookEntry): BookQuoteRecord[] {
  return (entry.quotes ?? []).map((quote, index) => ({
    id: `quote-${index}`,
    text: quote.text,
    pageLabel: pageLabel(quote.page),
    note: quote.note?.trim() || null,
  }));
}

function buildHistory(entry: BookEntry): BookHistoryRecord[] {
  const rows = [...(entry.readingHistory ?? [])].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  return rows.map((row, index) => ({
    id: `history-${index}-${row.date}`,
    dateLabel: formatDate(row.date),
    pageLabel: pageLabel(row.page),
    note: row.note?.trim() || null,
  }));
}

function buildNotes(entry: BookEntry): BookNoteRecord[] {
  const rows = [...(entry.readingHistory ?? [])]
    .filter((row) => Boolean(row.note?.trim()))
    .sort((a, b) => a.date.localeCompare(b.date));
  return rows.map((row, index) => ({
    id: `note-${index}-${row.date}`,
    dateLabel: formatDate(row.date),
    text: row.note!.trim(),
  }));
}

export function mapBookDetail(
  entry: BookEntry,
  metadata: GoogleBooksMetadata | null,
  metadataNotice: string | null,
  reviewHtml: string | null = null,
): BookDetail {
  const copy = booksCopy.detail;
  const title =
    metadata?.title?.trim() || entry.title?.trim() || entry.slug;
  const subtitle = metadata?.subtitle?.trim() || null;
  const synopsisRaw = metadata?.description
    ? stripHtml(metadata.description)
    : null;
  const synopsis = synopsisRaw || null;
  const heroExcerpt = buildHeroExcerpt(metadata?.description);
  const coverUrl = metadata?.coverUrl ?? entry.coverUrl ?? null;
  const favorite = Boolean(entry.favorite);
  const reviewSlug = entry.reviewSlug ?? null;

  const pageCount = metadata?.pageCount ?? entry.customPageCount ?? null;
  const currentPage = entry.currentPage ?? null;
  const progressPercent =
    pageCount != null && pageCount > 0 && currentPage != null
      ? Math.min(100, Math.round((currentPage / pageCount) * 100))
      : entry.status === "finished" && pageCount != null
        ? 100
        : null;

  const yearLabel = metadata?.year != null ? String(metadata.year) : null;

  const { metaTitle, metaDescription } = buildDetailMeta({
    title,
    year: yearLabel,
    synopsis,
    reviewHtml,
    copy: copy.meta,
  });

  return {
    slug: entry.slug,
    title,
    subtitle,
    authorsLabel: joinNames(metadata?.authors ?? []),
    yearLabel,
    categories: (metadata?.categories ?? []).slice(0, 4),
    synopsis,
    heroExcerpt,
    coverUrl,
    publisherLabel: metadata?.publisher?.trim() || null,
    pageCountLabel: pageCount != null ? String(pageCount) : null,
    languageLabel: metadata?.language?.trim() || null,
    isbn10Label: metadata?.identifiers.isbn10 ?? null,
    isbn13Label: metadata?.identifiers.isbn13 ?? null,
    metadataNotice,
    statusLabel: catalogCopy.status.books[entry.status],
    rating: entry.rating,
    favorite,
    favoriteLabel: favorite
      ? catalogCopy.card.favorite
      : catalogCopy.card.notFavorite,
    formatLabel: formatLabel(entry.format),
    tags: entry.tags ?? [],
    startedLabel: entry.startedAt ? formatDate(entry.startedAt) : null,
    finishedLabel: entry.finishedAt ? formatDate(entry.finishedAt) : null,
    currentPageLabel:
      currentPage != null
        ? pageCount != null
          ? `${currentPage} / ${pageCount}`
          : String(currentPage)
        : null,
    progressLabel:
      progressPercent != null ? `${progressPercent}%` : null,
    progressPercent,
    quotes: buildQuotes(entry),
    quotesEmptyLabel: copy.quotes.empty,
    history: buildHistory(entry),
    historyEmptyLabel: copy.history.empty,
    notes: buildNotes(entry),
    notesEmptyLabel: copy.notes.empty,
    reviewSlug,
    reviewHtml,
    reviewEmptyLabel: reviewSlug ? copy.review.pending : copy.review.empty,
    metaTitle,
    metaDescription,
  };
}

async function loadBookMetadata(
  googleBooksId: string,
  customPageCount: number | undefined,
): Promise<{
  metadata: GoogleBooksMetadata | null;
  notice: string | null;
}> {
  try {
    const metadata = await getBookById(googleBooksId, {
      customPageCount: customPageCount ?? null,
    });
    return { metadata, notice: null };
  } catch (error) {
    if (error instanceof GoogleBooksError && error.code === "not_found") {
      return {
        metadata: null,
        notice: booksCopy.detail.metadata.unresolved,
      };
    }
    return {
      metadata: null,
      notice: booksCopy.detail.metadata.unavailable,
    };
  }
}

/**
 * Book detail for `/books/[slug]`. Cached per request so metadata
 * and the page share one Google Books fetch.
 */
export const getBookDetail = cache(
  async (slug: string): Promise<BookDetail | undefined> => {
    const entry = getBookBySlug(slug);
    if (!entry) return undefined;

    const { metadata, notice } = await loadBookMetadata(
      entry.googleBooksId,
      entry.customPageCount,
    );
    return mapBookDetail(
      entry,
      metadata,
      notice,
      getReviewHtml("books", entry.reviewSlug),
    );
  },
);
