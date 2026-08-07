export const favoritesCopy = {
  titleId: "favorites-page-heading",
  title: "Favorites",
  description: "Films, series, and books marked as favorites.",
  listAriaLabel: "Favorite journal entries",
  empty: "No favorites yet.",
} as const satisfies import("./types").CatalogCopy;

export type FavoritesCopy = typeof favoritesCopy;
