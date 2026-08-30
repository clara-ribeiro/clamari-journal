import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { preload } from "react-dom";
import { getHomeFeeds } from "@/application/use-cases/entries";
import { listBookCatalogItems, getBookDetail, listBooks } from "@/application/use-cases/books";
import {
  getMovieDetail,
  listMovieCatalogItems,
  listMovies,
} from "@/application/use-cases/movies";
import {
  listFavoriteCatalogItems,
  listMixedCatalogItems,
  listReviewCatalogItems,
} from "@/application/use-cases/mixed-catalog";
import {
  getSeriesDetail,
  listSeries,
  listSeriesCatalogItems,
} from "@/application/use-cases/series";
import { getLifetimeStats, getStatsPageData } from "@/application/use-cases/stats";
import JsonLdScript from "@/components/atoms/JsonLdScript";
import AllEntriesTemplate from "@/components/templates/AllEntriesTemplate";
import BookDetailTemplate from "@/components/templates/BookDetailTemplate";
import FilmDetailTemplate from "@/components/templates/FilmDetailTemplate";
import HomeTemplate from "@/components/templates/HomeTemplate";
import MediumCatalogTemplate from "@/components/templates/MediumCatalogTemplate";
import SeriesDetailTemplate from "@/components/templates/SeriesDetailTemplate";
import StatsTemplate from "@/components/templates/StatsTemplate";
import { copyFor } from "@/content/copy/for-locale";
import { parseCatalogSearchParams } from "@/lib/catalog-search-params";
import {
  buildBookJsonLd,
  buildMovieJsonLd,
  buildSeriesJsonLd,
  buildWebPageJsonLd,
  buildWebsiteJsonLd,
} from "@/lib/json-ld";
import { localePageMetadata } from "@/lib/page-metadata";
import {
  missingDetailMetadata,
  reviewDetailMetadata,
} from "@/lib/review-detail-metadata";
import type { ReviewLocale } from "@/lib/review-locale";

const HOME_FEED_LIMIT = 5;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export function homeMetadata(locale: ReviewLocale): Metadata {
  const site = copyFor(locale).site;
  return localePageMetadata({
    title: site.metadata.titleDefault,
    description: site.metadata.description,
    path: "/",
    locale,
    absoluteTitle: true,
  });
}

export function HomeScreen({ locale }: { locale: ReviewLocale }) {
  const home = copyFor(locale).home;
  preload(home.hero.lettering.mobile, {
    as: "image",
    type: "image/webp",
    fetchPriority: "high",
    media: "(max-width: 767px)",
  });
  preload(home.hero.lettering.desktop, {
    as: "image",
    type: "image/webp",
    fetchPriority: "high",
    media: "(min-width: 768px)",
  });

  const { recentEntries, reviewEntries, favoriteEntries } = getHomeFeeds(
    HOME_FEED_LIMIT,
    locale,
  );
  const lifetimeStats = getLifetimeStats();

  return (
    <>
      <JsonLdScript data={buildWebsiteJsonLd(locale)} />
      <main id="main-content" tabIndex={-1}>
        <HomeTemplate
          recentEntries={recentEntries}
          reviewEntries={reviewEntries}
          favoriteEntries={favoriteEntries}
          pagesRead={lifetimeStats.pagesRead}
          watchedHours={lifetimeStats.watchedHours}
        />
      </main>
    </>
  );
}

export function filmsCatalogMetadata(locale: ReviewLocale): Metadata {
  const copy = copyFor(locale).films.list;
  return localePageMetadata({
    title: copy.title,
    description: copy.description,
    path: "/films",
    locale,
  });
}

export async function FilmsCatalogScreen({
  locale,
  searchParams,
}: {
  locale: ReviewLocale;
  searchParams: SearchParams;
}) {
  const copy = copyFor(locale);
  const initialFilters = parseCatalogSearchParams(await searchParams);

  return (
    <>
      <JsonLdScript
        data={buildWebPageJsonLd({
          type: "CollectionPage",
          name: copy.films.list.title,
          description: copy.films.list.description,
          path: "/films",
          locale,
        })}
      />
      <MediumCatalogTemplate
        medium="films"
        copy={copy.films.list}
        items={listMovieCatalogItems(locale)}
        initialStatus={initialFilters.status}
        initialYear={initialFilters.year}
      />
    </>
  );
}

export function seriesCatalogMetadata(locale: ReviewLocale): Metadata {
  const copy = copyFor(locale).series.list;
  return localePageMetadata({
    title: copy.title,
    description: copy.description,
    path: "/series",
    locale,
  });
}

