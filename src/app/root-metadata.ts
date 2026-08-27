import type { Metadata, Viewport } from "next";
import { siteCopy } from "@/content/copy";
import { allowSearchIndexing, getSiteUrl } from "@/lib/site-url";

export const rootMetadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: siteCopy.metadata.titleDefault,
    template: siteCopy.metadata.titleTemplate,
  },
  description: siteCopy.metadata.description,
  applicationName: siteCopy.brand.fullName,
  authors: [{ name: siteCopy.metadata.author }],
  robots: allowSearchIndexing()
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteCopy.brand.fullName,
    title: siteCopy.metadata.titleDefault,
    description: siteCopy.metadata.description,
    images: [
      {
        url: siteCopy.metadata.ogImage,
        alt: siteCopy.metadata.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteCopy.metadata.titleDefault,
    description: siteCopy.metadata.description,
    images: [siteCopy.metadata.ogImage],
  },
};

export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteCopy.themeColor,
};
