import type { CatalogCardItem } from "@/application/dto";
import {
  DEFAULT_REVIEW_LOCALE,
  type ReviewLocale,
} from "@/lib/review-locale";
import { listBookCatalogItems } from "./books";
import { listMovieCatalogItems } from "./movies";
import { listSeriesCatalogItems } from "./series";

function compareDateNewest(a: CatalogCardItem, b: CatalogCardItem) {
  return (b.sortDate ?? "").localeCompare(a.sortDate ?? "");
}

/** All media as catalog cards, newest activity first. */
export function listMixedCatalogItems(
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): CatalogCardItem[] {
  return [
    ...listMovieCatalogItems(locale),
    ...listSeriesCatalogItems(locale),
    ...listBookCatalogItems(locale),
  ].sort(compareDateNewest);
}

/** Favorited entries across media, newest activity first. */
export function listFavoriteCatalogItems(
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): CatalogCardItem[] {
  return listMixedCatalogItems(locale).filter((item) => item.favorite);
}

/** Entries with a review in this locale, newest activity first. */
export function listReviewCatalogItems(
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): CatalogCardItem[] {
  return listMixedCatalogItems(locale).filter((item) => item.hasReview);
}
