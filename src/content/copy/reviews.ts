export const reviewsCopy = {
  titleId: "reviews-page-heading",
  title: "Reviews",
  description:
    "Films, series, and books with a written review. Status filters only match entries that use that status on their medium.",
  listAriaLabel: "Journal entries with reviews",
  empty: "No reviews yet.",
  noResults: "No reviews match these filters.",
  summaryOne: "{total} review",
  summary: "{total} reviews",
} as const satisfies import("./types").CatalogCopy;

export type ReviewsCopy = typeof reviewsCopy;
