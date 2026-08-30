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
    expect(metadata.alternates).toEqual({
      canonical: "/films",
      languages: {
        en: "/films",
        "pt-BR": "/pt/films",
        "x-default": "/films",
      },
    });
    expect(metadata.openGraph).toMatchObject({
      title: "Films",
      url: "/films",
      siteName: siteCopy.brand.fullName,
      type: "website",
      locale: "en_US",
      alternateLocale: ["pt_BR"],
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

  it("lists review stills ahead of the poster", () => {
    const metadata = detailPageMetadata({
      title: "Heat (1995) review",
      description: "A personal review of Heat (1995). Precision first.",
      path: "/films/heat",
      imageUrl: "https://image.tmdb.org/t/p/w500/heat.jpg",
      extraImages: [
        {
          url: "/images/reviews/films/heat/pacino-de-niro.png",
          alt: "Vincent Hanna and Neil McCauley face to face.",
        },
      ],
      hasReview: true,
    });

    expect(metadata.openGraph?.images).toEqual([
      {
        url: "/images/reviews/films/heat/pacino-de-niro.png",
        alt: "Vincent Hanna and Neil McCauley face to face.",
      },
      {
        url: "https://image.tmdb.org/t/p/w500/heat.jpg",
        alt: "Heat (1995) review",
      },
    ]);
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

  it("sets Portuguese OG locale and hreflang when both essays exist", () => {
    const metadata = detailPageMetadata({
      title: "Resenha de Gata em Telhado de Zinco Quente (1958)",
      description: "Uma resenha pessoal.",
      path: "/pt/films/cat-on-a-hot-tin-roof",
      imageUrl: null,
      hasReview: true,
      locale: "pt-BR",
      languages: {
        en: "/films/cat-on-a-hot-tin-roof",
        "pt-BR": "/pt/films/cat-on-a-hot-tin-roof",
        "x-default": "/films/cat-on-a-hot-tin-roof",
      },
    });

    expect(metadata.alternates).toEqual({
      canonical: "/pt/films/cat-on-a-hot-tin-roof",
      languages: {
        en: "/films/cat-on-a-hot-tin-roof",
        "pt-BR": "/pt/films/cat-on-a-hot-tin-roof",
        "x-default": "/films/cat-on-a-hot-tin-roof",
      },
    });
    expect(metadata.openGraph).toMatchObject({
      locale: "pt_BR",
      alternateLocale: ["en_US"],
      type: "article",
    });
  });
});
