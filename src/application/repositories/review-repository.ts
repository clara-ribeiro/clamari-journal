export type ReviewMedium = "films" | "series" | "books";

/** Compiled, sanitized review ready for the detail template. */
export type ReviewDocument = {
  medium: ReviewMedium;
  slug: string;
  html: string;
};

export interface ReviewRepository {
  findByMediumAndSlug(
    medium: ReviewMedium,
    slug: string,
  ): ReviewDocument | undefined;
}
