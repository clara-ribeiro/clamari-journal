import type { ReviewMedium } from "@/application/repositories/review-repository";
import { statesCopy } from "@/content/copy/states";
import { detailPageMetadata, pageMetadata } from "@/lib/page-metadata";
import { reviewStillMetadata } from "@/lib/review-images";
import {
  reviewLanguageAlternates,
  reviewPagePath,
  type ReviewLocale,
} from "@/lib/review-locale";

export type ReviewDetailMetaSource = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  imageUrl: string | null;
  reviewHtml: string | null;
  reviewLocale: ReviewLocale;
  alternateReviewHref: string | null;
};

export function missingDetailMetadata(
  medium: ReviewMedium,
  slug: string,
  locale: ReviewLocale,
) {
  return pageMetadata({
    title: statesCopy.notFound.title,
    description: statesCopy.notFound.description,
    path: reviewPagePath(medium, slug, locale),
    index: false,
    locale,
  });
}

export function reviewDetailMetadata(
  medium: ReviewMedium,
  detail: ReviewDetailMetaSource,
) {
  return detailPageMetadata({
    title: detail.metaTitle,
    description: detail.metaDescription,
    path: reviewPagePath(medium, detail.slug, detail.reviewLocale),
    imageUrl: detail.imageUrl,
    extraImages: reviewStillMetadata(detail.reviewHtml),
    hasReview: Boolean(detail.reviewHtml?.trim()),
    locale: detail.reviewLocale,
    languages: detail.alternateReviewHref
      ? reviewLanguageAlternates(medium, detail.slug)
      : undefined,
  });
}
