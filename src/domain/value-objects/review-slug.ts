/** Kebab-case slugs used as review filenames (`hereditary`, `the-wire`). */
const REVIEW_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isReviewSlug(value: string): boolean {
  return REVIEW_SLUG_PATTERN.test(value);
}
