import { describe, expect, it } from "vitest";
import type { MovieEntry } from "@/domain/entities";
import type { TmdbMovieMetadata } from "@/application/dto/tmdb-metadata";
import {
  buildMovieViewings,
  computeMovieStats,
  listMovieCatalogItems,
  mapMovieDetail,
} from "@/application/use-cases/movies";
import { catalogCopy } from "@/content/copy/catalog";
import { filmsCopy } from "@/content/copy/films";
import { reviewContentCopy } from "@/content/copy/review-content";

const baseMovie: MovieEntry = {
  slug: "fight-club",
  title: "Fight Club",
  status: "watched",
  tmdbId: 550,
  posterPath: "/poster.jpg",
  rating: 4,
  favorite: true,
  watchedDates: ["2024-06-01", "2020-01-15"],
  tags: ["mind-bender"],
  watchLocation: "Home",
  streamingService: "Criterion Channel",
  reviewSlug: "fight-club",
  releaseDate: "1999-10-15",
  runtimeMinutes: 139,
};

const baseMetadata: TmdbMovieMetadata = {
  id: 550,
  title: "Fight Club",
  originalTitle: "Fight Club",
  overview: "An insomniac office worker and a soap maker form an underground fight club.",
  releaseDate: "1999-10-15",
  year: 1999,
  runtimeMinutes: 139,
  genres: [
    { id: 18, name: "Drama" },
    { id: 53, name: "Thriller" },
  ],
  countries: ["United States of America"],
  languages: ["English"],
  originalLanguage: "en",
  posterUrl: "https://image.tmdb.org/t/p/w500/poster.jpg",
  backdropUrl: "https://image.tmdb.org/t/p/w780/backdrop.jpg",
  directors: [{ id: 1, name: "David Fincher", role: "Director", profileUrl: null }],
  writers: [
    { id: 2, name: "Chuck Palahniuk", role: "Novel", profileUrl: null },
    { id: 3, name: "Jim Uhls", role: "Screenplay", profileUrl: null },
  ],
  cast: [
    {
      id: 10,
      name: "Edward Norton",
      role: "Narrator",
      profileUrl: "https://image.tmdb.org/t/p/w185/norton.jpg",
    },
  ],
  trailer: {
    key: "abc",
    name: "Official Trailer",
    site: "YouTube",
    official: true,
    url: "https://www.youtube.com/watch?v=abc",
  },
};

describe("computeMovieStats", () => {
  it("aggregates watched, watchlist, favorites, reviews, and runtime", () => {
    const stats = computeMovieStats([
      {
        slug: "a",
        title: "A",
        status: "watched",
        rating: 4,
        favorite: true,
        reviewSlug: "a",
        runtimeMinutes: 100,
      },
      {
        slug: "b",
        title: "B",
        status: "rewatch",
        rating: 5,
        runtimeMinutes: 120,
      },
      {
        slug: "c",
        title: "C",
        status: "watchlist",
        favorite: true,
      },
      {
        slug: "d",
        title: "D",
        status: "watched",
      },
    ]);

    expect(stats).toEqual({
      total: 4,
      watched: 3,
      watchlist: 1,
      favorites: 2,
      withReview: 1,
      averageRating: 4.5,
      totalRuntimeMinutes: 220,
    });
  });

  it("returns null average when no ratings exist", () => {
    expect(
      computeMovieStats([
        { slug: "a", title: "A", status: "watchlist" },
      ]).averageRating,
    ).toBeNull();
  });
});

describe("listMovieCatalogItems", () => {
  it("maps live catalog entries into sorted cards with goal years", () => {
    const items = listMovieCatalogItems();
    expect(items.length).toBeGreaterThan(0);
    expect(items).toEqual(
      [...items].sort((a, b) => a.sortTitle.localeCompare(b.sortTitle)),
    );

    const sample = items.find((item) => item.slug === "10-things-i-hate-about-you");
    expect(sample).toMatchObject({
      medium: "movie",
      href: "/films/10-things-i-hate-about-you",
      statusLabel: catalogCopy.status.films.watched,
      statusTone: "positive",
    });
    expect(sample?.goalYears.length).toBeGreaterThan(0);
    expect(sample?.posterUrl).toContain("image.tmdb.org");
  });
});

