import type { CatalogCardItem } from "@/application/dto";
import { listBookCatalogItems } from "./books";
import { listMovieCatalogItems } from "./movies";
import { listSeriesCatalogItems } from "./series";

function compareDateNewest(a: CatalogCardItem, b: CatalogCardItem) {
  return (b.sortDate ?? "").localeCompare(a.sortDate ?? "");
}

/** All media as catalog cards, newest activity first. */
export function listMixedCatalogItems(): CatalogCardItem[] {
  return [
    ...listMovieCatalogItems(),
    ...listSeriesCatalogItems(),
    ...listBookCatalogItems(),
  ].sort(compareDateNewest);
}

/** Favorited entries across media, newest activity first. */
export function listFavoriteCatalogItems(): CatalogCardItem[] {
  return listMixedCatalogItems().filter((item) => item.favorite);
}

/** Entries with a review across media, newest activity first. */
export function listReviewCatalogItems(): CatalogCardItem[] {
  return listMixedCatalogItems().filter((item) => item.hasReview);
}
