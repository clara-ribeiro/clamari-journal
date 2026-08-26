import { describe, expect, it } from "vitest";
import type { CatalogCardItem } from "@/application/dto";
import {
  filterCatalogItems,
  selectCatalogItems,
  sortCatalogItems,
} from "./catalog-items";

function card(
  overrides: Partial<CatalogCardItem> & Pick<CatalogCardItem, "slug" | "title">,
): CatalogCardItem {
  return {
    medium: "movie",
    href: `/films/${overrides.slug}`,
    posterUrl: null,
    statusKey: "watched",
    statusLabel: "Watched",
    statusTone: "positive",
    yearLabel: null,
    activityLabel: "No date logged",
    rating: undefined,
    sortTitle: overrides.title.toLowerCase(),
    sortDate: null,
    sortYear: null,
    sortRating: 0,
    goalYears: [],
    favorite: false,
    favoriteLabel: "Favorite",
    hasReview: false,
    reviewLabel: "With review",
    metaTags: [],
    watchedEpisodeCount: 0,
    ...overrides,
  };
}

const heat = card({
  slug: "heat",
  title: "Heat",
  sortTitle: "heat",
  statusKey: "watched",
  sortDate: "2024-06-01",
  sortYear: 1995,
  sortRating: 5,
  goalYears: [2024],
  favorite: true,
  hasReview: true,
});

const alien = card({
  slug: "alien",
  title: "Alien",
  sortTitle: "alien",
  statusKey: "watchlist",
  sortDate: "2023-01-01",
  sortYear: 1979,
  sortRating: 4,
  goalYears: [2023],
});

const zodiac = card({
  slug: "zodiac",
  title: "Zodiac",
  sortTitle: "zodiac",
  statusKey: "watched",
  sortDate: "2025-03-01",
  sortYear: 2007,
  sortRating: 3,
  goalYears: [2025],
  hasReview: true,
});

describe("filterCatalogItems", () => {
  const items = [heat, alien, zodiac];

  it("filters by status, year, review, favorite, and search", () => {
    expect(
      filterCatalogItems(items, { statusFilter: "watchlist" }).map((i) => i.slug),
    ).toEqual(["alien"]);
    expect(
      filterCatalogItems(items, { yearFilter: 2024 }).map((i) => i.slug),
    ).toEqual(["heat"]);
    expect(
      filterCatalogItems(items, { reviewActive: true }).map((i) => i.slug),
    ).toEqual(["heat", "zodiac"]);
    expect(
      filterCatalogItems(items, { favoriteActive: true }).map((i) => i.slug),
    ).toEqual(["heat"]);
    expect(
      filterCatalogItems(items, { search: "ALI" }).map((i) => i.slug),
    ).toEqual(["alien"]);
    expect(
      filterCatalogItems(items, {
        statusFilter: "watched",
        yearFilter: 2024,
        search: "heat",
      }).map((i) => i.slug),
    ).toEqual(["heat"]);
  });

  it("returns every item when filters are empty", () => {
    expect(filterCatalogItems(items).map((i) => i.slug)).toEqual([
      "heat",
      "alien",
      "zodiac",
    ]);
  });

  it("ORs review and favorite when both toggles are on", () => {
    expect(
      filterCatalogItems(items, {
        reviewActive: true,
        favoriteActive: true,
      }).map((i) => i.slug),
    ).toEqual(["heat", "zodiac"]);
  });
});

describe("sortCatalogItems", () => {
  const items = [heat, alien, zodiac];

  it("sorts by title, date, year, and rating", () => {
    expect(sortCatalogItems(items, "titleAsc").map((i) => i.slug)).toEqual([
      "alien",
      "heat",
      "zodiac",
    ]);
    expect(sortCatalogItems(items, "dateNewest").map((i) => i.slug)).toEqual([
      "zodiac",
      "heat",
      "alien",
    ]);
    expect(sortCatalogItems(items, "yearOldest").map((i) => i.slug)).toEqual([
      "alien",
      "heat",
      "zodiac",
    ]);
    expect(sortCatalogItems(items, "ratingHigh").map((i) => i.slug)).toEqual([
      "heat",
      "alien",
      "zodiac",
    ]);
    expect(sortCatalogItems(items, "titleDesc").map((i) => i.slug)).toEqual([
      "zodiac",
      "heat",
      "alien",
    ]);
    expect(sortCatalogItems(items, "dateOldest").map((i) => i.slug)).toEqual([
      "alien",
      "heat",
      "zodiac",
    ]);
    expect(sortCatalogItems(items, "yearNewest").map((i) => i.slug)).toEqual([
      "zodiac",
      "heat",
      "alien",
    ]);
    expect(sortCatalogItems(items, "ratingLow").map((i) => i.slug)).toEqual([
      "zodiac",
      "alien",
      "heat",
    ]);
    expect(sortCatalogItems(items, "default").map((i) => i.slug)).toEqual(
      sortCatalogItems(items, "dateNewest").map((i) => i.slug),
    );
  });

  it("treats missing dates and years as oldest when sorting newest-first", () => {
    const undated = card({
      slug: "undated",
      title: "Undated",
      sortDate: null,
      sortYear: null,
    });
    expect(
      sortCatalogItems([undated, heat], "dateNewest").map((i) => i.slug),
    ).toEqual(["heat", "undated"]);
    expect(
      sortCatalogItems([undated, heat], "yearNewest").map((i) => i.slug),
    ).toEqual(["heat", "undated"]);
  });
});

describe("selectCatalogItems", () => {
  it("filters then sorts", () => {
    expect(
      selectCatalogItems(
        [heat, alien, zodiac],
        { statusFilter: "watched" },
        "titleAsc",
      ).map((i) => i.slug),
    ).toEqual(["heat", "zodiac"]);
  });
});
