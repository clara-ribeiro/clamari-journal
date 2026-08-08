export const allEntriesCopy = {
  titleId: "all-entries-heading",
  title: "All Entries",
  description:
    "Every film, series, and book in the journal, newest first. Status filters only match entries that use that status on their medium.",
  listAriaLabel: "All journal entries",
  empty: "No entries yet.",
  noResults: "No entries match these filters.",
  summaryOne: "{total} entry",
  summary: "{total} entries",
} as const satisfies import("./types").CatalogCopy;

export type AllEntriesCopy = typeof allEntriesCopy;
