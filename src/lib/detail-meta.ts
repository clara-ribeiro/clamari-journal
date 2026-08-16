import { reviewContentCopy } from "@/content/copy/review-content";
import {
  META_DESCRIPTION_MAX,
  reviewExcerpt,
  truncateText,
} from "@/lib/plain-text";

export type DetailMetaCopy = {
  descriptionFallback: string;
  descriptionFromSynopsis: string;
};

export type DetailMetaInput = {
  title: string;
  synopsis: string | null;
  reviewHtml: string | null;
  copy: DetailMetaCopy;
};

export type DetailMeta = {
  metaTitle: string;
  metaDescription: string;
};

/**
 * Titles and descriptions for detail pages. A published review (non-empty HTML)
 * is called out in the title; the description prefers a spoiler-free excerpt.
 * Pending slugs with no file keep the work title and synopsis fallback.
 */
export function buildDetailMeta(input: DetailMetaInput): DetailMeta {
  const publishedReview = Boolean(input.reviewHtml?.trim());
  const excerpt = input.reviewHtml ? reviewExcerpt(input.reviewHtml) : null;

  const metaTitle = publishedReview
    ? reviewContentCopy.seo.titleWithReview.replace("{title}", input.title)
    : input.title;

  const descriptionSource = excerpt
    ? reviewContentCopy.seo.descriptionFromReview.replace("{excerpt}", excerpt)
    : input.synopsis
      ? input.copy.descriptionFromSynopsis.replace("{synopsis}", input.synopsis)
      : input.copy.descriptionFallback.replace("{title}", input.title);

  return {
    metaTitle,
    metaDescription: truncateText(descriptionSource, META_DESCRIPTION_MAX),
  };
}
