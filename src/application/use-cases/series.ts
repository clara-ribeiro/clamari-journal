import { cache } from "react";
import { seriesRepository } from "@/composition/repositories";
import type {
  CatalogCardItem,
  MovieCastMember,
  SeriesDetail,
  SeriesEpisodeDetail,
  SeriesSeasonDetail,
} from "@/application/dto";
import type {
  TmdbSeasonMetadata,
  TmdbSeriesMetadata,
} from "@/application/dto/tmdb-metadata";
import type { SeriesEntry, WatchedEpisode } from "@/domain/entities";
import { copyFor } from "@/content/copy/for-locale";
import {
  getSeason,
  getSeriesById,
  TmdbError,
} from "@/infrastructure/tmdb/client";
import { formatDate } from "@/lib/formatters/formatDate";
import {
  formatDuration,
  formatShortRuntime,
} from "@/lib/formatters/formatDuration";
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
import { yearsSeriesCountsToward } from "./goal-years";
import { defaultDetailLocale, resolveDetailLocale } from "./review-locale";

/** Used when an episode has no known runtime (common for older TV Time rows). */
export const DEFAULT_EPISODE_RUNTIME_MINUTES = 45;

export function listSeries(): SeriesEntry[] {
  return seriesRepository.findAll();
}

export function getSeriesBySlug(slug: string): SeriesEntry | undefined {
  return seriesRepository.findBySlug(slug);
}

export function getEpisodeRuntimeMinutes(runtimeMinutes?: number): number {
  return runtimeMinutes && runtimeMinutes > 0
    ? runtimeMinutes
    : DEFAULT_EPISODE_RUNTIME_MINUTES;
}

export function computeSeriesStats(all: SeriesEntry[]) {
  const withProgress = all.filter((s) => s.watchedEpisodes.length > 0);

  const totalRuntimeMinutes = all.reduce(
    (sum, entry) =>
      sum +
      entry.watchedEpisodes.reduce(
        (episodeSum, episode) =>
          episodeSum + getEpisodeRuntimeMinutes(episode.runtimeMinutes),
        0,
      ),
    0,
  );

  const watchedEpisodes = all.reduce(
    (total, entry) => total + entry.watchedEpisodes.length,
    0,
  );

  return {
    total: all.length,
    watching: all.filter((s) => s.status === "watching").length,
    completed: all.filter((s) => s.status === "completed").length,
    paused: all.filter((s) => s.status === "paused").length,
    abandoned: all.filter((s) => s.status === "abandoned").length,
    watchlist: all.filter((s) => s.status === "watchlist").length,
    favorites: all.filter((s) => s.favorite).length,
    watchedEpisodes,
    withProgress: withProgress.length,
    totalRuntimeMinutes,
  };
}

export function getSeriesStats() {
  return computeSeriesStats(seriesRepository.findAll());
}

export function listSeriesCatalogItems(
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): CatalogCardItem[] {
  return listSeries()
    .map((entry) => toSeriesCatalogCard(entry, locale))
    .sort((a, b) =>
      a.sortTitle.localeCompare(b.sortTitle, intlLocale(locale)),
    );
}

function seriesStatusTone(
  status: SeriesEntry["status"],
): CatalogCardItem["statusTone"] {
  if (status === "watchlist") return "warning";
  if (
    status === "completed" ||
    status === "watching" ||
    status === "up-to-date"
  ) {
    return "positive";
  }
  return "neutral";
}

