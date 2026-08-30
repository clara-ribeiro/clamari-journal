import { cache } from "react";
import { movieRepository } from "@/composition/repositories";
import type {
  CatalogCardItem,
  MovieCastMember,
  MovieDetail,
  MovieViewingRecord,
} from "@/application/dto";
import type { TmdbMovieMetadata } from "@/application/dto/tmdb-metadata";
import type { MovieEntry } from "@/domain/entities";
import { copyFor } from "@/content/copy/for-locale";
import { getMovieById, TmdbError } from "@/infrastructure/tmdb/client";
import { formatDate } from "@/lib/formatters/formatDate";
import { formatShortRuntime } from "@/lib/formatters/formatDuration";
import { buildDetailMeta } from "@/lib/detail-meta";
import {
  DEFAULT_REVIEW_LOCALE,
  intlLocale,
  tmdbLanguageForLocale,
  type ReviewLocale,
} from "@/lib/review-locale";
import { tmdbImageUrl } from "@/lib/tmdb-image";
import {
  catalogCopyFor,
  catalogHasReview,
  catalogHref,
  localizedWorkTitle,
} from "./catalog-locale";
import { yearsMovieCountsToward } from "./goal-years";
import { defaultDetailLocale, resolveDetailLocale } from "./review-locale";

export function listMovies(): MovieEntry[] {
  return movieRepository.findAll();
}

export function getMovieBySlug(slug: string): MovieEntry | undefined {
  return movieRepository.findBySlug(slug);
}

export function computeMovieStats(all: MovieEntry[]) {
  const watched = all.filter(
    (m) => m.status === "watched" || m.status === "rewatch",
  );
  const ratings = watched
    .map((m) => m.rating)
    .filter((r): r is NonNullable<typeof r> => typeof r === "number");

  return {
    total: all.length,
    watched: watched.length,
    watchlist: all.filter((m) => m.status === "watchlist").length,
    favorites: all.filter((m) => m.favorite).length,
    withReview: all.filter((m) => m.reviewSlug).length,
    averageRating:
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : null,
    totalRuntimeMinutes: watched.reduce(
      (sum, m) => sum + (m.runtimeMinutes ?? 0),
      0,
    ),
  };
}

export function getMovieStats() {
  return computeMovieStats(movieRepository.findAll());
}

function filmStatusTone(
  status: MovieEntry["status"],
): CatalogCardItem["statusTone"] {
  if (status === "watchlist") return "warning";
  if (status === "watched" || status === "rewatch") return "positive";
  return "neutral";
}

function toFilmCatalogCard(
  movie: MovieEntry,
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): CatalogCardItem {
  const catalog = catalogCopyFor(locale);
  const labels = catalog.status.films;
  const statusLabel = labels[movie.status];
  const yearLabel = movie.releaseDate?.slice(0, 4) ?? null;
  const lastWatched = movie.watchedDates?.at(-1) ?? null;
  const activityLabel = lastWatched
    ? catalog.card.watchedOn.replace("{date}", formatDate(lastWatched, locale))
    : catalog.card.noActivityDate;
  const durationLabel =
    movie.runtimeMinutes != null && movie.runtimeMinutes > 0
      ? formatShortRuntime(movie.runtimeMinutes, locale)
      : null;
  const hasReview = catalogHasReview("films", movie.reviewSlug, locale);
  const favorite = Boolean(movie.favorite);
  const title = localizedWorkTitle(
    "films",
    movie.reviewSlug,
    movie.title,
    locale,
  );

  const metaTags = [
    yearLabel,
    ...(movie.tags ?? []).slice(0, 2),
    durationLabel,
    statusLabel,
  ].filter((tag): tag is string => Boolean(tag));

  return {
    medium: "movie",
    slug: movie.slug,
    title,
    href: catalogHref("films", movie.slug, locale),
    posterUrl: tmdbImageUrl(movie.posterPath, "w342"),
    rating: movie.rating,
    favorite,
    hasReview,
    statusLabel,
    statusTone: filmStatusTone(movie.status),
    yearLabel,
    activityLabel,
    favoriteLabel: favorite
      ? catalog.card.favorite
      : catalog.card.notFavorite,
    reviewLabel: hasReview
      ? catalog.card.withReview
      : catalog.card.noReview,
    metaTags,
    statusKey: movie.status,
    sortTitle: title,
    sortDate: lastWatched,
    sortRating: movie.rating ?? 0,
    sortYear: yearLabel && /^\d{4}$/.test(yearLabel) ? Number(yearLabel) : null,
    goalYears: yearsMovieCountsToward(movie),
    watchedEpisodeCount: 0,
  };
}

export function listMovieCatalogItems(
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): CatalogCardItem[] {
  return listMovies()
    .map((movie) => toFilmCatalogCard(movie, locale))
    .sort((a, b) =>
      a.sortTitle.localeCompare(b.sortTitle, intlLocale(locale)),
    );
}

function joinNames(names: string[]): string | null {
  const cleaned = names.map((name) => name.trim()).filter(Boolean);
  if (cleaned.length === 0) return null;
  return cleaned.join(", ");
}

/** Pure — chronological viewing rows with first/rewatch labels. */
export function buildMovieViewings(
  watchedDates: string[] | undefined,
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): MovieViewingRecord[] {
  if (!watchedDates?.length) return [];
  const copy = copyFor(locale).films.detail.viewings;

  return [...watchedDates]
    .sort((a, b) => a.localeCompare(b))
    .map((date, index) => ({
      dateLabel: formatDate(date, locale),
      kindLabel: index === 0 ? copy.first : copy.rewatch,
    }));
}

