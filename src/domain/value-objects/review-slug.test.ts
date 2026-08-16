import { describe, expect, it } from "vitest";
import { isReviewSlug } from "./review-slug";

describe("isReviewSlug", () => {
  it("accepts kebab-case identifiers", () => {
    expect(isReviewSlug("heat")).toBe(true);
    expect(isReviewSlug("the-titans-curse")).toBe(true);
  });

  it("rejects empty, dotted, or path-like values", () => {
    expect(isReviewSlug("")).toBe(false);
    expect(isReviewSlug("Heat")).toBe(false);
    expect(isReviewSlug("../secrets")).toBe(false);
    expect(isReviewSlug("films/heat")).toBe(false);
    expect(isReviewSlug("heat.md")).toBe(false);
  });
});
