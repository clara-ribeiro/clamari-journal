import type { ReviewMedium } from "@/application/repositories/review-repository";
import { copyFor } from "@/content/copy/for-locale";
import {
  DEFAULT_REVIEW_LOCALE,
  reviewPagePath,
  type ReviewLocale,
} from "@/lib/review-locale";
import { getReview, hasPublishedReview } from "./reviews";

export function catalogCopyFor(
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
) {
  return copyFor(locale).catalog;
}

export function localizedWorkTitle(
  medium: ReviewMedium,
  reviewSlug: string | null | undefined,
  fallback: string,
  locale: ReviewLocale,
): string {
  if (locale !== "pt-BR" || !reviewSlug) return fallback;
  return getReview(medium, reviewSlug, locale)?.workTitle?.trim() || fallback;
}

export function catalogHasReview(
  medium: ReviewMedium,
  reviewSlug: string | null | undefined,
  locale: ReviewLocale,
): boolean {
  if (locale === "pt-BR") {
    return hasPublishedReview(medium, reviewSlug, "pt-BR");
  }
  return Boolean(reviewSlug);
}

export function catalogHref(
  medium: ReviewMedium,
  slug: string,
  locale: ReviewLocale,
): string {
  return reviewPagePath(medium, slug, locale);
}
