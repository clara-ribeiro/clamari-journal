import { describe, expect, it } from "vitest";
import type { SeriesEntry } from "@/domain/entities";
import type {
  TmdbSeasonMetadata,
  TmdbSeriesMetadata,
} from "@/application/dto/tmdb-metadata";
import {
  findNextUnwatchedEpisode,
  mapSeriesDetail,
} from "@/application/use-cases/series";
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
  });
});
