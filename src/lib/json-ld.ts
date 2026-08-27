import type { BookDetail, MovieDetail, SeriesDetail } from "@/application/dto";
import { siteCopy } from "@/content/copy";
import { reviewPlainText } from "@/lib/plain-text";
import {
  extractReviewImages,
  isLocalSiteImage,
} from "@/lib/review-images";
import {
  DEFAULT_REVIEW_LOCALE,
  reviewPagePath,
  type ReviewLocale,
} from "@/lib/review-locale";
import { absoluteUrl } from "@/lib/site-url";

export type JsonLd = Record<string, unknown>;

/** Serialize JSON-LD and escape `<` so the payload cannot break out of the script tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function splitNames(label: string | null): string[] {
  if (!label) return [];
  return label
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
}

function yearValue(label: string | null): string | undefined {
  if (!label) return undefined;
  const year = label.trim();
  return /^\d{4}$/.test(year) ? year : undefined;
}

function absoluteImage(url: string | null): string | undefined {
  if (!url?.trim()) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return absoluteUrl(url);
  return undefined;
}

function personNodes(names: string[]) {
  if (names.length === 0) return undefined;
  const nodes = names.map((name) => ({ "@type": "Person", name }));
  return nodes.length === 1 ? nodes[0] : nodes;
}

function personalRating(rating: number | undefined) {
  if (typeof rating !== "number") return undefined;
  return {
    "@type": "Rating",
    ratingValue: rating,
    bestRating: 5,
    worstRating: 1,
  };
}

function isoLanguage(value: string | null): string | undefined {
  if (!value) return undefined;
  return /^[a-z]{2,3}(-[A-Za-z0-9]+)?$/i.test(value.trim())
    ? value.trim()
    : undefined;
}

function pageCount(label: string | null): number | undefined {
  if (!label) return undefined;
  return /^\d+$/.test(label) ? Number(label) : undefined;
}

function omitEmpty(value: JsonLd): JsonLd {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (entry == null || entry === "") return false;
      if (Array.isArray(entry) && entry.length === 0) return false;
      return true;
    }),
  );
}

type WorkJsonLdInput = {
  type: "Movie" | "TVSeries" | "Book";
  path: string;
  name: string;
  alternateName?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  year?: string | null;
  genres?: string[];
  director?: string | null;
  creator?: string | null;
  author?: string | null;
  isbn?: string | null;
  publisher?: string | null;
  inLanguage?: string | null;
  numberOfPages?: string | null;
  reviewHtml?: string | null;
  reviewName: string;
  reviewLocale?: ReviewLocale;
  rating?: number;
  actors?: string[];
};

function buildWorkNode(input: WorkJsonLdInput): JsonLd {
  const year = yearValue(input.year ?? null);
  const dateKey = input.type === "Book" ? "datePublished" : "dateCreated";

  return omitEmpty({
    "@type": input.type,
    name: input.name,
    alternateName: input.alternateName ?? undefined,
    url: absoluteUrl(input.path),
    image: absoluteImage(input.imageUrl ?? null),
    description: input.description?.trim() || undefined,
    [dateKey]: year,
    genre: input.genres?.length ? input.genres : undefined,
    director: personNodes(splitNames(input.director ?? null)),
    actor: personNodes(input.actors ?? []),
    creator: personNodes(splitNames(input.creator ?? null)),
    author: personNodes(splitNames(input.author ?? null)),
    isbn: input.isbn?.trim() || undefined,
    publisher: input.publisher?.trim()
      ? { "@type": "Organization", name: input.publisher.trim() }
      : undefined,
    inLanguage: isoLanguage(input.inLanguage ?? null),
    numberOfPages: pageCount(input.numberOfPages ?? null),
  });
}

function reviewImageObjects(html: string | null | undefined): JsonLd[] {
  return extractReviewImages(html)
    .filter((image) => isLocalSiteImage(image.src))
    .flatMap((image) => {
      const url = absoluteImage(image.src);
      if (!url) return [];
      const label = image.caption || image.alt;
      return [
        omitEmpty({
          "@type": "ImageObject",
          contentUrl: url,
          url,
          name: label || undefined,
          description: image.alt || image.caption || undefined,
          caption: image.caption || undefined,
        }),
      ];
    });
}

function buildDetailJsonLd(input: WorkJsonLdInput): JsonLd {
  const work = buildWorkNode(input);
  if (!input.reviewHtml?.trim()) {
    return { "@context": "https://schema.org", ...work };
  }

  const reviewBody = reviewPlainText(input.reviewHtml);
  const stills = reviewImageObjects(input.reviewHtml);

  return omitEmpty({
    "@context": "https://schema.org",
    "@type": "Review",
    name: input.reviewName,
    headline: input.reviewName,
    url: absoluteUrl(input.path),
    inLanguage: input.reviewLocale === "pt-BR" ? "pt-BR" : "en",
    author: {
      "@type": "Person",
      name: siteCopy.metadata.author,
    },
    itemReviewed: work,
    image: stills.length ? stills : undefined,
    reviewBody: reviewBody || undefined,
    reviewRating: personalRating(input.rating),
  });
}

export function buildMovieJsonLd(detail: MovieDetail): JsonLd {
  const locale = detail.reviewLocale ?? DEFAULT_REVIEW_LOCALE;
  return buildDetailJsonLd({
    type: "Movie",
    path: reviewPagePath("films", detail.slug, locale),
    name: detail.title,
    alternateName: detail.originalTitle,
    description: detail.synopsis,
    imageUrl: detail.posterUrl ?? detail.backdropUrl,
    year: detail.yearLabel,
    genres: detail.genres,
    director: detail.directorsLabel,
    actors: detail.cast.map((person) => person.name),
    reviewHtml: detail.reviewHtml,
    reviewName: detail.metaTitle,
    reviewLocale: locale,
    rating: detail.rating,
  });
}

export function buildSeriesJsonLd(detail: SeriesDetail): JsonLd {
  const locale = detail.reviewLocale ?? DEFAULT_REVIEW_LOCALE;
  return buildDetailJsonLd({
    type: "TVSeries",
    path: reviewPagePath("series", detail.slug, locale),
    name: detail.title,
    alternateName: detail.originalTitle,
    description: detail.synopsis,
    imageUrl: detail.posterUrl ?? detail.backdropUrl,
    year: detail.yearLabel,
    genres: detail.genres,
    creator: detail.creatorsLabel,
    actors: detail.cast.map((person) => person.name),
    reviewHtml: detail.reviewHtml,
    reviewName: detail.metaTitle,
    reviewLocale: locale,
    rating: detail.rating,
  });
}

export function buildBookJsonLd(detail: BookDetail): JsonLd {
  const locale = detail.reviewLocale ?? DEFAULT_REVIEW_LOCALE;
  return buildDetailJsonLd({
    type: "Book",
    path: reviewPagePath("books", detail.slug, locale),
    name: detail.title,
    alternateName: detail.subtitle,
    description: detail.synopsis,
    imageUrl: detail.coverUrl,
    year: detail.yearLabel,
    genres: detail.categories,
    author: detail.authorsLabel,
    isbn: detail.isbn13Label ?? detail.isbn10Label,
    publisher: detail.publisherLabel,
    inLanguage: detail.languageLabel,
    numberOfPages: detail.pageCountLabel,
    reviewHtml: detail.reviewHtml,
    reviewName: detail.metaTitle,
    reviewLocale: locale,
    rating: detail.rating,
  });
}