describe("buildMovieViewings", () => {
  it("sorts chronologically and labels first viewing vs rewatches", () => {
    expect(buildMovieViewings(["2024-06-01", "2020-01-15"])).toEqual([
      {
        dateLabel: "January 15, 2020",
        kindLabel: filmsCopy.detail.viewings.first,
      },
      {
        dateLabel: "June 1, 2024",
        kindLabel: filmsCopy.detail.viewings.rewatch,
      },
    ]);
  });

  it("returns an empty list when no dates are recorded", () => {
    expect(buildMovieViewings(undefined)).toEqual([]);
    expect(buildMovieViewings([])).toEqual([]);
  });
});

describe("mapMovieDetail", () => {
  it("merges TMDB metadata with personal journal fields", () => {
    const detail = mapMovieDetail(baseMovie, baseMetadata, null);

    expect(detail.title).toBe("Fight Club");
    expect(detail.originalTitle).toBeNull();
    expect(detail.yearLabel).toBe("1999");
    expect(detail.runtimeLabel).toBe("2h 19m");
    expect(detail.genres).toEqual(["Drama", "Thriller"]);
    expect(detail.directorsLabel).toBe("David Fincher");
    expect(detail.writersLabel).toBe("Chuck Palahniuk, Jim Uhls");
    expect(detail.cast).toHaveLength(1);
    expect(detail.trailer?.url).toContain("youtube.com");
    expect(detail.favorite).toBe(true);
    expect(detail.tags).toEqual(["mind-bender"]);
    expect(detail.watchLocation).toBe("Home");
    expect(detail.streamingService).toBe("Criterion Channel");
    expect(detail.viewingCount).toBe(2);
    expect(detail.viewingCountLabel).toBe("2 viewings");
    expect(detail.viewings[0]?.kindLabel).toBe(
      filmsCopy.detail.viewings.first,
    );
    expect(detail.reviewSlug).toBe("fight-club");
    expect(detail.reviewHtml).toBeNull();
    expect(detail.reviewEmptyLabel).toBe(filmsCopy.detail.review.pending);
    expect(detail.metadataNotice).toBeNull();
    expect(detail.metaTitle).toBe("Fight Club");
    expect(detail.metaDescription.length).toBeGreaterThan(0);
    expect(detail.metaDescription).toContain("insomniac");
  });

  it("falls back to local fields and surfaces a metadata notice", () => {
    const movie: MovieEntry = {
      slug: "local-only",
      title: "Local Title",
      status: "watchlist",
      posterPath: "/local.jpg",
      releaseDate: "2021-03-04",
    };

    const detail = mapMovieDetail(
      movie,
      null,
      filmsCopy.detail.metadata.unresolved,
    );

    expect(detail.title).toBe("Local Title");
    expect(detail.yearLabel).toBe("2021");
    expect(detail.posterUrl).toContain("/local.jpg");
    expect(detail.backdropUrl).toBeNull();
    expect(detail.synopsis).toBeNull();
    expect(detail.cast).toEqual([]);
    expect(detail.metadataNotice).toBe(filmsCopy.detail.metadata.unresolved);
    expect(detail.reviewEmptyLabel).toBe(filmsCopy.detail.review.empty);
    expect(detail.reviewHtml).toBeNull();
    expect(detail.viewingCountLabel).toBe(
      filmsCopy.detail.viewings.countNone,
    );
  });

  it("attaches compiled review html when provided", () => {
    const detail = mapMovieDetail(
      baseMovie,
      baseMetadata,
      null,
      "<p>A quiet masterpiece.</p>",
    );

    expect(detail.reviewHtml).toBe("<p>A quiet masterpiece.</p>");
    expect(detail.reviewEmptyLabel).toBe(filmsCopy.detail.review.pending);
    expect(detail.metaTitle).toBe(
      reviewContentCopy.seo.titleWithReview.replace("{title}", "Fight Club"),
    );
    expect(detail.metaDescription).toBe("A quiet masterpiece.");
  });

  it("keeps original title when it differs from the localized title", () => {
    const detail = mapMovieDetail(
      baseMovie,
      { ...baseMetadata, title: "Clube da Luta", originalTitle: "Fight Club" },
      null,
    );

    expect(detail.title).toBe("Clube da Luta");
    expect(detail.originalTitle).toBe("Fight Club");
  });

  it("labels a single viewing and omits empty credit lists", () => {
    const detail = mapMovieDetail(
      { ...baseMovie, watchedDates: ["2024-06-01"] },
      { ...baseMetadata, directors: [], writers: [], countries: [] },
      null,
    );

    expect(detail.viewingCount).toBe(1);
    expect(detail.viewingCountLabel).toBe(filmsCopy.detail.viewings.countOne);
    expect(detail.directorsLabel).toBeNull();
    expect(detail.writersLabel).toBeNull();
    expect(detail.countriesLabel).toBeNull();
  });
});
