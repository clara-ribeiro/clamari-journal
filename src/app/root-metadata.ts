import type { Metadata, Viewport } from "next";
import { copyFor } from "@/content/copy/for-locale";
import { allowSearchIndexing, getSiteUrl } from "@/lib/site-url";
import { ogLocale, type ReviewLocale } from "@/lib/review-locale";

export function rootMetadataFor(locale: ReviewLocale): Metadata {
  const site = copyFor(locale).site;
  return {
    metadataBase: getSiteUrl(),
    title: {
      default: site.metadata.titleDefault,
      template: site.metadata.titleTemplate,
    },
    description: site.metadata.description,
    applicationName: site.brand.fullName,
    authors: [{ name: site.metadata.author }],
    robots: allowSearchIndexing()
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: ogLocale(locale),
      siteName: site.brand.fullName,
      title: site.metadata.titleDefault,
      description: site.metadata.description,
      images: [
        {
          url: site.metadata.ogImage,
          alt: site.metadata.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: site.metadata.titleDefault,
      description: site.metadata.description,
      images: [site.metadata.ogImage],
    },
  };
}

export const rootMetadata = rootMetadataFor("en");

export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: copyFor("en").site.themeColor,
};
