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
 * Resolve the essay for this locale. Portuguese pages only exist when a
 * compiled `.pt.md` sibling is present; English pages still render without
 * a review file.
 */
export function resolveDetailLocale(
  medium: ReviewMedium,
  catalogSlug: string,
  reviewSlug: string | null | undefined,
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): DetailLocaleContext | null {
  const review = getReview(medium, reviewSlug, locale);
  if (locale === "pt-BR" && !review?.html?.trim()) return null;

  const copy = reviewLocaleCopy[locale];
  const other = otherReviewLocale(locale);
  const hasAlternate = hasPublishedReview(medium, reviewSlug, other);

  return {
    locale,
    workTitle: review?.workTitle ?? null,
    reviewHtml: review?.html ?? null,
    reviewLocale: locale,
    reviewHeading: copy.reviewHeading,
    alternateReviewHref: hasAlternate
      ? reviewPagePath(medium, catalogSlug, other)
      : null,
    alternateReviewLabel: hasAlternate ? copy.switchToLabel : null,
    seoCopy: copy.seo,
  };
}

export function defaultDetailLocale(): DetailLocaleContext {
  const copy = reviewLocaleCopy[DEFAULT_REVIEW_LOCALE];
  return {
    locale: DEFAULT_REVIEW_LOCALE,
    workTitle: null,
    reviewHtml: null,
    reviewLocale: DEFAULT_REVIEW_LOCALE,
    reviewHeading: copy.reviewHeading,
    alternateReviewHref: null,
    alternateReviewLabel: null,
    seoCopy: copy.seo,
  };
}
