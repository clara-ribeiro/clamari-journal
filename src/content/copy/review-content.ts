export const reviewContentCopy = {
  spoilerSummary: "Spoilers",
  seo: {
    titleWithReview: "{title} review",
    descriptionFromReview: "{excerpt}",
  },
} as const;

export type ReviewContentCopy = typeof reviewContentCopy;
