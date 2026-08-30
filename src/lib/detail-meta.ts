import { reviewContentCopy } from "@/content/copy/review-content";
import type { ReviewSeoCopy } from "@/content/copy/review-content";
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
  year?: string | null;
  synopsis: string | null;
  reviewHtml: string | null;
  copy: DetailMetaCopy;
  seoCopy?: ReviewSeoCopy;
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
function workTitle(title: string, year?: string | null): string {
  const yearLabel = year?.trim();
  if (yearLabel && /^\d{4}$/.test(yearLabel)) {
    return `${title} (${yearLabel})`;
  }
  return title;
}

export function buildDetailMeta(input: DetailMetaInput): DetailMeta {
  const publishedReview = Boolean(input.reviewHtml?.trim());
  const excerpt = input.reviewHtml ? reviewExcerpt(input.reviewHtml) : null;
  const reviewedAs = workTitle(input.title, input.year);
  const seo = input.seoCopy ?? reviewContentCopy.seo;

  const metaTitle = publishedReview
    ? seo.titleWithReview.replace("{title}", reviewedAs)
    : input.title;

  const descriptionSource = excerpt
    ? seo.descriptionFromReview
        .replace("{title}", reviewedAs)
        .replace("{excerpt}", excerpt)
    : input.synopsis
      ? input.copy.descriptionFromSynopsis.replace("{synopsis}", input.synopsis)
      : input.copy.descriptionFallback.replace("{title}", input.title);

  return {
    metaTitle,
    metaDescription: truncateText(descriptionSource, META_DESCRIPTION_MAX),
  };
}