function toSeriesCatalogCard(
  entry: SeriesEntry,
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): CatalogCardItem {
  const catalog = catalogCopyFor(locale);
  const statusLabel = catalog.status.series[entry.status];
  const hasReview = catalogHasReview("series", entry.reviewSlug, locale);
  const favorite = Boolean(entry.favorite);
  const activityDate = entry.finishedAt ?? entry.startedAt ?? null;
  const activityLabel = entry.finishedAt
    ? catalog.card.finishedOn.replace(
        "{date}",
        formatDate(entry.finishedAt, locale),
      )
    : entry.startedAt
      ? catalog.card.startedOn.replace(
          "{date}",
          formatDate(entry.startedAt, locale),
        )
      : catalog.card.noActivityDate;
  const episodeTag =
    entry.watchedEpisodes.length > 0
      ? catalog.card.episodeCount.replace(
          "{count}",
          String(entry.watchedEpisodes.length),
        )
      : null;
  const title = localizedWorkTitle(
    "series",
    entry.reviewSlug,
    entry.title,
    locale,
  );

  const metaTags = [episodeTag, statusLabel].filter(
    (tag): tag is string => Boolean(tag),
  );

  return {
    medium: "series",
    slug: entry.slug,
    title,
    href: catalogHref("series", entry.slug, locale),
    posterUrl: tmdbImageUrl(entry.posterPath, "w342"),
    rating: entry.rating,
    favorite,
    hasReview,
    statusLabel,
    statusTone: seriesStatusTone(entry.status),
    yearLabel: null,
    activityLabel,
    favoriteLabel: favorite
      ? catalog.card.favorite
      : catalog.card.notFavorite,
    reviewLabel: hasReview
      ? catalog.card.withReview
      : catalog.card.noReview,
    metaTags,
    statusKey: entry.status,
    sortTitle: title,
    sortDate: activityDate,
    sortRating: entry.rating ?? 0,
    sortYear: null,
    goalYears: yearsSeriesCountsToward(entry),
    watchedEpisodeCount: entry.watchedEpisodes.length,
  };
}

function joinNames(names: string[]): string | null {
  const cleaned = names.map((name) => name.trim()).filter(Boolean);
  if (cleaned.length === 0) return null;
  return cleaned.join(", ");
}

function episodeKey(season: number, episode: number) {
  return `${season}-${episode}`;
}

function watchedMap(watched: WatchedEpisode[]) {
  return new Map(
    watched.map((ep) => [episodeKey(ep.season, ep.episode), ep] as const),
  );
}

/** Pure — find the next unwatched regular episode in season/episode order. */
export function findNextUnwatchedEpisode(
  seasons: TmdbSeasonMetadata[],
  watched: WatchedEpisode[],
): { seasonNumber: number; episodeNumber: number; title: string } | null {
  const seen = watchedMap(watched);
  const regular = seasons
    .filter((season) => season.seasonNumber > 0)
    .sort((a, b) => a.seasonNumber - b.seasonNumber);

  for (const season of regular) {
    const episodes = [...season.episodes].sort(
      (a, b) => a.episodeNumber - b.episodeNumber,
    );
    for (const episode of episodes) {
      if (!seen.has(episodeKey(episode.seasonNumber, episode.episodeNumber))) {
        return {
          seasonNumber: episode.seasonNumber,
          episodeNumber: episode.episodeNumber,
          title: episode.title,
        };
      }
    }
  }
  return null;
}

function mapCast(metadata: TmdbSeriesMetadata | null): MovieCastMember[] {
  if (!metadata) return [];
  return metadata.cast.map((person) => ({
    id: person.id,
    name: person.name,
    role: person.role,
    profileUrl: person.profileUrl,
  }));
}

