/** Minimal TMDB wire shapes used by the normalizer. Keep provider-specific. */

export type TmdbRawGenre = {
  id: number;
  name: string;
};

export type TmdbRawNamed = {
  iso_3166_1?: string;
  iso_639_1?: string;
  name?: string;
  english_name?: string;
};

export type TmdbRawCastMember = {
  id: number;
  name: string;
  character?: string;
  order?: number;
  profile_path?: string | null;
};

export type TmdbRawCrewMember = {
  id: number;
  name: string;
  job?: string;
  department?: string;
  profile_path?: string | null;
};

export type TmdbRawCredits = {
  cast?: TmdbRawCastMember[];
  crew?: TmdbRawCrewMember[];
};

export type TmdbRawVideo = {
  id?: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official?: boolean;
};

export type TmdbRawVideos = {
  results?: TmdbRawVideo[];
};

export type TmdbRawSearchResult = {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
};

export type TmdbRawPagedResponse<T> = {
  page: number;
  results: T[];
  total_results: number;
  total_pages: number;
};

export type TmdbRawMovie = {
  id: number;
  title?: string;
  original_title?: string;
  overview?: string | null;
  release_date?: string;
  runtime?: number | null;
  genres?: TmdbRawGenre[];
  production_countries?: TmdbRawNamed[];
  spoken_languages?: TmdbRawNamed[];
  original_language?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  credits?: TmdbRawCredits;
  videos?: TmdbRawVideos;
};

export type TmdbRawSeasonSummary = {
  id: number;
  season_number: number;
  name?: string;
  episode_count?: number;
  air_date?: string | null;
  poster_path?: string | null;
  overview?: string | null;
};

export type TmdbRawSeries = {
  id: number;
  name?: string;
  original_name?: string;
  overview?: string | null;
  status?: string | null;
  first_air_date?: string;
  last_air_date?: string;
  number_of_seasons?: number | null;
  number_of_episodes?: number | null;
  episode_run_time?: number[];
  genres?: TmdbRawGenre[];
  production_countries?: TmdbRawNamed[];
  origin_country?: string[];
  spoken_languages?: TmdbRawNamed[];
  original_language?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  seasons?: TmdbRawSeasonSummary[];
  created_by?: Array<{ id: number; name: string; profile_path?: string | null }>;
  credits?: TmdbRawCredits;
  videos?: TmdbRawVideos;
};

export type TmdbRawEpisode = {
  id: number;
  name?: string;
  overview?: string | null;
  air_date?: string | null;
  episode_number: number;
  season_number?: number;
  runtime?: number | null;
  still_path?: string | null;
};

export type TmdbRawSeason = {
  id: number;
  name?: string;
  overview?: string | null;
  air_date?: string | null;
  poster_path?: string | null;
  season_number: number;
  episodes?: TmdbRawEpisode[];
};

export type TmdbRawFindResponse = {
  tv_results?: Array<{ id: number; name?: string }>;
};
