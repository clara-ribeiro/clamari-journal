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
import { catalogCopy } from "@/content/copy/catalog";
import { filmsCopy } from "@/content/copy/films";
import { getMovieById, TmdbError } from "@/infrastructure/tmdb/client";
import { formatDate } from "@/lib/formatters/formatDate";
import { formatShortRuntime } from "@/lib/formatters/formatDuration";
import { tmdbImageUrl } from "@/lib/tmdb-image";
import { yearsMovieCountsToward } from "./goal-years";

const META_DESCRIPTION_MAX = 160;

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

function toFilmCatalogCard(movie: MovieEntry): CatalogCardItem {
  const labels = catalogCopy.status.films;
  const statusLabel = labels[movie.status];
  const yearLabel = movie.releaseDate?.slice(0, 4) ?? null;
  const lastWatched = movie.watchedDates?.at(-1) ?? null;
  const activityLabel = lastWatched
    ? catalogCopy.card.watchedOn.replace("{date}", formatDate(lastWatched))
    : catalogCopy.card.noActivityDate;
  const durationLabel =
    movie.runtimeMinutes != null && movie.runtimeMinutes > 0
      ? formatShortRuntime(movie.runtimeMinutes)
      : null;
  const hasReview = Boolean(movie.reviewSlug);
  const favorite = Boolean(movie.favorite);

  const metaTags = [
    yearLabel,
    ...(movie.tags ?? []).slice(0, 2),
    durationLabel,
    statusLabel,
  ].filter((tag): tag is string => Boolean(tag));

  return {
    medium: "movie",
    slug: movie.slug,
    title: movie.title,
    href: `/films/${movie.slug}`,
    posterUrl: tmdbImageUrl(movie.posterPath, "w342"),
    rating: movie.rating,
    favorite,
    hasReview,
    statusLabel,
    statusTone: filmStatusTone(movie.status),
    yearLabel,
    activityLabel,
    favoriteLabel: favorite
      ? catalogCopy.card.favorite
      : catalogCopy.card.notFavorite,
    reviewLabel: hasReview
      ? catalogCopy.card.withReview
      : catalogCopy.card.noReview,
    metaTags,
    statusKey: movie.status,
    sortTitle: movie.title,
    sortDate: lastWatched,
    sortRating: movie.rating ?? 0,
    sortYear: yearLabel && /^\d{4}$/.test(yearLabel) ? Number(yearLabel) : null,
    goalYears: yearsMovieCountsToward(movie),
    watchedEpisodeCount: 0,
  };
}

export function listMovieCatalogItems(): CatalogCardItem[] {
  return listMovies()
    .map(toFilmCatalogCard)
    .sort((a, b) => a.sortTitle.localeCompare(b.sortTitle));
}

function joinNames(names: string[]): string | null {
  const cleaned = names.map((name) => name.trim()).filter(Boolean);
  if (cleaned.length === 0) return null;
  return cleaned.join(", ");
}

function truncateDescription(text: string, max = META_DESCRIPTION_MAX): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  const slice = normalized.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const clipped = lastSpace > 40 ? slice.slice(0, lastSpace) : slice;
  return `${clipped}…`;
}

/** Pure — chronological viewing rows with first/rewatch labels. */
export function buildMovieViewings(
  watchedDates: string[] | undefined,
): MovieViewingRecord[] {
  if (!watchedDates?.length) return [];

  return [...watchedDates]
    .sort((a, b) => a.localeCompare(b))
    .map((date, index) => ({
      dateLabel: formatDate(date),
      kindLabel:
        index === 0
          ? filmsCopy.detail.viewings.first
          : filmsCopy.detail.viewings.rewatch,
    }));
}

function viewingCountLabel(count: number): string {
  if (count <= 0) return filmsCopy.detail.viewings.countNone;
  if (count === 1) return filmsCopy.detail.viewings.countOne;
  return filmsCopy.detail.viewings.countMany.replace("{count}", String(count));
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
): MovieDetail {
  const copy = filmsCopy.detail;
  const title = metadata?.title?.trim() || movie.title;
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
      ? formatShortRuntime(runtimeMinutes)
      : null;

  const posterUrl =
    metadata?.posterUrl ?? tmdbImageUrl(movie.posterPath, "w500");
  const backdropUrl = metadata?.backdropUrl ?? null;

  const genres = metadata?.genres.map((genre) => genre.name) ?? [];
  const synopsis = metadata?.overview?.trim() || null;

  const viewings = buildMovieViewings(movie.watchedDates);
  const favorite = Boolean(movie.favorite);
  const reviewSlug = movie.reviewSlug ?? null;

  const synopsisForMeta = synopsis
    ? copy.meta.descriptionFromSynopsis.replace("{synopsis}", synopsis)
    : copy.meta.descriptionFallback.replace("{title}", title);

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
    statusLabel: catalogCopy.status.films[movie.status],
    rating: movie.rating,
    favorite,
    favoriteLabel: favorite
      ? catalogCopy.card.favorite
      : catalogCopy.card.notFavorite,
    tags: movie.tags ?? [],
    watchLocation: movie.watchLocation?.trim() || null,
    streamingService: movie.streamingService?.trim() || null,
    viewingCount: viewings.length,
    viewingCountLabel: viewingCountLabel(viewings.length),
    viewings,
    viewingsEmptyLabel: copy.viewings.empty,
    reviewSlug,
    reviewEmptyLabel: reviewSlug ? copy.review.pending : copy.review.empty,
    metaTitle: title,
    metaDescription: truncateDescription(synopsisForMeta),
  };
}

async function loadMovieMetadata(
  tmdbId: number | undefined,
): Promise<{ metadata: TmdbMovieMetadata | null; notice: string | null }> {
  if (tmdbId == null) {
    return {
      metadata: null,
      notice: filmsCopy.detail.metadata.unresolved,
    };
  }

  try {
    const metadata = await getMovieById(tmdbId);
    return { metadata, notice: null };
  } catch (error) {
    if (error instanceof TmdbError && error.code === "not_found") {
      return {
        metadata: null,
        notice: filmsCopy.detail.metadata.unresolved,
      };
    }
    return {
      metadata: null,
      notice: filmsCopy.detail.metadata.unavailable,
    };
  }
}

/**
 * Film detail for `/films/[slug]`. Cached per request so `generateMetadata`
 * and the page share one TMDB fetch.
 */
export const getMovieDetail = cache(
  async (slug: string): Promise<MovieDetail | undefined> => {
    const movie = getMovieBySlug(slug);
    if (!movie) return undefined;

    const { metadata, notice } = await loadMovieMetadata(movie.tmdbId);
    return mapMovieDetail(movie, metadata, notice);
  },
);
