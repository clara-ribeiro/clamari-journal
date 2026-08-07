import { bookRepository } from "@/composition/repositories";
import type { BookDetail, CatalogCardItem } from "@/application/dto";
import type { BookEntry } from "@/domain/entities";
import { booksCopy } from "@/content/copy/books";
import { catalogCopy } from "@/content/copy/catalog";
import { formatDate } from "@/lib/formatters/formatDate";

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
    favorite ? catalogCopy.card.favorite : null,
    statusLabel,
    hasReview ? catalogCopy.card.withReview : catalogCopy.card.noReview,
  ].filter((tag): tag is string => Boolean(tag));

  return {
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
  };
}

export function listBookCatalogItems(): CatalogCardItem[] {
  return listBooks()
    .map(toBookCatalogCard)
    .sort((a, b) => a.sortTitle.localeCompare(b.sortTitle));
}

export function getBookDetail(slug: string): BookDetail | undefined {
  const book = getBookBySlug(slug);
  if (!book) return undefined;

  return {
    title: book.title ?? book.slug,
    fields: [
      { label: booksCopy.detail.fields.status, value: book.status },
      {
        label: booksCopy.detail.fields.rating,
        value: book.rating != null ? String(book.rating) : "—",
      },
      {
        label: booksCopy.detail.fields.pages,
        value:
          book.customPageCount != null
            ? String(book.customPageCount)
            : "—",
      },
      {
        label: booksCopy.detail.fields.format,
        value: book.format ?? "—",
      },
    ],
  };
}

export function getBooksPageSummary() {
  const stats = getBookStats();
  return booksCopy.list.summary
    .replace("{finished}", String(stats.finished))
    .replace("{reading}", String(stats.reading))
    .replace("{total}", String(stats.total));
}
