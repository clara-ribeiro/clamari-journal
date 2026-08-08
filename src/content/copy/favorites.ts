export const favoritesCopy = {
  titleId: "favorites-page-heading",
  title: "Favorites",
  description:
    "Films, series, and books marked as favorites. Status filters only match entries that use that status on their medium.",
  listAriaLabel: "Favorite journal entries",
  empty: "No favorites yet.",
  noResults: "No favorites match these filters.",
  summaryOne: "{total} favorite",
  summary: "{total} favorites",
} as const satisfies import("./types").CatalogCopy;

export type FavoritesCopy = typeof favoritesCopy;
