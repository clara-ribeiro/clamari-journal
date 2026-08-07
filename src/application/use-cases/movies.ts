import { movieRepository } from "@/composition/repositories";
import type { CatalogCardItem, MovieDetail } from "@/application/dto";
import type { MovieEntry } from "@/domain/entities";
import { catalogCopy } from "@/content/copy/catalog";
import { filmsCopy } from "@/content/copy/films";
import { formatDate } from "@/lib/formatters/formatDate";
import { formatShortRuntime } from "@/lib/formatters/formatDuration";
import { tmdbImageUrl } from "@/lib/tmdb-image";

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
    favorite ? catalogCopy.card.favorite : null,
    statusLabel,
    hasReview ? catalogCopy.card.withReview : catalogCopy.card.noReview,
  ].filter((tag): tag is string => Boolean(tag));

  return {
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
  };
}

export function listMovieCatalogItems(): CatalogCardItem[] {
  return listMovies()
    .map(toFilmCatalogCard)
    .sort((a, b) => a.sortTitle.localeCompare(b.sortTitle));
}

export function getMovieDetail(slug: string): MovieDetail | undefined {
  const movie = getMovieBySlug(slug);
  if (!movie) return undefined;

  return {
    title: movie.title,
    backHref: "/films",
    fields: [
      { label: filmsCopy.detail.fields.status, value: movie.status },
      {
        label: filmsCopy.detail.fields.rating,
        value: movie.rating != null ? String(movie.rating) : "—",
      },
      {
        label: filmsCopy.detail.fields.watched,
        value:
          movie.watchedDates?.map((d) => formatDate(d)).join(" · ") || "—",
      },
      {
        label: filmsCopy.detail.fields.tmdb,
        value:
          movie.tmdbId != null
            ? String(movie.tmdbId)
            : filmsCopy.detail.pendingEnrichment,
      },
    ],
    note: filmsCopy.detail.note,
  };
}

export function getMoviesPageSummary() {
  const stats = getMovieStats();
  return filmsCopy.list.summary
    .replace("{watched}", String(stats.watched))
    .replace("{watchlist}", String(stats.watchlist))
    .replace("{total}", String(stats.total));
}
