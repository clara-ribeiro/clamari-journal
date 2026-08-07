export const allEntriesCopy = {
  titleId: "all-entries-heading",
  title: "All Entries",
  description: "Every film, series, and book in the journal, newest first.",
  listAriaLabel: "All journal entries",
  empty: "No entries yet.",
} as const satisfies import("./types").CatalogCopy;

export type AllEntriesCopy = typeof allEntriesCopy;
