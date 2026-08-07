/** Pure URL helper — safe to use from server use-cases without the TMDB API client. */

export type TmdbImageSize = "w185" | "w342" | "w500" | "w780" | "original";

const TMDB_HOST = "https://image.tmdb.org/t/p/";

export function tmdbImageUrl(
  path: string | null | undefined,
  size: TmdbImageSize = "w500",
): string | null {
  if (!path) return null;
  return `${TMDB_HOST}${size}${path}`;
}

export function isTmdbImageUrl(src: string): boolean {
  return src.startsWith(TMDB_HOST) || src.startsWith("https://image.tmdb.org/");
}

function tmdbPosterPath(src: string): string | null {
  const match = /^https:\/\/image\.tmdb\.org\/t\/p\/[^/]+(\/.+)$/.exec(src);
  return match?.[1] ?? null;
}

function tmdbSizeForWidth(width: number): TmdbImageSize {
  if (width <= 185) return "w185";
  // Prefer w342 for card posters (display ~140–230px × DPR often lands ≤400)
  if (width <= 400) return "w342";
  if (width <= 500) return "w500";
  if (width <= 780) return "w780";
  return "original";
}

/**
 * next/image loader that hits the TMDB CDN directly.
 * Avoids `/_next/image` proxy timeouts when the optimizer fetches remote posters.
 *
 * Appends `?w=` so the returned URL always differs from `src` — Next warns when a
 * custom loader echoes `src` unchanged ("does not implement width").
 */
export function tmdbImageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
}): string {
  const path = tmdbPosterPath(src);
  if (!path) return src;
  return `${TMDB_HOST}${tmdbSizeForWidth(width)}${path}?w=${width}`;
}
