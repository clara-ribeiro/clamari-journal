// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CatalogCardItem } from "@/application/dto";
import { filmsCopy } from "@/content/copy/films";
import { homeCopy } from "@/content/copy/home";
import { seriesCopy } from "@/content/copy/series";
import { booksCopy } from "@/content/copy/books";
import { allEntriesCopy } from "@/content/copy";

vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={props.src} alt={props.alt} />
  ),
  getImageProps: () => ({
    props: { src: "/x.webp", srcSet: "", sizes: "" },
  }),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => "/films",
  notFound: vi.fn(),
}));

vi.mock("react-dom", async () => {
  const actual = await vi.importActual<typeof import("react-dom")>("react-dom");
  return {
    ...actual,
    preload: vi.fn(),
  };
});

const sampleCard: CatalogCardItem = {
  medium: "movie",
  slug: "heat",
  title: "Heat",
  href: "/films/heat",
  posterUrl: null,
  favorite: false,
  hasReview: false,
  statusLabel: "Watched",
  statusTone: "positive",
  yearLabel: "1995",
  activityLabel: "No date logged",
  favoriteLabel: "Favorite",
  reviewLabel: "With review",
  metaTags: [],
  statusKey: "watched",
  sortTitle: "heat",
  sortDate: "2024-01-01",
  sortRating: 5,
  sortYear: 1995,
  goalYears: [2024],
  watchedEpisodeCount: 0,
};

vi.mock("@/application/use-cases/entries", () => ({
  getHomeFeeds: () => ({
    recentEntries: [],
    reviewEntries: [],
    favoriteEntries: [],
  }),
}));

vi.mock("@/application/use-cases/stats", () => ({
  getLifetimeStats: () => ({
    pagesRead: 0,
    watchedHours: 0,
  }),
}));

vi.mock("@/application/use-cases/movies", async () => {
  const actual = await vi.importActual<
    typeof import("@/application/use-cases/movies")
  >("@/application/use-cases/movies");
  return {
    ...actual,
    listMovieCatalogItems: () => [sampleCard],
    getMovieDetail: vi.fn(),
    listMovies: () => [{ slug: "heat" }],
  };
});

vi.mock("@/application/use-cases/series", async () => {
  const actual = await vi.importActual<
    typeof import("@/application/use-cases/series")
  >("@/application/use-cases/series");
  return {
    ...actual,
    listSeriesCatalogItems: () => [
      { ...sampleCard, medium: "series", href: "/series/heat", slug: "heat" },
    ],
    getSeriesDetail: vi.fn(),
    listSeries: () => [{ slug: "heat" }],
  };
});

vi.mock("@/application/use-cases/books", async () => {
  const actual = await vi.importActual<
    typeof import("@/application/use-cases/books")
  >("@/application/use-cases/books");
  return {
    ...actual,
    listBookCatalogItems: () => [
      { ...sampleCard, medium: "book", href: "/books/heat", slug: "heat" },
    ],
    getBookDetail: vi.fn(),
    listBooks: () => [{ slug: "heat" }],
  };
});

vi.mock("@/application/use-cases/mixed-catalog", () => ({
  listMixedCatalogItems: () => [sampleCard],
  listFavoriteCatalogItems: () => [sampleCard],
  listReviewCatalogItems: () => [sampleCard],
}));

describe("route smoke", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("renders Home", async () => {
    const { default: HomePage } = await import("@/app/(en)/page");
    render(<HomePage />);
    expect(screen.getByText(homeCopy.hero.title)).toBeInTheDocument();
  }, 15_000);

  it("renders Films catalog", async () => {
    const { default: FilmsPage } = await import("@/app/(en)/films/page");
    render(
      await FilmsPage({
        searchParams: Promise.resolve({}),
      }),
    );
    expect(
      screen.getAllByText(filmsCopy.list.title).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("Heat")).toBeInTheDocument();
  });

  it("renders Series catalog", async () => {
    const { default: SeriesPage } = await import("@/app/(en)/series/page");
    render(
      await SeriesPage({
        searchParams: Promise.resolve({}),
      }),
    );
    expect(
      screen.getAllByText(seriesCopy.list.title).length,
    ).toBeGreaterThan(0);
  });

  it("renders Books catalog", async () => {
    const { default: BooksPage } = await import("@/app/(en)/books/page");
    render(
      await BooksPage({
        searchParams: Promise.resolve({}),
      }),
    );
    expect(
      screen.getAllByText(booksCopy.list.title).length,
    ).toBeGreaterThan(0);
  });

  it("renders All entries", async () => {
    const { default: AllEntriesPage } = await import("@/app/(en)/all-entries/page");
    render(
      await AllEntriesPage({
        searchParams: Promise.resolve({}),
      }),
    );
    expect(screen.getByText(allEntriesCopy.title)).toBeInTheDocument();
  });
});

