import { describe, expect, it } from "vitest";
import { clampRating, isValidRating } from "@/domain/value-objects/rating";
import { slugify } from "@/lib/slug";

describe("rating", () => {
  it("accepts whole-star steps from 1 to 5", () => {
    expect(isValidRating(1)).toBe(true);
    expect(isValidRating(5)).toBe(true);
    expect(isValidRating(4.5)).toBe(false);
    expect(isValidRating(0.5)).toBe(false);
  });

  it("clamps to the nearest whole star", () => {
    expect(clampRating(4.2)).toBe(4);
    expect(clampRating(4.6)).toBe(5);
    expect(clampRating(0)).toBe(1);
  });
});

describe("slugify", () => {
  it("normalizes titles", () => {
    expect(slugify("The Handmaid's Tale")).toBe("the-handmaid-s-tale");
    expect(slugify("Lei & Ordem")).toBe("lei-ordem");
  });
});
