import { describe, expect, it } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats ISO calendar dates in en-US long form", () => {
    expect(formatDate("2024-06-01")).toBe("June 1, 2024");
  });

  it("returns an em dash for empty values", () => {
    expect(formatDate(undefined)).toBe("—");
    expect(formatDate(null)).toBe("—");
    expect(formatDate("")).toBe("—");
  });

  it("echoes unparseable strings unchanged", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });
});
