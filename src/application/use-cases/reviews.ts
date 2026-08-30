import { reviewRepository } from "@/composition/repositories";
import type {
  ReviewDocument,
  ReviewMedium,
} from "@/application/repositories/review-repository";
import {
  DEFAULT_REVIEW_LOCALE,
  type ReviewLocale,
} from "@/lib/review-locale";

export function getReview(
  medium: ReviewMedium,
  reviewSlug: string | null | undefined,
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): ReviewDocument | undefined {
  if (!reviewSlug) return undefined;
  return reviewRepository.findByMediumAndSlug(medium, reviewSlug, locale);
}

export function getReviewHtml(
  medium: ReviewMedium,
  reviewSlug: string | null | undefined,
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): string | null {
  return getReview(medium, reviewSlug, locale)?.html ?? null;
}

export function hasPublishedReview(
  medium: ReviewMedium,
  reviewSlug: string | null | undefined,
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): boolean {
  return Boolean(getReviewHtml(medium, reviewSlug, locale)?.trim());
}
