import type { ReviewMedium } from "@/application/repositories/review-repository";

export const REVIEW_LOCALES = ["en", "pt-BR"] as const;

export type ReviewLocale = (typeof REVIEW_LOCALES)[number];

export const DEFAULT_REVIEW_LOCALE: ReviewLocale = "en";

/** URL prefix for Portuguese pages. */
export const PT_PATH_PREFIX = "/pt";

export const INDEXABLE_STATIC_PATHS = [
  "/",
  "/films",
  "/series",
  "/books",
  "/stats",
  "/all-entries",
  "/favorites",
  "/reviews",
] as const;

export function isReviewLocale(value: string): value is ReviewLocale {
  return (REVIEW_LOCALES as readonly string[]).includes(value);
}

export function htmlLang(locale: ReviewLocale): string {
  return locale === "pt-BR" ? "pt-BR" : "en";
}

export function ogLocale(locale: ReviewLocale): "en_US" | "pt_BR" {
  return locale === "pt-BR" ? "pt_BR" : "en_US";
}

export function ogAlternateLocale(locale: ReviewLocale): "en_US" | "pt_BR" {
  return locale === "pt-BR" ? "en_US" : "pt_BR";
}

export function hreflang(locale: ReviewLocale): string {
  return locale;
}

/** TMDB `language` for localized titles / synopses on a review page. */
export function tmdbLanguageForLocale(locale: ReviewLocale): string {
  return locale === "pt-BR" ? "pt-BR" : "en-US";
}

export function reviewFileName(slug: string, locale: ReviewLocale): string {
  return locale === "pt-BR" ? `${slug}.pt.md` : `${slug}.md`;
}

export function reviewPagePath(
  medium: ReviewMedium,
  slug: string,
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): string {
  return locale === "pt-BR" ? `/pt/${medium}/${slug}` : `/${medium}/${slug}`;
}

export function otherReviewLocale(locale: ReviewLocale): ReviewLocale {
  return locale === "pt-BR" ? "en" : "pt-BR";
}

export function localeFromPathname(pathname: string): ReviewLocale {
  if (
    pathname === PT_PATH_PREFIX ||
    pathname.startsWith(`${PT_PATH_PREFIX}/`)
  ) {
    return "pt-BR";
  }
  return "en";
}

export function stripLocalePrefix(pathname: string): string {
  if (pathname === PT_PATH_PREFIX || pathname === `${PT_PATH_PREFIX}/`) {
    return "/";
  }
  if (pathname.startsWith(`${PT_PATH_PREFIX}/`)) {
    const rest = pathname.slice(PT_PATH_PREFIX.length);
    return rest.length > 0 ? rest : "/";
  }
  return pathname || "/";
}

export function pathForLocale(
  pathname: string,
  locale: ReviewLocale,
): string {
  const canonical = stripLocalePrefix(pathname);
  if (locale === "en") return canonical;
  return canonical === "/" ? PT_PATH_PREFIX : `${PT_PATH_PREFIX}${canonical}`;
}

/** Intl locale tag for dates and number formatting. */
export function intlLocale(locale: ReviewLocale): string {
  return locale === "pt-BR" ? "pt-BR" : "en-US";
}

/**
 * Reciprocal hreflang map for any public path. English stays x-default
 * so unprefixed URLs remain the fallback for unknown languages.
 */
export function languageAlternates(pathname: string): Record<string, string> {
  const canonical = stripLocalePrefix(pathname);
  return {
    en: pathForLocale(canonical, "en"),
    "pt-BR": pathForLocale(canonical, "pt-BR"),
    "x-default": pathForLocale(canonical, "en"),
  };
}

/** hreflang map for a film/series/book detail. English is x-default. */
export function reviewLanguageAlternates(
  medium: ReviewMedium,
  slug: string,
): Record<string, string> {
  return languageAlternates(reviewPagePath(medium, slug, "en"));
}

/** Keep catalog filters when switching locale. */
export function pathForLocaleWithSearch(
  pathname: string,
  locale: ReviewLocale,
  search?: string | null,
): string {
  const path = pathForLocale(pathname, locale);
  if (!search) return path;
  return `${path}?${search}`;
}
