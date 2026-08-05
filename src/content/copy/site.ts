export const siteCopy = {
  brand: {
    name: "CLAMARI",
    product: "Journal",
    fullName: "CLAMARI Journal",
  },
  metadata: {
    titleDefault: "clamari journal",
    titleTemplate: "%s · clamari journal",
    description:
      "A personal diary to track stories I've watched, followed, and read over time.",
    author: "Clara",
  },
  a11y: {
    skipToContent: "Skip to content",
    mainContentId: "main-content",
  },
} as const;

export type SiteCopy = typeof siteCopy;