function buildSeasonDetails(
  seasons: TmdbSeasonMetadata[],
  watched: WatchedEpisode[],
  next: ReturnType<typeof findNextUnwatchedEpisode>,
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): SeriesSeasonDetail[] {
  const copy = copyFor(locale).series.detail.seasons;
  const seen = watchedMap(watched);

  const ordered = [...seasons].sort((a, b) => {
    // Regular seasons first, specials (0) last.
    if (a.seasonNumber === 0) return 1;
    if (b.seasonNumber === 0) return -1;
    return a.seasonNumber - b.seasonNumber;
  });

  return ordered.map((season) => {
    const isSpecials = season.seasonNumber === 0;
    const episodes: SeriesEpisodeDetail[] = [...season.episodes]
      .sort((a, b) => a.episodeNumber - b.episodeNumber)
      .map((episode) => {
        const key = episodeKey(episode.seasonNumber, episode.episodeNumber);
        const personal = seen.get(key);
        const watchedFlag = Boolean(personal);
        const isNext =
          next != null &&
          next.seasonNumber === episode.seasonNumber &&
          next.episodeNumber === episode.episodeNumber;
        const title =
          episode.title?.trim() ||
          copy.episodeFallback.replace(
            "{number}",
            String(episode.episodeNumber),
          );
        const runtimeMinutes =
          episode.runtimeMinutes ?? personal?.runtimeMinutes ?? null;

        return {
          id: key,
          seasonNumber: episode.seasonNumber,
          episodeNumber: episode.episodeNumber,
          codeLabel: isSpecials
            ? `Sp ${episode.episodeNumber}`
            : `S${episode.seasonNumber} E${episode.episodeNumber}`,
          title,
          runtimeLabel:
            runtimeMinutes != null && runtimeMinutes > 0
              ? formatShortRuntime(runtimeMinutes, locale)
              : null,
          airDateLabel: episode.airDate
            ? formatDate(episode.airDate, locale)
            : null,
          watched: watchedFlag,
          watchedDateLabel: personal?.watchedAt
            ? formatDate(personal.watchedAt, locale)
            : null,
          rating: personal?.rating,
          isNext,
        };
      });

    const watchedCount = episodes.filter((ep) => ep.watched).length;

    return {
      id: `season-${season.seasonNumber}`,
      seasonNumber: season.seasonNumber,
      title: isSpecials
        ? copy.specials
        : season.name?.trim() ||
          copy.seasonTitle.replace("{number}", String(season.seasonNumber)),
      isSpecials,
      progressLabel: copy.progress
        .replace("{watched}", String(watchedCount))
        .replace("{total}", String(episodes.length)),
      episodeCount: episodes.length,
      watchedCount,
      episodes,
    };
  });
}

