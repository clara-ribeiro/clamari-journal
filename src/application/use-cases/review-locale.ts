import type { ReviewMedium } from "@/application/repositories/review-repository";
import type { ReviewLocaleFields } from "@/application/dto";
import { reviewLocaleCopy } from "@/content/copy/review-content";
import {
  DEFAULT_REVIEW_LOCALE,
  otherReviewLocale,
  reviewPagePath,
  type ReviewLocale,
} from "@/lib/review-locale";
import { getReview, hasPublishedReview } from "./reviews";

export type DetailLocaleContext = ReviewLocaleFields & {
  locale: ReviewLocale;
  workTitle: string | null;
  reviewHtml: string | null;
  seoCopy: (typeof reviewLocaleCopy)[ReviewLocale]["seo"];
};

/**
 * Resolve essay + chrome for this locale. Portuguese pages always exist
 * (pending copy when `.pt.md` is missing); English never 404s for a
 * missing review file either.
 */
export function resolveDetailLocale(
  medium: ReviewMedium,
  catalogSlug: string,
  reviewSlug: string | null | undefined,
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): DetailLocaleContext {
  const review = getReview(medium, reviewSlug, locale);
  const copy = reviewLocaleCopy[locale];
  const other = otherReviewLocale(locale);
  const hasAlternateEssay = hasPublishedReview(medium, reviewSlug, other);

  return {
    locale,
    workTitle: review?.workTitle ?? null,
    reviewHtml: review?.html ?? null,
    reviewLocale: locale,
    reviewHeading: copy.reviewHeading,
    alternateReviewHref: hasAlternateEssay
      ? reviewPagePath(medium, catalogSlug, other)
      : null,
    alternateReviewLabel: hasAlternateEssay ? copy.switchToLabel : null,
    seoCopy: copy.seo,
  };
}

export function defaultDetailLocale(): DetailLocaleContext {
  return resolveDetailLocale("films", "", null, DEFAULT_REVIEW_LOCALE);
}
