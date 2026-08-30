import type { ReviewMedium } from "@/application/repositories/review-repository";
import { copyFor } from "@/content/copy/for-locale";
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
  const states = copyFor(locale).states;
  return pageMetadata({
    title: states.notFound.title,
    description: states.notFound.description,
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
    languages: reviewLanguageAlternates(medium, detail.slug),
  });
}
