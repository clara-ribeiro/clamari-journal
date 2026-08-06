import { seriesRepository } from "@/composition/repositories";
import type { CatalogListItem, SeriesDetail } from "@/application/dto";
import type { SeriesEntry } from "@/domain/entities";
import { seriesCopy } from "@/content/copy/series";
import { formatDate } from "@/lib/formatters/formatDate";

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

export function listSeriesCatalogItems(): CatalogListItem[] {
  return listSeries().map((entry) => ({
    slug: entry.slug,
    title: entry.title,
    href: `/series/${entry.slug}`,
    meta: [
      entry.status,
      entry.favorite ? "♥" : null,
      entry.watchedEpisodes.length
        ? `${entry.watchedEpisodes.length} eps`
        : null,
    ]
      .filter(Boolean)
      .join(" · "),
  }));
}

export function getSeriesDetail(slug: string): SeriesDetail | undefined {
  const entry = getSeriesBySlug(slug);
  if (!entry) return undefined;

  const previewLimit = 40;
  const preview = entry.watchedEpisodes.slice(0, previewLimit);
  const episodesHeading =
    entry.watchedEpisodes.length > preview.length
      ? seriesCopy.detail.episodesHeadingTruncated
          .replace("{shown}", String(preview.length))
          .replace("{total}", String(entry.watchedEpisodes.length))
      : seriesCopy.detail.episodesHeading;

  return {
    title: entry.title,
    backHref: "/series",
    fields: [
      { label: seriesCopy.detail.fields.status, value: entry.status },
      {
        label: seriesCopy.detail.fields.favorite,
        value: entry.favorite
          ? seriesCopy.detail.yes
          : seriesCopy.detail.no,
      },
      {
        label: seriesCopy.detail.fields.started,
        value: formatDate(entry.startedAt),
      },
      {
        label: seriesCopy.detail.fields.finished,
        value: formatDate(entry.finishedAt),
      },
      {
        label: seriesCopy.detail.fields.episodes,
        value: String(entry.watchedEpisodes.length),
      },
      { label: seriesCopy.detail.fields.tvdb, value: String(entry.tvdbId) },
      {
        label: seriesCopy.detail.fields.tmdb,
        value:
          entry.tmdbId != null
            ? String(entry.tmdbId)
            : seriesCopy.detail.pendingEnrichment,
      },
    ],
    episodesHeading,
    episodes: preview.map((ep) => ({
      id: `${ep.season}-${ep.episode}`,
      label: `S${ep.season} E${ep.episode}`,
      date: formatDate(ep.watchedAt),
    })),
  };
}

export function getSeriesPageSummary() {
  const stats = getSeriesStats();
  return seriesCopy.list.summary
    .replace("{total}", String(stats.total))
    .replace("{episodes}", String(stats.watchedEpisodes))
    .replace("{completed}", String(stats.completed))
    .replace("{watching}", String(stats.watching));
}
