import type { CatalogCardItem } from "@/application/dto";
import { foldSearchText } from "@/lib/search-text";

export type CatalogSortId =
  | "default"
  | "titleAsc"
  | "titleDesc"
  | "dateNewest"
  | "dateOldest"
  | "yearNewest"
  | "yearOldest"
  | "ratingHigh"
  | "ratingLow";

export type CatalogItemFilters = {
  search?: string;
  statusFilter?: string;
  yearFilter?: number | null;
  reviewActive?: boolean;
  favoriteActive?: boolean;
};

function compareDateNewest(a: CatalogCardItem, b: CatalogCardItem) {
  return (b.sortDate ?? "").localeCompare(a.sortDate ?? "");
}

function compareYearNewest(a: CatalogCardItem, b: CatalogCardItem) {
  return (b.sortYear ?? -1) - (a.sortYear ?? -1);
}

export function filterCatalogItems(
  items: readonly CatalogCardItem[],
  filters: CatalogItemFilters = {},
): CatalogCardItem[] {
  const {
    search = "",
    statusFilter = "",
    yearFilter = null,
    reviewActive = false,
    favoriteActive = false,
  } = filters;
  const query = foldSearchText(search.trim());

  return items.filter((item) => {
    if (statusFilter && item.statusKey !== statusFilter) return false;
    if (yearFilter != null && !item.goalYears.includes(yearFilter)) {
      return false;
    }
    if (reviewActive || favoriteActive) {
      const matchesReview = reviewActive && item.hasReview;
      const matchesFavorite = favoriteActive && item.favorite;
      if (!matchesReview && !matchesFavorite) return false;
    }
    if (!query) return true;
    return foldSearchText(item.title).includes(query);
  });
}

export function sortCatalogItems(
  items: readonly CatalogCardItem[],
  sort: CatalogSortId,
): CatalogCardItem[] {
  const next = [...items];
  next.sort((a, b) => {
    switch (sort) {
      case "default":
      case "dateNewest":
        return compareDateNewest(a, b);
      case "titleAsc":
        return a.sortTitle.localeCompare(b.sortTitle);
      case "titleDesc":
        return b.sortTitle.localeCompare(a.sortTitle);
      case "dateOldest":
        return (a.sortDate ?? "").localeCompare(b.sortDate ?? "");
      case "yearNewest":
        return compareYearNewest(a, b);
      case "yearOldest":
        return (
          (a.sortYear ?? Number.MAX_SAFE_INTEGER) -
          (b.sortYear ?? Number.MAX_SAFE_INTEGER)
        );
      case "ratingHigh":
        return b.sortRating - a.sortRating;
      case "ratingLow":
        return a.sortRating - b.sortRating;
      default:
        return 0;
    }
  });
  return next;
}

export function selectCatalogItems(
  items: readonly CatalogCardItem[],
  filters: CatalogItemFilters,
  sort: CatalogSortId,
): CatalogCardItem[] {
  return sortCatalogItems(filterCatalogItems(items, filters), sort);
}
