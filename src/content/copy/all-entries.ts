export const allEntriesCopy = {
  titleId: "all-entries-heading",
  title: "All Entries",
  description: "Every movie, series, and book in the journal, newest first.",
  backLabel: "Back to home",
  listAriaLabel: "All journal entries",
  empty: "No entries yet.",
} as const satisfies import("./types").CatalogCopy;

export type AllEntriesCopy = typeof allEntriesCopy;
