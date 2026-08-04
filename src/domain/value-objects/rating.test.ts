import { describe, expect, it } from "vitest";
import { clampRating, isValidRating } from "@/domain/value-objects/rating";
import { slugify } from "@/lib/slug";

describe("rating", () => {
  it("accepts half-star steps", () => {
    expect(isValidRating(4.5)).toBe(true);
    expect(isValidRating(4.25)).toBe(false);
  });

  it("clamps to nearest half star", () => {
    expect(clampRating(4.2)).toBe(4);
    expect(clampRating(4.3)).toBe(4.5);
  });
});

describe("slugify", () => {
  it("normalizes titles", () => {
    expect(slugify("The Handmaid's Tale")).toBe("the-handmaid-s-tale");
    expect(slugify("Lei & Ordem")).toBe("lei-ordem");
  });
});
