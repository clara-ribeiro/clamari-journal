export const favoritesCopy = {
  titleId: "favorites-page-heading",
  title: "Favorites",
  description: "Movies, series, and books marked as favorites.",
  backLabel: "Back to home",
  listAriaLabel: "Favorite journal entries",
  empty: "No favorites yet.",
} as const satisfies import("./types").CatalogCopy;

export type FavoritesCopy = typeof favoritesCopy;