export function mapSeriesDetail(
  entry: SeriesEntry,
  metadata: TmdbSeriesMetadata | null,
  seasons: TmdbSeasonMetadata[],
  metadataNotice: string | null,
  reviewHtml: string | null = null,
  localeContext = defaultDetailLocale(),
): SeriesDetail {
  const locale = localeContext.reviewLocale;
  const copy = copyFor(locale).series.detail;
  const catalog = catalogCopyFor(locale);
  const title =
    localeContext.workTitle?.trim() ||
    metadata?.title?.trim() ||
    entry.title;
  const originalTitleRaw = metadata?.originalTitle?.trim() || null;
  const originalTitle =
    originalTitleRaw &&
    originalTitleRaw.localeCompare(title, undefined, {
      sensitivity: "accent",
    }) !== 0
      ? originalTitleRaw
      : null;

  const yearLabel =
    metadata?.year != null
      ? String(metadata.year)
      : (metadata?.firstAirDate?.slice(0, 4) ?? null);

  const posterUrl =
    metadata?.posterUrl ?? tmdbImageUrl(entry.posterPath, "w500");
  const backdropUrl = metadata?.backdropUrl ?? null;
  const genres = metadata?.genres.map((genre) => genre.name) ?? [];
  const synopsis = metadata?.overview?.trim() || null;

  const favorite = Boolean(entry.favorite);
  const reviewSlug = entry.reviewSlug ?? null;
  const watchedCount = entry.watchedEpisodes.length;

  const totalEpisodes =
    metadata?.numberOfEpisodes ??
    entry.numberOfEpisodes ??
    (seasons
      .filter((season) => season.seasonNumber > 0)
      .reduce((sum, season) => sum + season.episodes.length, 0) ||
      null);

  const progressPercent =
    totalEpisodes != null && totalEpisodes > 0
      ? Math.min(100, Math.round((watchedCount / totalEpisodes) * 100))
      : null;

  const watchedTimeMinutes = entry.watchedEpisodes.reduce((sum, episode) => {
    const fromSeason = seasons
      .find((season) => season.seasonNumber === episode.season)
      ?.episodes.find((ep) => ep.episodeNumber === episode.episode);
    return (
      sum +
      getEpisodeRuntimeMinutes(
        episode.runtimeMinutes ?? fromSeason?.runtimeMinutes ?? undefined,
      )
    );
  }, 0);

  const next = findNextUnwatchedEpisode(seasons, entry.watchedEpisodes);
  const seasonDetails = buildSeasonDetails(
    seasons,
    entry.watchedEpisodes,
    next,
    locale,
  );

  const { metaTitle, metaDescription } = buildDetailMeta({
    title,
    year: yearLabel,
    synopsis,
    reviewHtml,
    copy: copy.meta,
    seoCopy: localeContext.seoCopy,
  });

  return {
    slug: entry.slug,
    title,
    originalTitle,
    yearLabel,
    genres,
    synopsis,
    posterUrl,
    backdropUrl,
    creatorsLabel: joinNames(metadata?.directors.map((d) => d.name) ?? []),
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
    productionStatusLabel: metadata?.status?.trim() || null,
    trailer: metadata?.trailer
      ? { name: metadata.trailer.name, url: metadata.trailer.url }
      : null,
    metadataNotice,
    statusLabel: catalog.status.series[entry.status],
    rating: entry.rating,
    favorite,
    favoriteLabel: favorite
      ? catalog.card.favorite
      : catalog.card.notFavorite,
    startedLabel: entry.startedAt ? formatDate(entry.startedAt, locale) : null,
    finishedLabel: entry.finishedAt
      ? formatDate(entry.finishedAt, locale)
      : null,
    watchedEpisodesLabel:
      totalEpisodes != null
        ? `${watchedCount} / ${totalEpisodes}`
        : String(watchedCount),
    watchedTimeLabel:
      watchedTimeMinutes > 0
        ? formatDuration(watchedTimeMinutes, locale)
        : null,
    progressLabel:
      progressPercent != null ? `${progressPercent}%` : null,
    progressPercent,
    nextEpisodeLabel: next
      ? `S${next.seasonNumber} E${next.episodeNumber} · ${next.title}`
      : null,
    seasons: seasonDetails,
    seasonsEmptyLabel: copy.seasons.empty,
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

async function loadSeriesSeasons(
  tmdbId: number,
  metadata: TmdbSeriesMetadata,
  language?: string,
): Promise<TmdbSeasonMetadata[]> {
  const seasonNumbers = metadata.seasons
    .map((season) => season.seasonNumber)
    .filter((number) => Number.isInteger(number) && number >= 0);

  const unique = [...new Set(seasonNumbers)].sort((a, b) => a - b);
  if (unique.length === 0) return [];

  const results = await Promise.all(
    unique.map(async (seasonNumber) => {
      try {
        return language
          ? await getSeason(tmdbId, seasonNumber, language)
          : await getSeason(tmdbId, seasonNumber);
      } catch {
        return null;
      }
    }),
  );

  return results.filter((season): season is TmdbSeasonMetadata =>
    Boolean(season),
  );
}

async function loadSeriesMetadata(
  tmdbId: number | undefined,
  language?: string,
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): Promise<{
  metadata: TmdbSeriesMetadata | null;
  seasons: TmdbSeasonMetadata[];
  notice: string | null;
}> {
  const notices = copyFor(locale).series.detail.metadata;
  if (tmdbId == null) {
    return {
      metadata: null,
      seasons: [],
      notice: notices.unresolved,
    };
  }

  try {
    const metadata = language
      ? await getSeriesById(tmdbId, language)
      : await getSeriesById(tmdbId);
    const seasons = await loadSeriesSeasons(tmdbId, metadata, language);
    return { metadata, seasons, notice: null };
  } catch (error) {
    if (error instanceof TmdbError && error.code === "not_found") {
      return {
        metadata: null,
        seasons: [],
        notice: notices.unresolved,
      };
    }
    return {
      metadata: null,
      seasons: [],
      notice: notices.unavailable,
    };
  }
}

/**
 * Series detail for `/series/[slug]` (and `/pt/series/[slug]`). Cached per
 * request so metadata and the page share one TMDB fetch tree.
 */
export const getSeriesDetail = cache(
  async (
    slug: string,
    locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
  ): Promise<SeriesDetail | undefined> => {
    const entry = getSeriesBySlug(slug);
    if (!entry) return undefined;

    const localeContext = resolveDetailLocale(
      "series",
      entry.slug,
      entry.reviewSlug,
      locale,
    );

    const language =
      locale === "pt-BR" ? tmdbLanguageForLocale(locale) : undefined;
    const { metadata, seasons, notice } = await loadSeriesMetadata(
      entry.tmdbId,
      language,
      locale,
    );
    return mapSeriesDetail(
      entry,
      metadata,
      seasons,
      notice,
      localeContext.reviewHtml,
      localeContext,
    );
  },
);
