import { describe, expect, it } from "vitest";
import type { CatalogCardItem } from "@/application/dto";
import { formatCatalogSummary } from "./catalog-summary";

function item(
  overrides: Partial<CatalogCardItem> & Pick<CatalogCardItem, "slug" | "statusKey">,
): CatalogCardItem {
  return {
    medium: "movie",
    title: overrides.slug,
    href: "/",
    posterUrl: null,
    favorite: false,
    hasReview: false,
    statusLabel: overrides.statusKey,
    statusTone: "neutral",
    yearLabel: null,
    activityLabel: "",
    favoriteLabel: "",
    reviewLabel: "",
    metaTags: [],
    sortTitle: overrides.slug,
    sortDate: null,
    sortRating: 0,
    sortYear: null,
    goalYears: [],
    watchedEpisodeCount: 0,
    ...overrides,
  };
}

describe("formatCatalogSummary", () => {
  it("counts film statuses in the filtered set", () => {
    const text = formatCatalogSummary(
      "films",
      "{watched} watched · {watchlist} on the list · {total} total",
      [
        item({ slug: "a", statusKey: "watched" }),
        item({ slug: "b", statusKey: "rewatch" }),
        item({ slug: "c", statusKey: "watchlist" }),
      ],
    );
    expect(text).toBe("2 watched · 1 on the list · 3 total");
  });

  it("sums series episode counts", () => {
    const text = formatCatalogSummary(
      "series",
      "{total} series · {episodes} episodes · {completed} completed · {watching} watching",
      [
        item({
          slug: "a",
          statusKey: "completed",
          watchedEpisodeCount: 10,
        }),
        item({
          slug: "b",
          statusKey: "watching",
          watchedEpisodeCount: 3,
        }),
      ],
    );
    expect(text).toBe("2 series · 13 episodes · 1 completed · 1 watching");
  });
});
