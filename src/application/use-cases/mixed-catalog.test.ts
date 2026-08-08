import { describe, expect, it } from "vitest";
import {
  listFavoriteCatalogItems,
  listMixedCatalogItems,
  listReviewCatalogItems,
} from "./mixed-catalog";

describe("mixed catalog feeds", () => {
  it("lists mixed items with medium and newest-first ordering", () => {
    const items = listMixedCatalogItems();
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toMatchObject({
      medium: expect.stringMatching(/^(movie|series|book)$/),
      slug: expect.any(String),
      href: expect.stringMatching(/^\//),
      statusKey: expect.any(String),
    });

    for (let i = 1; i < Math.min(items.length, 20); i++) {
      const prev = items[i - 1]?.sortDate ?? "";
      const curr = items[i]?.sortDate ?? "";
      expect(prev >= curr).toBe(true);
    }
  });

  it("filters favorites and reviews", () => {
    const favorites = listFavoriteCatalogItems();
    const reviews = listReviewCatalogItems();

    expect(favorites.every((item) => item.favorite)).toBe(true);
    expect(reviews.every((item) => item.hasReview)).toBe(true);
    expect(reviews.length).toBeGreaterThan(0);
  });
});