describe("detail route slugs", () => {
  it("calls notFound for an invalid film slug", async () => {
    const { notFound } = await import("next/navigation");
    const { getMovieDetail } = await import("@/application/use-cases/movies");
    vi.mocked(getMovieDetail).mockResolvedValueOnce(undefined);

    const { default: FilmDetailPage } = await import(
      "@/app/(en)/films/[slug]/page"
    );
    await FilmDetailPage({
      params: Promise.resolve({ slug: "missing-film" }),
    });
    expect(notFound).toHaveBeenCalled();
  });

  it("renders a valid film detail page", async () => {
    const { getMovieDetail } = await import("@/application/use-cases/movies");
    vi.mocked(getMovieDetail).mockResolvedValueOnce({
      slug: "heat",
      title: "Heat",
      originalTitle: null,
      yearLabel: "1995",
      runtimeLabel: null,
      genres: [],
      synopsis: null,
      posterUrl: null,
      backdropUrl: null,
      directorsLabel: null,
      writersLabel: null,
      cast: [],
      countriesLabel: null,
      languagesLabel: null,
      trailer: null,
      metadataNotice: null,
      statusLabel: "Watched",
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
      reviewLocale: "en",
      reviewHeading: "Review",
      alternateReviewHref: null,
      alternateReviewLabel: null,
      metaTitle: "Heat",
      metaDescription: "Heat",
    });

    const { default: FilmDetailPage } = await import(
      "@/app/(en)/films/[slug]/page"
    );
    render(
      await FilmDetailPage({
        params: Promise.resolve({ slug: "heat" }),
      }),
    );
    expect(
      screen.getAllByRole("heading", { name: "Heat" }).length,
    ).toBeGreaterThan(0);
    const jsonLd = document.querySelector('script[type="application/ld+json"]');
    expect(jsonLd).toBeTruthy();
    expect(jsonLd?.textContent).toContain('"Movie"');
    expect(jsonLd?.textContent).toContain("Heat");
  });

  it("calls notFound for invalid series and book slugs", async () => {
    const { notFound } = await import("next/navigation");
    const { getSeriesDetail } = await import("@/application/use-cases/series");
    const { getBookDetail } = await import("@/application/use-cases/books");
    vi.mocked(getSeriesDetail).mockResolvedValueOnce(undefined);
    vi.mocked(getBookDetail).mockResolvedValueOnce(undefined);

    const { default: SeriesDetailPage } = await import(
      "@/app/(en)/series/[slug]/page"
    );
    const { default: BookDetailPage } = await import(
      "@/app/(en)/books/[slug]/page"
    );

    await SeriesDetailPage({
      params: Promise.resolve({ slug: "missing-series" }),
    });
    await BookDetailPage({
      params: Promise.resolve({ slug: "missing-book" }),
    });
    expect(notFound).toHaveBeenCalled();
  });

  it("calls notFound for a Portuguese film page without a review", async () => {
    const { notFound } = await import("next/navigation");
    const { getMovieDetail } = await import("@/application/use-cases/movies");
    vi.mocked(getMovieDetail).mockResolvedValueOnce(undefined);

    const { default: PortugueseFilmDetailPage } = await import(
      "@/app/(pt)/pt/films/[slug]/page"
    );
    await PortugueseFilmDetailPage({
      params: Promise.resolve({ slug: "missing-film" }),
    });
    expect(notFound).toHaveBeenCalled();
  });
});
