import type {
  TmdbEpisodeMetadata,
  TmdbMovieMetadata,
  TmdbPersonCredit,
  TmdbSearchHit,
  TmdbSearchPage,
  TmdbSeasonMetadata,
  TmdbSeasonSummary,
  TmdbSeriesMetadata,
  TmdbTrailer,
  TmdbTvdbLookup,
} from "@/application/dto/tmdb-metadata";
import { tmdbImageUrl } from "@/lib/tmdb-image";
import { TMDB_PRINCIPAL_CAST_LIMIT } from "./config";
import type {
  TmdbRawCredits,
  TmdbRawEpisode,
  TmdbRawFindResponse,
  TmdbRawMovie,
  TmdbRawPagedResponse,
  TmdbRawSearchResult,
  TmdbRawSeason,
  TmdbRawSeasonSummary,
  TmdbRawSeries,
  TmdbRawVideo,
  TmdbRawVideos,
} from "./raw";

function cleanText(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function yearFromDate(value: string | null | undefined): number | null {
  const date = cleanText(value);
  if (!date || date.length < 4) return null;
  const year = Number(date.slice(0, 4));
  return Number.isInteger(year) && year >= 1900 && year <= 2100 ? year : null;
}

function positiveInt(value: number | null | undefined): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }
  return Math.round(value);
}

function genresOf(raw: { genres?: Array<{ id: number; name: string }> }) {
  return (raw.genres ?? [])
    .filter((genre) => typeof genre.id === "number" && cleanText(genre.name))
    .map((genre) => ({ id: genre.id, name: genre.name.trim() }));
}

function countriesOf(
  productionCountries: Array<{ name?: string; iso_3166_1?: string }> | undefined,
  originCountry?: string[],
): string[] {
  const fromProduction = (productionCountries ?? [])
    .map((country) => cleanText(country.name) ?? cleanText(country.iso_3166_1))
    .filter((value): value is string => Boolean(value));
  if (fromProduction.length > 0) return [...new Set(fromProduction)];
  return [...new Set((originCountry ?? []).map((code) => code.trim()).filter(Boolean))];
}

function languagesOf(
  spoken: Array<{ english_name?: string; name?: string; iso_639_1?: string }> | undefined,
  originalLanguage: string | null | undefined,
): string[] {
  const spokenNames = (spoken ?? [])
    .map(
      (language) =>
        cleanText(language.english_name) ??
        cleanText(language.name) ??
        cleanText(language.iso_639_1),
    )
    .filter((value): value is string => Boolean(value));
  if (spokenNames.length > 0) return [...new Set(spokenNames)];
  const original = cleanText(originalLanguage);
  return original ? [original] : [];
}

function uniquePeople(people: TmdbPersonCredit[]): TmdbPersonCredit[] {
  const seen = new Set<string>();
  const result: TmdbPersonCredit[] = [];
  for (const person of people) {
    const key = `${person.id}:${person.role}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(person);
  }
  return result;
}

function crewByJobs(
  credits: TmdbRawCredits | undefined,
  jobs: readonly string[],
): TmdbPersonCredit[] {
  const wanted = new Set(jobs.map((job) => job.toLowerCase()));
  const people = (credits?.crew ?? [])
    .filter((member) => member.job && wanted.has(member.job.toLowerCase()))
    .map((member) => ({
      id: member.id,
      name: member.name,
      role: member.job ?? "",
      profileUrl: tmdbImageUrl(member.profile_path, "w185"),
    }))
    .filter((member) => cleanText(member.name) && cleanText(member.role));
  return uniquePeople(people);
}

function principalCast(credits: TmdbRawCredits | undefined): TmdbPersonCredit[] {
  return [...(credits?.cast ?? [])]
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .slice(0, TMDB_PRINCIPAL_CAST_LIMIT)
    .map((member) => ({
      id: member.id,
      name: member.name,
      role: cleanText(member.character) ?? "",
      profileUrl: tmdbImageUrl(member.profile_path, "w185"),
    }))
    .filter((member) => cleanText(member.name));
}

function pickTrailer(videos: TmdbRawVideos | undefined): TmdbTrailer | null {
  const candidates = (videos?.results ?? []).filter(
    (video): video is TmdbRawVideo =>
      Boolean(video) &&
      video.site === "YouTube" &&
      video.type === "Trailer" &&
      typeof video.key === "string" &&
      video.key.length > 0,
  );
  if (candidates.length === 0) return null;

  const preferred =
    candidates.find((video) => video.official) ??
    candidates[0];

  return {
    key: preferred.key,
    name: cleanText(preferred.name) ?? "Trailer",
    site: "YouTube",
    official: Boolean(preferred.official),
    url: `https://www.youtube.com/watch?v=${preferred.key}`,
  };
}

function normalizeSearchHit(raw: TmdbRawSearchResult): TmdbSearchHit | null {
  if (typeof raw.id !== "number") return null;
  const title = cleanText(raw.title) ?? cleanText(raw.name);
  if (!title) return null;
  const releaseDate =
    cleanText(raw.release_date) ?? cleanText(raw.first_air_date);
  return {
    id: raw.id,
    title,
    originalTitle:
      cleanText(raw.original_title) ?? cleanText(raw.original_name),
    overview: cleanText(raw.overview),
    releaseDate,
    year: yearFromDate(releaseDate),
    posterUrl: tmdbImageUrl(raw.poster_path, "w342"),
  };
}

