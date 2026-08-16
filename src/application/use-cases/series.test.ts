import { describe, expect, it } from "vitest";
import type { SeriesEntry } from "@/domain/entities";
import type {
  TmdbSeasonMetadata,
  TmdbSeriesMetadata,
} from "@/application/dto/tmdb-metadata";
import {
  computeSeriesStats,
  findNextUnwatchedEpisode,
  getEpisodeRuntimeMinutes,
  listSeriesCatalogItems,
  mapSeriesDetail,
  DEFAULT_EPISODE_RUNTIME_MINUTES,
} from "@/application/use-cases/series";
import { catalogCopy } from "@/content/copy/catalog";
import { seriesCopy } from "@/content/copy/series";

const baseEntry: SeriesEntry = {
  slug: "breaking-bad",
  title: "Breaking Bad",
  status: "watching",
  tvdbId: 81189,
  tmdbId: 1396,
  posterPath: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
  rating: 5,
  favorite: true,
  startedAt: "2020-01-01",
  numberOfEpisodes: 62,
  watchedEpisodes: [
    { season: 1, episode: 1, watchedAt: "2020-01-01", runtimeMinutes: 58 },
    { season: 1, episode: 2, watchedAt: "2020-01-02", runtimeMinutes: 48 },
  ],
};

const seasonOne: TmdbSeasonMetadata = {
  id: 1,
  seriesId: 1396,
  seasonNumber: 1,
  name: "Season 1",
  overview: null,
  airDate: "2008-01-20",
  posterUrl: null,
  episodes: [
    {
      id: 11,
      seasonNumber: 1,
      episodeNumber: 1,
      title: "Pilot",
      overview: null,
      airDate: "2008-01-20",
      runtimeMinutes: 58,
      stillUrl: null,
    },
    {
      id: 12,
      seasonNumber: 1,
      episodeNumber: 2,
      title: "Cat's in the Bag...",
      overview: null,
      airDate: "2008-01-27",
      runtimeMinutes: 48,
      stillUrl: null,
    },
    {
      id: 13,
      seasonNumber: 1,
      episodeNumber: 3,
      title: "...And the Bag's in the River",
      overview: null,
      airDate: "2008-02-10",
      runtimeMinutes: 48,
      stillUrl: null,
    },
  ],
};

const baseMetadata: TmdbSeriesMetadata = {
  id: 1396,
  title: "Breaking Bad",
  originalTitle: "Breaking Bad",
  overview: "A chemistry teacher turns to a life of crime.",
  status: "Ended",
  firstAirDate: "2008-01-20",
  lastAirDate: "2013-09-29",
  year: 2008,
  numberOfSeasons: 5,
  numberOfEpisodes: 62,
  episodeRuntimeMinutes: 45,
  genres: [{ id: 18, name: "Drama" }],
  countries: ["United States of America"],
  languages: ["English"],
  originalLanguage: "en",
  posterUrl: "https://image.tmdb.org/t/p/w500/poster.jpg",
  backdropUrl: "https://image.tmdb.org/t/p/w780/backdrop.jpg",
  seasons: [
    {
      id: 1,
      seasonNumber: 1,
      name: "Season 1",
      episodeCount: 7,
      airDate: "2008-01-20",
      posterUrl: null,
      overview: null,
    },
  ],
  directors: [
    { id: 1, name: "Vince Gilligan", role: "Creator", profileUrl: null },
  ],
  writers: [],
  cast: [
    {
      id: 10,
      name: "Bryan Cranston",
      role: "Walter White",
      profileUrl: null,
    },
  ],
  trailer: null,
};

describe("findNextUnwatchedEpisode", () => {
  it("returns the first regular episode not yet watched", () => {
    expect(
      findNextUnwatchedEpisode([seasonOne], baseEntry.watchedEpisodes),
    ).toEqual({
      seasonNumber: 1,
      episodeNumber: 3,
      title: "...And the Bag's in the River",
    });
  });
});

