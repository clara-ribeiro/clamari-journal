import { describe, expect, it } from "vitest";
import { siteCopy } from "@/content/copy";
import { detailPageMetadata, pageMetadata } from "./page-metadata";

describe("pageMetadata", () => {
  it("sets canonical, Open Graph, and Twitter defaults", () => {
    const metadata = pageMetadata({
      title: "Films",
      description: "Logged films.",
      path: "/films",
    });

    expect(metadata.title).toBe("Films");
    expect(metadata.description).toBe("Logged films.");
    expect(metadata.alternates).toEqual({ canonical: "/films" });
    expect(metadata.openGraph).toMatchObject({
      title: "Films",
      url: "/films",
      siteName: siteCopy.brand.fullName,
      type: "website",
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Films",
    });
    expect(metadata.openGraph?.images).toEqual([
      {
        url: siteCopy.metadata.ogImage,
        alt: siteCopy.metadata.ogImageAlt,
      },
    ]);
  });

  it("uses an absolute title on the home route", () => {
    const metadata = pageMetadata({
      title: siteCopy.metadata.titleDefault,
      description: siteCopy.metadata.description,
      path: "/",
      absoluteTitle: true,
    });

    expect(metadata.title).toEqual({
      absolute: siteCopy.metadata.titleDefault,
    });
  });

  it("can opt a path out of indexing", () => {
    const metadata = pageMetadata({
      title: "Missing",
      description: "Gone",
      path: "/404",
      index: false,
    });

    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});

describe("detailPageMetadata", () => {
  it("prefers a poster or cover image when present", () => {
    const metadata = detailPageMetadata({
      title: "Heat",
      description: "A crime epic.",
      path: "/films/heat",
      imageUrl: "https://image.tmdb.org/t/p/w500/heat.jpg",
    });

    expect(metadata.openGraph).toMatchObject({
      images: [
        {
          url: "https://image.tmdb.org/t/p/w500/heat.jpg",
          alt: "Heat",
        },
      ],
      type: "website",
    });
    expect(metadata.twitter?.images).toEqual([
      "https://image.tmdb.org/t/p/w500/heat.jpg",
    ]);
  });

  it("uses Open Graph article when a review is published", () => {
    const metadata = detailPageMetadata({
      title: "Heat review",
      description: "Precision first.",
      path: "/films/heat",
      imageUrl: "https://image.tmdb.org/t/p/w500/heat.jpg",
      hasReview: true,
    });

    expect(metadata.openGraph).toMatchObject({ type: "article" });
  });

  it("falls back to the site OG image when no poster exists", () => {
    const metadata = detailPageMetadata({
      title: "Local Title",
      description: "Personal journal entry.",
      path: "/films/local-title",
      imageUrl: null,
    });

    expect(metadata.openGraph?.images).toEqual([
      {
        url: siteCopy.metadata.ogImage,
        alt: siteCopy.metadata.ogImageAlt,
      },
    ]);
  });
});
