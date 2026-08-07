/**
 * Normalized TMDB metadata for use cases and UI.
 * Built by the TMDB infrastructure adapter — never pass raw provider payloads to components.
 */

export type TmdbGenre = {
  id: number;
  name: string;
};

export type TmdbPersonCredit = {
  id: number;
  name: string;
  /** Character name for cast; job title for crew */
  role: string;
  profileUrl: string | null;
};

export type TmdbTrailer = {
  key: string;
  name: string;
  site: "YouTube";
  official: boolean;
  url: string;
};

export type TmdbSearchHit = {
  id: number;
  title: string;
  originalTitle: string | null;
  overview: string | null;
  releaseDate: string | null;
  year: number | null;
  posterUrl: string | null;
};

export type TmdbSearchPage = {
  page: number;
  totalPages: number;
  totalResults: number;
  results: TmdbSearchHit[];
};

export type TmdbMovieMetadata = {
  id: number;
  title: string;
  originalTitle: string | null;
  overview: string | null;
  releaseDate: string | null;
  year: number | null;
  runtimeMinutes: number | null;
  genres: TmdbGenre[];
  countries: string[];
  languages: string[];
  originalLanguage: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  directors: TmdbPersonCredit[];
  writers: TmdbPersonCredit[];
  cast: TmdbPersonCredit[];
  trailer: TmdbTrailer | null;
};

export type TmdbSeasonSummary = {
  id: number;
  seasonNumber: number;
  name: string;
  episodeCount: number;
  airDate: string | null;
  posterUrl: string | null;
  overview: string | null;
};

export type TmdbEpisodeMetadata = {
  id: number;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  overview: string | null;
  airDate: string | null;
  runtimeMinutes: number | null;
  stillUrl: string | null;
};

export type TmdbSeasonMetadata = {
  id: number;
  seriesId: number;
  seasonNumber: number;
  name: string;
  overview: string | null;
  airDate: string | null;
  posterUrl: string | null;
  episodes: TmdbEpisodeMetadata[];
};

export type TmdbSeriesMetadata = {
  id: number;
  title: string;
  originalTitle: string | null;
  overview: string | null;
  status: string | null;
  firstAirDate: string | null;
  lastAirDate: string | null;
  year: number | null;
  numberOfSeasons: number | null;
  numberOfEpisodes: number | null;
  episodeRuntimeMinutes: number | null;
  genres: TmdbGenre[];
  countries: string[];
  languages: string[];
  originalLanguage: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  seasons: TmdbSeasonSummary[];
  directors: TmdbPersonCredit[];
  writers: TmdbPersonCredit[];
  cast: TmdbPersonCredit[];
  trailer: TmdbTrailer | null;
};

export type TmdbTvdbLookup = {
  tmdbId: number;
  title: string;
};