describe("mapSeriesDetail", () => {
  it("merges TMDB metadata with personal progress", () => {
    const detail = mapSeriesDetail(
      baseEntry,
      baseMetadata,
      [seasonOne],
      null,
    );

    expect(detail.title).toBe("Breaking Bad");
    expect(detail.creatorsLabel).toBe("Vince Gilligan");
    expect(detail.statusLabel).toBe("Watching");
    expect(detail.favorite).toBe(true);
    expect(detail.watchedEpisodesLabel).toBe("2 / 62");
    expect(detail.progressPercent).toBe(3);
    expect(detail.nextEpisodeLabel).toContain("S1 E3");
    expect(detail.seasons).toHaveLength(1);
    expect(detail.seasons[0]?.watchedCount).toBe(2);
    expect(detail.seasons[0]?.episodes[2]?.isNext).toBe(true);
    expect(detail.metadataNotice).toBeNull();
  });

  it("surfaces a metadata notice when TMDB is unavailable", () => {
    const detail = mapSeriesDetail(
      { ...baseEntry, tmdbId: undefined, posterPath: undefined },
      null,
      [],
      seriesCopy.detail.metadata.unresolved,
    );

    expect(detail.title).toBe("Breaking Bad");
    expect(detail.posterUrl).toBeNull();
    expect(detail.seasons).toEqual([]);
    expect(detail.metadataNotice).toBe(
      seriesCopy.detail.metadata.unresolved,
    );
    expect(detail.reviewEmptyLabel).toBe(seriesCopy.detail.review.empty);
  });

  it("uses the pending review label when a reviewSlug is set", () => {
    const detail = mapSeriesDetail(
      { ...baseEntry, reviewSlug: "breaking-bad" },
      baseMetadata,
      [seasonOne],
      null,
    );

    expect(detail.reviewSlug).toBe("breaking-bad");
    expect(detail.reviewHtml).toBeNull();
    expect(detail.reviewEmptyLabel).toBe(seriesCopy.detail.review.pending);
  });

  it("uses a review-aware title and excerpt when html is present", () => {
    const detail = mapSeriesDetail(
      { ...baseEntry, reviewSlug: "breaking-bad" },
      baseMetadata,
      [seasonOne],
      null,
      "<p>The best show on television.</p>",
    );

    expect(detail.reviewHtml).toBe("<p>The best show on television.</p>");
    expect(detail.metaTitle).toBe("Breaking Bad review");
    expect(detail.metaDescription).toBe("The best show on television.");
  });
});

describe("getEpisodeRuntimeMinutes", () => {
  it("falls back to the default when runtime is missing or invalid", () => {
    expect(getEpisodeRuntimeMinutes(58)).toBe(58);
    expect(getEpisodeRuntimeMinutes(undefined)).toBe(
      DEFAULT_EPISODE_RUNTIME_MINUTES,
    );
    expect(getEpisodeRuntimeMinutes(0)).toBe(DEFAULT_EPISODE_RUNTIME_MINUTES);
  });
});

describe("computeSeriesStats", () => {
  it("counts statuses, episodes, and runtime with the default fallback", () => {
    const stats = computeSeriesStats([
      {
        tvdbId: 1,
        slug: "watching",
        title: "Watching",
        status: "watching",
        favorite: true,
        watchedEpisodes: [
          { season: 1, episode: 1, runtimeMinutes: 40 },
          { season: 1, episode: 2 },
        ],
      },
      {
        tvdbId: 2,
        slug: "done",
        title: "Done",
        status: "completed",
        watchedEpisodes: [{ season: 1, episode: 1, runtimeMinutes: 50 }],
      },
      {
        tvdbId: 3,
        slug: "list",
        title: "List",
        status: "watchlist",
        watchedEpisodes: [],
      },
      {
        tvdbId: 4,
        slug: "paused",
        title: "Paused",
        status: "paused",
        watchedEpisodes: [{ season: 1, episode: 1, runtimeMinutes: 30 }],
      },
      {
        tvdbId: 5,
        slug: "abandoned",
        title: "Abandoned",
        status: "abandoned",
        watchedEpisodes: [],
      },
    ]);

    expect(stats).toMatchObject({
      total: 5,
      watching: 1,
      completed: 1,
      paused: 1,
      abandoned: 1,
      watchlist: 1,
      favorites: 1,
      watchedEpisodes: 4,
      withProgress: 3,
      totalRuntimeMinutes: 40 + DEFAULT_EPISODE_RUNTIME_MINUTES + 50 + 30,
    });
  });
});

describe("listSeriesCatalogItems", () => {
  it("maps live catalog entries into sorted cards", () => {
    const items = listSeriesCatalogItems();
    expect(items.length).toBeGreaterThan(0);
    expect(items).toEqual(
      [...items].sort((a, b) => a.sortTitle.localeCompare(b.sortTitle)),
    );

    const sample = items.find((item) => item.slug === "full-house");
    expect(sample).toMatchObject({
      medium: "series",
      href: "/series/full-house",
      statusTone: expect.stringMatching(/positive|warning|neutral/),
    });
    expect(sample?.statusLabel).toBeTruthy();
    expect(
      Object.values(catalogCopy.status.series),
    ).toContain(sample?.statusLabel);
  });
});
