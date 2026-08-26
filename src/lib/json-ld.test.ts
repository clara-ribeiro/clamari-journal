import { afterEach, describe, expect, it, vi } from "vitest";
import type { BookDetail, MovieDetail, SeriesDetail } from "@/application/dto";
import { siteCopy } from "@/content/copy";
import {
  buildBookJsonLd,
  buildMovieJsonLd,
  buildSeriesJsonLd,
  serializeJsonLd,
} from "./json-ld";

function movie(overrides: Partial<MovieDetail> = {}): MovieDetail {
  return {
    slug: "heat",
    title: "Heat",
    originalTitle: null,
    yearLabel: "1995",
    runtimeLabel: null,
    genres: ["Crime", "Drama"],
    synopsis: "A crime epic.",
    posterUrl: "https://image.tmdb.org/t/p/w500/heat.jpg",
    backdropUrl: null,
    directorsLabel: "Michael Mann",
    writersLabel: null,
    cast: [],
    countriesLabel: null,
    languagesLabel: null,
    trailer: null,
    metadataNotice: null,
    statusLabel: "Watched",
    rating: 5,
    favorite: false,
    favoriteLabel: "Favorite",
    tags: [],
    watchLocation: null,
    streamingService: null,
    viewingCount: 0,
    viewingCountLabel: "0",
    viewings: [],
    viewingsEmptyLabel: "None",
    reviewSlug: null,
    reviewHtml: null,
    reviewEmptyLabel: "No review",
    metaTitle: "Heat",
    metaDescription: "A crime epic.",
    ...overrides,
  };
}

function series(overrides: Partial<SeriesDetail> = {}): SeriesDetail {
  return {
    slug: "the-wire",
    title: "The Wire",
    originalTitle: null,
    yearLabel: "2002",
    genres: ["Drama"],
    synopsis: "Baltimore.",
    posterUrl: null,
    backdropUrl: null,
    creatorsLabel: "David Simon",
    writersLabel: null,
    cast: [],
    countriesLabel: null,
    languagesLabel: null,
    productionStatusLabel: null,
    trailer: null,
    metadataNotice: null,
    statusLabel: "Completed",
    favorite: false,
    favoriteLabel: "Favorite",
    startedLabel: null,
    finishedLabel: null,
    watchedEpisodesLabel: "1 / 2",
    watchedTimeLabel: null,
    progressLabel: "50%",
    progressPercent: 50,
    nextEpisodeLabel: null,
    seasons: [],
    seasonsEmptyLabel: "None",
    reviewSlug: null,
    reviewHtml: null,
    reviewEmptyLabel: "No review",
    metaTitle: "The Wire",
    metaDescription: "Baltimore.",
    ...overrides,
  };
}

function book(overrides: Partial<BookDetail> = {}): BookDetail {
  return {
    slug: "the-titans-curse",
    title: "The Titan's Curse",
    subtitle: "Book 3",
    authorsLabel: "Rick Riordan",
    yearLabel: "2007",
    categories: ["Fantasy"],
    synopsis: "Artemis goes missing.",
    heroExcerpt: null,
    coverUrl: "/images/books/cover.webp",
    publisherLabel: "Disney Hyperion",
    pageCountLabel: "320",
    languageLabel: "en",
    isbn10Label: "1423101456",
    isbn13Label: "9781423101451",
    metadataNotice: null,
    statusLabel: "Finished",
    favorite: false,
    favoriteLabel: "Favorite",
    formatLabel: null,
    tags: [],
    startedLabel: null,
    finishedLabel: null,
    currentPageLabel: null,
    progressLabel: null,
    progressPercent: null,
    quotes: [],
    quotesEmptyLabel: "None",
    history: [],
    historyEmptyLabel: "None",
    notes: [],
    notesEmptyLabel: "None",
    reviewSlug: null,
    reviewHtml: null,
    reviewEmptyLabel: "No review",
    metaTitle: "The Titan's Curse",
    metaDescription: "Artemis goes missing.",
    ...overrides,
  };
}

describe("serializeJsonLd", () => {
  it("escapes < so markup cannot break out of the script tag", () => {
    expect(serializeJsonLd({ name: "</script><p>x</p>" })).toContain("\\u003c");
    expect(serializeJsonLd({ name: "</script><p>x</p>" })).not.toContain("</");
  });
});