export function normalizeSearchPage(
  raw: TmdbRawPagedResponse<TmdbRawSearchResult>,
): TmdbSearchPage {
  return {
    page: raw.page || 1,
    totalPages: raw.total_pages || 0,
    totalResults: raw.total_results || 0,
    results: (raw.results ?? [])
      .map(normalizeSearchHit)
      .filter((hit): hit is TmdbSearchHit => hit !== null),
  };
}

export function normalizeMovie(raw: TmdbRawMovie): TmdbMovieMetadata {
  const title = cleanText(raw.title) ?? `Movie ${raw.id}`;
  const releaseDate = cleanText(raw.release_date);
  return {
    id: raw.id,
    title,
    originalTitle: cleanText(raw.original_title),
    overview: cleanText(raw.overview),
    releaseDate,
    year: yearFromDate(releaseDate),
    runtimeMinutes: positiveInt(raw.runtime),
    genres: genresOf(raw),
    countries: countriesOf(raw.production_countries),
    languages: languagesOf(raw.spoken_languages, raw.original_language),
    originalLanguage: cleanText(raw.original_language),
    posterUrl: tmdbImageUrl(raw.poster_path, "w500"),
    backdropUrl: tmdbImageUrl(raw.backdrop_path, "w780"),
    directors: crewByJobs(raw.credits, ["Director"]),
    writers: crewByJobs(raw.credits, ["Writer", "Screenplay", "Story"]),
    cast: principalCast(raw.credits),
    trailer: pickTrailer(raw.videos),
  };
}

function normalizeSeasonSummary(raw: TmdbRawSeasonSummary): TmdbSeasonSummary {
  return {
    id: raw.id,
    seasonNumber: raw.season_number,
    name: cleanText(raw.name) ?? `Season ${raw.season_number}`,
    episodeCount: positiveInt(raw.episode_count) ?? 0,
    airDate: cleanText(raw.air_date),
    posterUrl: tmdbImageUrl(raw.poster_path, "w342"),
    overview: cleanText(raw.overview),
  };
}

function averageRuntime(values: number[] | undefined): number | null {
  const valid = (values ?? []).filter((value) => value > 0);
  if (valid.length === 0) return null;
  return Math.round(valid.reduce((sum, value) => sum + value, 0) / valid.length);
}

export function normalizeSeries(raw: TmdbRawSeries): TmdbSeriesMetadata {
  const title = cleanText(raw.name) ?? `Series ${raw.id}`;
  const firstAirDate = cleanText(raw.first_air_date);
  const creators = (raw.created_by ?? []).map((person) => ({
    id: person.id,
    name: person.name,
    role: "Creator",
    profileUrl: tmdbImageUrl(person.profile_path, "w185"),
  }));

  return {
    id: raw.id,
    title,
    originalTitle: cleanText(raw.original_name),
    overview: cleanText(raw.overview),
    status: cleanText(raw.status),
    firstAirDate,
    lastAirDate: cleanText(raw.last_air_date),
    year: yearFromDate(firstAirDate),
    numberOfSeasons: positiveInt(raw.number_of_seasons),
    numberOfEpisodes: positiveInt(raw.number_of_episodes),
    episodeRuntimeMinutes: averageRuntime(raw.episode_run_time),
    genres: genresOf(raw),
    countries: countriesOf(raw.production_countries, raw.origin_country),
    languages: languagesOf(raw.spoken_languages, raw.original_language),
    originalLanguage: cleanText(raw.original_language),
    posterUrl: tmdbImageUrl(raw.poster_path, "w500"),
    backdropUrl: tmdbImageUrl(raw.backdrop_path, "w780"),
    seasons: (raw.seasons ?? [])
      .filter((season) => typeof season.season_number === "number")
      .map(normalizeSeasonSummary)
      .sort((a, b) => a.seasonNumber - b.seasonNumber),
    directors: uniquePeople([
      ...creators,
      ...crewByJobs(raw.credits, ["Director", "Series Director"]),
    ]),
    writers: crewByJobs(raw.credits, ["Writer", "Screenplay", "Story"]),
    cast: principalCast(raw.credits),
    trailer: pickTrailer(raw.videos),
  };
}

function normalizeEpisode(
  raw: TmdbRawEpisode,
  fallbackSeasonNumber: number,
): TmdbEpisodeMetadata {
  return {
    id: raw.id,
    seasonNumber: raw.season_number ?? fallbackSeasonNumber,
    episodeNumber: raw.episode_number,
    title: cleanText(raw.name) ?? `Episode ${raw.episode_number}`,
    overview: cleanText(raw.overview),
    airDate: cleanText(raw.air_date),
    runtimeMinutes: positiveInt(raw.runtime),
    stillUrl: tmdbImageUrl(raw.still_path, "w500"),
  };
}

export function normalizeSeason(
  raw: TmdbRawSeason,
  seriesId: number,
): TmdbSeasonMetadata {
  return {
    id: raw.id,
    seriesId,
    seasonNumber: raw.season_number,
    name: cleanText(raw.name) ?? `Season ${raw.season_number}`,
    overview: cleanText(raw.overview),
    airDate: cleanText(raw.air_date),
    posterUrl: tmdbImageUrl(raw.poster_path, "w342"),
    episodes: (raw.episodes ?? [])
      .filter((episode) => typeof episode.episode_number === "number")
      .map((episode) => normalizeEpisode(episode, raw.season_number))
      .sort((a, b) => a.episodeNumber - b.episodeNumber),
  };
}

export function normalizeTvdbLookup(
  raw: TmdbRawFindResponse,
): TmdbTvdbLookup | null {
  const match = raw.tv_results?.[0];
  if (!match || typeof match.id !== "number") return null;
  const title = cleanText(match.name);
  if (!title) return null;
  return { tmdbId: match.id, title };
}
