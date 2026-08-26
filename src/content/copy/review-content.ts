export const reviewContentCopy = {
  spoilerSummary: "Spoilers",
  seo: {
    titleWithReview: "{title} review",
    descriptionFromReview: "A personal review of {title}. {excerpt}",
  },
} as const;

export type ReviewContentCopy = typeof reviewContentCopy;