describe("buildMovieJsonLd", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("describes the film without claiming a review or aggregate rating", () => {
    const jsonLd = buildMovieJsonLd(movie());

    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("Movie");
    expect(jsonLd.name).toBe("Heat");
    expect(jsonLd.dateCreated).toBe("1995");
    expect(jsonLd.director).toEqual({ "@type": "Person", name: "Michael Mann" });
    expect(jsonLd).not.toHaveProperty("aggregateRating");
    expect(jsonLd).not.toHaveProperty("reviewRating");
  });

  it("wraps a published review without leaking spoilers", () => {
    const jsonLd = buildMovieJsonLd(
      movie({
        reviewSlug: "heat",
        reviewHtml:
          "<p>Precision first.</p><details class=\"review-spoiler\"><p>They almost make it.</p></details>",
        metaTitle: "Heat review",
        rating: 4,
      }),
    );

    expect(jsonLd["@type"]).toBe("Review");
    expect(jsonLd.name).toBe("Heat review");
    expect(jsonLd.author).toEqual({
      "@type": "Person",
      name: siteCopy.metadata.author,
    });
    expect(jsonLd.reviewBody).toBe("Precision first.");
    expect(jsonLd.reviewBody).not.toContain("almost make it");
    expect(jsonLd.reviewRating).toEqual({
      "@type": "Rating",
      ratingValue: 4,
      bestRating: 5,
      worstRating: 1,
    });
    expect((jsonLd.itemReviewed as JsonLdLike)["@type"]).toBe("Movie");
  });

  it("describes review stills and names the principal cast", () => {
    vi.stubEnv("SITE_URL", "https://clamari.com.br");
    const jsonLd = buildMovieJsonLd(
      movie({
        reviewHtml:
          '<figure><img src="/images/reviews/films/heat/pacino-de-niro.png" alt="Vincent Hanna and Neil McCauley face to face."><figcaption>Pacino and De Niro</figcaption></figure><p>Precision first.</p>',
        metaTitle: "Heat (1995) review",
        cast: [
          {
            id: 1,
            name: "Al Pacino",
            role: "Vincent Hanna",
            profileUrl: null,
          },
          {
            id: 2,
            name: "Robert De Niro",
            role: "Neil McCauley",
            profileUrl: null,
          },
        ],
      }),
    );

    expect((jsonLd.itemReviewed as JsonLdLike).actor).toEqual([
      { "@type": "Person", name: "Al Pacino" },
      { "@type": "Person", name: "Robert De Niro" },
    ]);
    expect(jsonLd.image).toEqual([
      {
        "@type": "ImageObject",
        contentUrl:
          "https://clamari.com.br/images/reviews/films/heat/pacino-de-niro.png",
        url: "https://clamari.com.br/images/reviews/films/heat/pacino-de-niro.png",
        name: "Pacino and De Niro",
        description: "Vincent Hanna and Neil McCauley face to face.",
        caption: "Pacino and De Niro",
      },
    ]);
  });

  it("omits reviewRating when the journal has no stars", () => {
    const jsonLd = buildMovieJsonLd(
      movie({
        rating: undefined,
        reviewHtml: "<p>Quietly devastating.</p>",
        metaTitle: "Heat review",
      }),
    );

    expect(jsonLd["@type"]).toBe("Review");
    expect(jsonLd).not.toHaveProperty("reviewRating");
  });

  it("lists multiple directors and skips a non-year label", () => {
    const jsonLd = buildMovieJsonLd(
      movie({
        directorsLabel: "Michael Mann, Art Linson",
        yearLabel: "nineties",
        originalTitle: "Heat",
      }),
    );

    expect(jsonLd.director).toEqual([
      { "@type": "Person", name: "Michael Mann" },
      { "@type": "Person", name: "Art Linson" },
    ]);
    expect(jsonLd).not.toHaveProperty("dateCreated");
    expect(jsonLd.alternateName).toBe("Heat");
  });
});

describe("buildSeriesJsonLd", () => {
  it("describes the series as a TVSeries", () => {
    const jsonLd = buildSeriesJsonLd(series());
    expect(jsonLd["@type"]).toBe("TVSeries");
    expect(jsonLd.creator).toEqual({
      "@type": "Person",
      name: "David Simon",
    });
  });

  it("wraps a published series review", () => {
    const jsonLd = buildSeriesJsonLd(
      series({
        reviewHtml: "<p>Still the standard.</p>",
        metaTitle: "The Wire review",
        rating: 5,
      }),
    );
    expect(jsonLd["@type"]).toBe("Review");
    expect((jsonLd.itemReviewed as JsonLdLike)["@type"]).toBe("TVSeries");
  });
});

describe("buildBookJsonLd", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses book-specific fields and an absolute cover URL", () => {
    vi.stubEnv("SITE_URL", "https://clamari.com.br");
    const jsonLd = buildBookJsonLd(book());

    expect(jsonLd["@type"]).toBe("Book");
    expect(jsonLd.datePublished).toBe("2007");
    expect(jsonLd.isbn).toBe("9781423101451");
    expect(jsonLd.numberOfPages).toBe(320);
    expect(jsonLd.inLanguage).toBe("en");
    expect(jsonLd.image).toBe(
      "https://clamari.com.br/images/books/cover.webp",
    );
    expect(jsonLd.author).toEqual({
      "@type": "Person",
      name: "Rick Riordan",
    });
  });

  it("falls back to ISBN-10 and skips non-ISO language / non-numeric pages", () => {
    const jsonLd = buildBookJsonLd(
      book({
        isbn13Label: null,
        languageLabel: "English",
        pageCountLabel: "about 320",
        coverUrl: "not-a-url",
      }),
    );

    expect(jsonLd.isbn).toBe("1423101456");
    expect(jsonLd).not.toHaveProperty("inLanguage");
    expect(jsonLd).not.toHaveProperty("numberOfPages");
    expect(jsonLd).not.toHaveProperty("image");
  });
});

type JsonLdLike = { "@type"?: string; actor?: unknown };