export async function SeriesCatalogScreen({
  locale,
  searchParams,
}: {
  locale: ReviewLocale;
  searchParams: SearchParams;
}) {
  const copy = copyFor(locale);
  const initialFilters = parseCatalogSearchParams(await searchParams);

  return (
    <>
      <JsonLdScript
        data={buildWebPageJsonLd({
          type: "CollectionPage",
          name: copy.series.list.title,
          description: copy.series.list.description,
          path: "/series",
          locale,
        })}
      />
      <MediumCatalogTemplate
        medium="series"
        copy={copy.series.list}
        items={listSeriesCatalogItems(locale)}
        initialStatus={initialFilters.status}
        initialYear={initialFilters.year}
      />
    </>
  );
}

export function booksCatalogMetadata(locale: ReviewLocale): Metadata {
  const copy = copyFor(locale).books.list;
  return localePageMetadata({
    title: copy.title,
    description: copy.description,
    path: "/books",
    locale,
  });
}

export async function BooksCatalogScreen({
  locale,
  searchParams,
}: {
  locale: ReviewLocale;
  searchParams: SearchParams;
}) {
  const copy = copyFor(locale);
  const initialFilters = parseCatalogSearchParams(await searchParams);

  return (
    <>
      <JsonLdScript
        data={buildWebPageJsonLd({
          type: "CollectionPage",
          name: copy.books.list.title,
          description: copy.books.list.description,
          path: "/books",
          locale,
        })}
      />
      <MediumCatalogTemplate
        medium="books"
        copy={copy.books.list}
        items={listBookCatalogItems(locale)}
        initialStatus={initialFilters.status}
        initialYear={initialFilters.year}
      />
    </>
  );
}

export function statsPageMetadata(locale: ReviewLocale): Metadata {
  const copy = copyFor(locale).stats;
  return localePageMetadata({
    title: copy.title,
    description: copy.description,
    path: "/stats",
    locale,
  });
}

export function StatsScreen({ locale }: { locale: ReviewLocale }) {
  const copy = copyFor(locale).stats;
  preload("/images/stats/ballerina-480.webp", {
    as: "image",
    type: "image/webp",
    fetchPriority: "high",
    imageSrcSet:
      "/images/stats/ballerina-480.webp 480w, /images/stats/ballerina-720.webp 720w, /images/stats/ballerina-1080.webp 1080w, /images/stats/ballerina-1600.webp 1600w",
    imageSizes: "(max-width: 1023px) 60vw, min(60vw, 48rem)",
  });

  const { metrics, goals } = getStatsPageData(locale);
  return (
    <>
      <JsonLdScript
        data={buildWebPageJsonLd({
          name: copy.title,
          description: copy.description,
          path: "/stats",
          locale,
        })}
      />
      <main
        id="main-content"
        tabIndex={-1}
        aria-labelledby={copy.hero.titleId}
      >
        <StatsTemplate metrics={metrics} goals={goals} />
      </main>
    </>
  );
}

export function allEntriesMetadata(locale: ReviewLocale): Metadata {
  const copy = copyFor(locale).allEntries;
  return localePageMetadata({
    title: copy.title,
    description: copy.description,
    path: "/all-entries",
    locale,
  });
}

export async function AllEntriesScreen({
  locale,
  searchParams,
}: {
  locale: ReviewLocale;
  searchParams: SearchParams;
}) {
  const copy = copyFor(locale).allEntries;
  const initialFilters = parseCatalogSearchParams(await searchParams);

  return (
    <>
      <JsonLdScript
        data={buildWebPageJsonLd({
          type: "CollectionPage",
          name: copy.title,
          description: copy.description,
          path: "/all-entries",
          locale,
        })}
      />
      <AllEntriesTemplate
        items={listMixedCatalogItems(locale)}
        copy={copy}
        initialStatus={initialFilters.status}
        initialYear={initialFilters.year}
      />
    </>
  );
}

export function favoritesMetadata(locale: ReviewLocale): Metadata {
  const copy = copyFor(locale).favorites;
  return localePageMetadata({
    title: copy.title,
    description: copy.description,
    path: "/favorites",
    locale,
  });
}

export async function FavoritesScreen({
  locale,
  searchParams,
}: {
  locale: ReviewLocale;
  searchParams: SearchParams;
}) {
  const copy = copyFor(locale).favorites;
  const initialFilters = parseCatalogSearchParams(await searchParams);

  return (
    <>
      <JsonLdScript
        data={buildWebPageJsonLd({
          type: "CollectionPage",
          name: copy.title,
          description: copy.description,
          path: "/favorites",
          locale,
        })}
      />
      <AllEntriesTemplate
        items={listFavoriteCatalogItems(locale)}
        copy={copy}
        initialStatus={initialFilters.status}
        initialYear={initialFilters.year}
        showFavoriteFilter={false}
      />
    </>
  );
}

