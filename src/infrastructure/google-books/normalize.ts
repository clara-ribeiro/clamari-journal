import type {
  GoogleBooksIdentifiers,
  GoogleBooksMetadata,
  GoogleBooksSearchHit,
  GoogleBooksSearchPage,
} from "@/application/dto/google-books-metadata";
import { GoogleBooksError } from "./errors";
import type {
  GoogleBooksRawImageLinks,
  GoogleBooksRawSearchResponse,
  GoogleBooksRawVolume,
} from "./raw";

function cleanText(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function cleanStringList(values: string[] | undefined): string[] {
  return [...new Set((values ?? []).map((value) => value.trim()).filter(Boolean))];
}

function yearFromPublishedDate(value: string | null | undefined): number | null {
  const date = cleanText(value);
  if (!date || date.length < 4) return null;
  const year = Number(date.slice(0, 4));
  return Number.isInteger(year) && year >= 1000 && year <= 2100 ? year : null;
}

function positiveInt(value: number | null | undefined): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }
  return Math.round(value);
}

/**
 * Canonical Google Books cover URL for a volume id.
 * Matches the shape returned in `imageLinks` after our https/zoom normalization.
 */
export function coverUrlFromVolumeId(id: string): string {
  const params = new URLSearchParams({
    id,
    printsec: "frontcover",
    img: "1",
    zoom: "2",
    source: "gbs_api",
  });
  return `https://books.google.com/books/content?${params}`;
}

/** Prefer HTTPS for Google Books cover hosts. */
export function toSecureCoverUrl(url: string): string {
  return url.replace(/^http:\/\//i, "https://");
}

/**
 * Pick the largest available cover and lightly upscale common zoom=1 thumbnails.
 */
export function selectCoverUrl(
  imageLinks: GoogleBooksRawImageLinks | undefined,
): string | null {
  if (!imageLinks) return null;

  const ordered = [
    imageLinks.extraLarge,
    imageLinks.large,
    imageLinks.medium,
    imageLinks.thumbnail,
    imageLinks.small,
    imageLinks.smallThumbnail,
  ];

  const chosen = ordered.map((value) => cleanText(value)).find(Boolean);
  if (!chosen) return null;

  let url = toSecureCoverUrl(chosen);
  // Google thumbnail URLs often use zoom=1; zoom=2 is a better card/detail default.
  if (/[?&]zoom=1(?:&|$)/.test(url)) {
    url = url.replace(/([?&])zoom=1(&|$)/, "$1zoom=2$2");
  }
  return url;
}

function normalizeIdentifiers(
  raw: Array<{ type?: string; identifier?: string }> | undefined,
): GoogleBooksIdentifiers {
  let isbn10: string | null = null;
  let isbn13: string | null = null;
  const other: Array<{ type: string; value: string }> = [];

  for (const entry of raw ?? []) {
    const type = cleanText(entry.type);
    const value = cleanText(entry.identifier);
    if (!type || !value) continue;
    if (type === "ISBN_10" && !isbn10) {
      isbn10 = value;
      continue;
    }
    if (type === "ISBN_13" && !isbn13) {
      isbn13 = value;
      continue;
    }
    other.push({ type, value });
  }

  return { isbn10, isbn13, other };
}

function normalizeVolumeFields(raw: GoogleBooksRawVolume): Omit<
  GoogleBooksSearchHit,
  "id"
> | null {
  const info = raw.volumeInfo;
  const title = cleanText(info?.title);
  if (!title) return null;

  const providerPageCount = positiveInt(info?.pageCount);

  return {
    title,
    subtitle: cleanText(info?.subtitle),
    authors: cleanStringList(info?.authors),
    publisher: cleanText(info?.publisher),
    publishedDate: cleanText(info?.publishedDate),
    year: yearFromPublishedDate(info?.publishedDate),
    pageCount: providerPageCount,
    language: cleanText(info?.language),
    categories: cleanStringList(info?.categories),
    description: cleanText(info?.description),
    coverUrl: selectCoverUrl(info?.imageLinks),
    identifiers: normalizeIdentifiers(info?.industryIdentifiers),
  };
}

export function normalizeSearchHit(
  raw: GoogleBooksRawVolume,
): GoogleBooksSearchHit | null {
  const id = cleanText(raw.id);
  if (!id) return null;
  const fields = normalizeVolumeFields(raw);
  if (!fields) return null;
  return { id, ...fields };
}

export function normalizeSearchPage(
  raw: GoogleBooksRawSearchResponse,
): GoogleBooksSearchPage {
  return {
    totalItems: positiveInt(raw.totalItems) ?? 0,
    results: (raw.items ?? [])
      .map(normalizeSearchHit)
      .filter((hit): hit is GoogleBooksSearchHit => hit !== null),
  };
}

export function normalizeVolume(raw: GoogleBooksRawVolume): GoogleBooksMetadata {
  const id = cleanText(raw.id);
  if (!id) {
    throw new GoogleBooksError(
      "bad_response",
      "Google Books volume is missing an id",
    );
  }
  const fields = normalizeVolumeFields(raw);
  if (!fields) {
    throw new GoogleBooksError(
      "bad_response",
      "Google Books volume is missing a title",
    );
  }

  return {
    id,
    ...fields,
    providerPageCount: fields.pageCount,
    pageCountSource: fields.pageCount ? "provider" : "unknown",
  };
}

/**
 * Apply a personal custom page count over provider metadata when the journal
 * stores an override (or when the provider omits page count).
 */
export function withPersonalPageCount(
  metadata: GoogleBooksMetadata,
  customPageCount?: number | null,
): GoogleBooksMetadata {
  if (
    typeof customPageCount === "number" &&
    Number.isFinite(customPageCount) &&
    customPageCount > 0
  ) {
    return {
      ...metadata,
      pageCount: Math.round(customPageCount),
      pageCountSource: "personal",
    };
  }
  return metadata;
}
