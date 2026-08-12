import { describe, expect, it } from "vitest";
import {
  catalogQueryString,
  parseCatalogSearchParams,
} from "./catalog-search-params";

describe("parseCatalogSearchParams", () => {
  it("reads status and year", () => {
    expect(
      parseCatalogSearchParams({ status: "finished", year: "2026" }),
    ).toEqual({ status: "finished", year: 2026 });
  });

  it("uses the first value when status is an array and trims whitespace", () => {
    expect(
      parseCatalogSearchParams({ status: [" watching ", "paused"] }),
    ).toEqual({ status: "watching", year: null });
  });

  it("ignores invalid year values", () => {
    expect(parseCatalogSearchParams({ year: "20" })).toEqual({
      status: "",
      year: null,
    });
    expect(parseCatalogSearchParams({ year: ["2026", "2025"] })).toEqual({
      status: "",
      year: 2026,
    });
  });
});

describe("catalogQueryString", () => {
  it("omits empty filters", () => {
    expect(catalogQueryString({ status: "", year: null })).toBe("");
    expect(catalogQueryString({ status: "watching", year: 2026 })).toBe(
      "?status=watching&year=2026",
    );
    expect(catalogQueryString({ status: "paused", year: null })).toBe(
      "?status=paused",
    );
    expect(catalogQueryString({ status: "", year: 2024 })).toBe("?year=2024");
  });
});
