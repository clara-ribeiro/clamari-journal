import type { Metadata } from "next";
import { siteCopy } from "@/content/copy";
import { allowSearchIndexing } from "@/lib/site-url";
import {
  DEFAULT_REVIEW_LOCALE,
  ogAlternateLocale,
  ogLocale,
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

function defaultImages(title: string) {
  return [
    {
      url: siteCopy.metadata.ogImage,
      alt: siteCopy.metadata.ogImageAlt || title,
    },
  ];
}

/** Shared title, description, canonical, Open Graph, and Twitter tags. */
export function pageMetadata(input: PageMetadataInput): Metadata {
  const index = input.index ?? allowSearchIndexing();
  const images = (
    input.images?.length ? [...input.images] : defaultImages(input.title)
  ).map((image) => ({
    url: image.url,
    alt: image.alt ?? input.title,
  }));
  const locale = input.locale ?? DEFAULT_REVIEW_LOCALE;
  const hasLanguages = Boolean(
    input.languages && Object.keys(input.languages).length > 0,
  );

  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: {
      canonical: input.path,
      ...(hasLanguages ? { languages: input.languages } : {}),
    },
    robots: { index, follow: index },
    openGraph: {
      title: input.title,
      description: input.description,
      url: input.path,
      siteName: siteCopy.brand.fullName,
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
