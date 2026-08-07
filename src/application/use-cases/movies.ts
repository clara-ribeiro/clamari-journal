import { movieRepository } from "@/composition/repositories";
import type { CatalogListItem, MovieDetail } from "@/application/dto";
import type { MovieEntry } from "@/domain/entities";
import { filmsCopy } from "@/content/copy/films";
import { formatDate } from "@/lib/formatters/formatDate";

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

export function listMovieCatalogItems(): CatalogListItem[] {
  return listMovies().map((movie) => ({
    slug: movie.slug,
    title: movie.title,
    href: `/films/${movie.slug}`,
    meta: [
      movie.status,
      movie.rating ? `★ ${movie.rating}` : null,
      movie.watchedDates?.at(-1) ?? null,
    ]
      .filter(Boolean)
      .join(" · "),
  }));
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
