import type { Metadata } from "next";
import { copyFor } from "@/content/copy/for-locale";
import { allowSearchIndexing } from "@/lib/site-url";
import {
  DEFAULT_REVIEW_LOCALE,
  languageAlternates,
  ogAlternateLocale,
  ogLocale,
  pathForLocale,
  type ReviewLocale,
} from "@/lib/review-locale";

export type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  images?: readonly { url: string; alt?: string }[];
  /** When true, skip the root title template (home). */
  absoluteTitle?: boolean;
  index?: boolean;
  /** Open Graph type; detail pages with a published review use `article`. */
  ogType?: "website" | "article";
  locale?: ReviewLocale;
  languages?: Record<string, string>;
};

function defaultImages(title: string, locale: ReviewLocale) {
  const site = copyFor(locale).site;
  return [
    {
      url: site.metadata.ogImage,
      alt: site.metadata.ogImageAlt || title,
    },
  ];
}

/** Shared title, description, canonical, Open Graph, and Twitter tags. */
export function pageMetadata(input: PageMetadataInput): Metadata {
  const index = input.index ?? allowSearchIndexing();
  const locale = input.locale ?? DEFAULT_REVIEW_LOCALE;
  const site = copyFor(locale).site;
  const images = (
    input.images?.length
      ? [...input.images]
      : defaultImages(input.title, locale)
  ).map((image) => ({
    url: image.url,
    alt: image.alt ?? input.title,
  }));
  const languages =
    input.index === false
      ? input.languages
      : (input.languages ?? languageAlternates(input.path));
  const hasLanguages = Boolean(languages && Object.keys(languages).length > 0);

  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: {
      canonical: input.path,
      ...(hasLanguages ? { languages } : {}),
    },
    robots: { index, follow: index },
    openGraph: {
      title: input.title,
      description: input.description,
      url: input.path,
      siteName: site.brand.fullName,
      locale: ogLocale(locale),
      ...(hasLanguages
        ? { alternateLocale: [ogAlternateLocale(locale)] }
        : {}),
      type: input.ogType ?? "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: images.map((image) => image.url),
    },
  };
}

/**
 * Listing/home metadata. `path` is the unprefixed English route; the
 * canonical and hreflang pair are derived from `locale`.
 */
export function localePageMetadata(
  input: PageMetadataInput & { locale: ReviewLocale },
): Metadata {
  return pageMetadata({
    ...input,
    path: pathForLocale(input.path, input.locale),
    languages: input.languages ?? languageAlternates(input.path),
  });
}

export function detailPageMetadata(input: {
  title: string;
  description: string;
  path: string;
  imageUrl: string | null;
  hasReview?: boolean;
  extraImages?: readonly { url: string; alt?: string }[];
  locale?: ReviewLocale;
  languages?: Record<string, string>;
}): Metadata {
  const extras = [...(input.extraImages ?? [])];
  const poster = input.imageUrl
    ? [{ url: input.imageUrl, alt: input.title }]
    : [];
  const images = [...extras, ...poster];

  return pageMetadata({
    title: input.title,
    description: input.description,
    path: input.path,
    images: images.length ? images : undefined,
    ogType: input.hasReview ? "article" : "website",
    locale: input.locale,
    languages: input.languages,
  });
}
