import type { ReviewLocale } from "@/lib/review-locale";

export type ReviewMedium = "films" | "series" | "books";

/** Compiled, sanitized review ready for the detail template. */
export type ReviewDocument = {
  medium: ReviewMedium;
  slug: string;
  locale: ReviewLocale;
  html: string;
  /** Localized work title from review front matter, when present. */
  workTitle: string | null;
};

export interface ReviewRepository {
  findByMediumAndSlug(
    medium: ReviewMedium,
    slug: string,
    locale?: ReviewLocale,
  ): ReviewDocument | undefined;
}
