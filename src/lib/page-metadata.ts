import type { Metadata } from "next";
import { siteCopy } from "@/content/copy";
import { allowSearchIndexing } from "@/lib/site-url";

export type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  images?: readonly { url: string; alt?: string }[];
  /** When true, skip the root title template (home). */
  absoluteTitle?: boolean;
  index?: boolean;
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

  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: input.path },
    robots: { index, follow: index },
    openGraph: {
      title: input.title,
      description: input.description,
      url: input.path,
      siteName: siteCopy.brand.fullName,
      locale: "en_US",
      type: "website",
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
}): Metadata {
  return pageMetadata({
    title: input.title,
    description: input.description,
    path: input.path,
    images: input.imageUrl
      ? [{ url: input.imageUrl, alt: input.title }]
      : undefined,
  });
}