function viewingCountLabel(count: number, locale: ReviewLocale): string {
  const copy = copyFor(locale).films.detail.viewings;
  if (count <= 0) return copy.countNone;
  if (count === 1) return copy.countOne;
  return copy.countMany.replace("{count}", String(count));
}

function mapCast(metadata: TmdbMovieMetadata | null): MovieCastMember[] {
  if (!metadata) return [];
  return metadata.cast.map((person) => ({
    id: person.id,
    name: person.name,
    role: person.role,
    profileUrl: person.profileUrl,
  }));
}

export function mapMovieDetail(
  movie: MovieEntry,
  metadata: TmdbMovieMetadata | null,
  metadataNotice: string | null,
  reviewHtml: string | null = null,
  localeContext = defaultDetailLocale(),
): MovieDetail {
  const locale = localeContext.reviewLocale;
  const copy = copyFor(locale).films.detail;
  const catalog = catalogCopyFor(locale);
  const title =
    localeContext.workTitle?.trim() ||
    metadata?.title?.trim() ||
    movie.title;
  const originalTitleRaw = metadata?.originalTitle?.trim() || null;
  const originalTitle =
    originalTitleRaw &&
    originalTitleRaw.localeCompare(title, undefined, { sensitivity: "accent" }) !==
      0
      ? originalTitleRaw
      : null;

  const yearLabel =
    metadata?.year != null
      ? String(metadata.year)
      : (movie.releaseDate?.slice(0, 4) ?? null);

  const runtimeMinutes =
    metadata?.runtimeMinutes ?? movie.runtimeMinutes ?? null;
  const runtimeLabel =
    runtimeMinutes != null && runtimeMinutes > 0
      ? formatShortRuntime(runtimeMinutes, locale)
      : null;

  const posterUrl =
    metadata?.posterUrl ?? tmdbImageUrl(movie.posterPath, "w500");
  const backdropUrl = metadata?.backdropUrl ?? null;

  const genres = metadata?.genres.map((genre) => genre.name) ?? [];
  const synopsis = metadata?.overview?.trim() || null;

  const viewings = buildMovieViewings(movie.watchedDates, locale);
  const favorite = Boolean(movie.favorite);
  const reviewSlug = movie.reviewSlug ?? null;

  const { metaTitle, metaDescription } = buildDetailMeta({
    title,
    year: yearLabel,
    synopsis,
    reviewHtml,
    copy: copy.meta,
    seoCopy: localeContext.seoCopy,
  });

  return {
    slug: movie.slug,
    title,
    originalTitle,
    yearLabel,
    runtimeLabel,
    genres,
    synopsis,
    posterUrl,
    backdropUrl,
    directorsLabel: joinNames(metadata?.directors.map((d) => d.name) ?? []),
    writersLabel: joinNames(metadata?.writers.map((w) => w.name) ?? []),
    cast: mapCast(metadata),
    countriesLabel: joinNames(metadata?.countries ?? []),
    languagesLabel: joinNames(
      metadata?.languages?.length
        ? metadata.languages
        : metadata?.originalLanguage
          ? [metadata.originalLanguage]
          : [],
    ),
    trailer: metadata?.trailer
      ? { name: metadata.trailer.name, url: metadata.trailer.url }
      : null,
    metadataNotice,
    statusLabel: catalog.status.films[movie.status],
    rating: movie.rating,
    favorite,
    favoriteLabel: favorite
      ? catalog.card.favorite
      : catalog.card.notFavorite,
    tags: movie.tags ?? [],
    watchLocation: movie.watchLocation?.trim() || null,
    streamingService: movie.streamingService?.trim() || null,
    viewingCount: viewings.length,
    viewingCountLabel: viewingCountLabel(viewings.length, locale),
    viewings,
    viewingsEmptyLabel: copy.viewings.empty,
    reviewSlug,
    reviewHtml,
    reviewEmptyLabel: reviewSlug ? copy.review.pending : copy.review.empty,
    reviewLocale: localeContext.reviewLocale,
    reviewHeading: localeContext.reviewHeading,
    alternateReviewHref: localeContext.alternateReviewHref,
    alternateReviewLabel: localeContext.alternateReviewLabel,
    metaTitle,
    metaDescription,
  };
}

async function loadMovieMetadata(
  tmdbId: number | undefined,
  language?: string,
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): Promise<{ metadata: TmdbMovieMetadata | null; notice: string | null }> {
  const notices = copyFor(locale).films.detail.metadata;
  if (tmdbId == null) {
    return {
      metadata: null,
      notice: notices.unresolved,
    };
  }

  try {
    const metadata = language
      ? await getMovieById(tmdbId, language)
      : await getMovieById(tmdbId);
    return { metadata, notice: null };
  } catch (error) {
    if (error instanceof TmdbError && error.code === "not_found") {
      return {
        metadata: null,
        notice: notices.unresolved,
      };
    }
    return {
      metadata: null,
      notice: notices.unavailable,
    };
  }
}

/**
 * Film detail for `/films/[slug]` (and `/pt/films/[slug]`). Cached per
 * request so `generateMetadata` and the page share one TMDB fetch.
 */
export const getMovieDetail = cache(
  async (
    slug: string,
    locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
  ): Promise<MovieDetail | undefined> => {
    const movie = getMovieBySlug(slug);
    if (!movie) return undefined;

    const localeContext = resolveDetailLocale(
      "films",
      movie.slug,
      movie.reviewSlug,
      locale,
    );

    const language =
      locale === "pt-BR" ? tmdbLanguageForLocale(locale) : undefined;
    const { metadata, notice } = await loadMovieMetadata(
      movie.tmdbId,
      language,
      locale,
    );
    return mapMovieDetail(
      movie,
      metadata,
      notice,
      localeContext.reviewHtml,
      localeContext,
    );
  },
);