export function reviewsMetadata(locale: ReviewLocale): Metadata {
  const copy = copyFor(locale).reviews;
  return localePageMetadata({
    title: copy.title,
    description: copy.description,
    path: "/reviews",
    locale,
  });
}

export async function ReviewsScreen({
  locale,
  searchParams,
}: {
  locale: ReviewLocale;
  searchParams: SearchParams;
}) {
  const copy = copyFor(locale).reviews;
  const initialFilters = parseCatalogSearchParams(await searchParams);

  return (
    <>
      <JsonLdScript
        data={buildWebPageJsonLd({
          type: "CollectionPage",
          name: copy.title,
          description: copy.description,
          path: "/reviews",
          locale,
        })}
      />
      <AllEntriesTemplate
        items={listReviewCatalogItems(locale)}
        copy={copy}
        initialStatus={initialFilters.status}
        initialYear={initialFilters.year}
        showReviewFilter={false}
      />
    </>
  );
}

export function generateFilmParams() {
  return listMovies().map((movie) => ({ slug: movie.slug }));
}

export function generateSeriesParams() {
  return listSeries().map((entry) => ({ slug: entry.slug }));
}

export function generateBookParams() {
  return listBooks().map((entry) => ({ slug: entry.slug }));
}

export async function filmDetailMetadata(
  slug: string,
  locale: ReviewLocale,
): Promise<Metadata> {
  const detail = await getMovieDetail(slug, locale);
  if (!detail) return missingDetailMetadata("films", slug, locale);
  return reviewDetailMetadata("films", {
    slug: detail.slug,
    metaTitle: detail.metaTitle,
    metaDescription: detail.metaDescription,
    imageUrl: detail.posterUrl ?? detail.backdropUrl,
    reviewHtml: detail.reviewHtml,
    reviewLocale: detail.reviewLocale,
    alternateReviewHref: detail.alternateReviewHref,
  });
}

export async function FilmDetailScreen({
  slug,
  locale,
}: {
  slug: string;
  locale: ReviewLocale;
}) {
  const detail = await getMovieDetail(slug, locale);
  if (!detail) {
    notFound();
    return null;
  }

  return (
    <>
      <JsonLdScript data={buildMovieJsonLd(detail)} />
      <FilmDetailTemplate detail={detail} />
    </>
  );
}

export async function seriesDetailMetadata(
  slug: string,
  locale: ReviewLocale,
): Promise<Metadata> {
  const detail = await getSeriesDetail(slug, locale);
  if (!detail) return missingDetailMetadata("series", slug, locale);
  return reviewDetailMetadata("series", {
    slug: detail.slug,
    metaTitle: detail.metaTitle,
    metaDescription: detail.metaDescription,
    imageUrl: detail.posterUrl ?? detail.backdropUrl,
    reviewHtml: detail.reviewHtml,
    reviewLocale: detail.reviewLocale,
    alternateReviewHref: detail.alternateReviewHref,
  });
}

export async function SeriesDetailScreen({
  slug,
  locale,
}: {
  slug: string;
  locale: ReviewLocale;
}) {
  const detail = await getSeriesDetail(slug, locale);
  if (!detail) {
    notFound();
    return null;
  }

  return (
    <>
      <JsonLdScript data={buildSeriesJsonLd(detail)} />
      <SeriesDetailTemplate detail={detail} />
    </>
  );
}

export async function bookDetailMetadata(
  slug: string,
  locale: ReviewLocale,
): Promise<Metadata> {
  const detail = await getBookDetail(slug, locale);
  if (!detail) return missingDetailMetadata("books", slug, locale);
  return reviewDetailMetadata("books", {
    slug: detail.slug,
    metaTitle: detail.metaTitle,
    metaDescription: detail.metaDescription,
    imageUrl: detail.coverUrl,
    reviewHtml: detail.reviewHtml,
    reviewLocale: detail.reviewLocale,
    alternateReviewHref: detail.alternateReviewHref,
  });
}

export async function BookDetailScreen({
  slug,
  locale,
}: {
  slug: string;
  locale: ReviewLocale;
}) {
  const detail = await getBookDetail(slug, locale);
  if (!detail) {
    notFound();
    return null;
  }

  return (
    <>
      <JsonLdScript data={buildBookJsonLd(detail)} />
      <BookDetailTemplate detail={detail} />
    </>
  );
}
