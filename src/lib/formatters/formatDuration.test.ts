import { describe, expect, it } from "vitest";
import { formatDuration } from "@/lib/formatters/formatDate";

describe("formatDuration", () => {
  it("formats short durations with hours and minutes", () => {
    expect(formatDuration(90)).toBe("1h 30m");
    expect(formatDuration(45)).toBe("45m");
  });

  it("formats multi-day spans without minutes", () => {
    expect(formatDuration(60 * 24 * 2 + 60 * 5)).toBe("2d 5h");
  });

  it("formats months and years when needed", () => {
    // 1 year + 2 months + 3 days
    const minutes = 365 * 24 * 60 + 2 * 30 * 24 * 60 + 3 * 24 * 60;
    expect(formatDuration(minutes)).toBe("1y 2mo 3d");
  });

  it("handles zero and negatives", () => {
    expect(formatDuration(0)).toBe("0m");
    expect(formatDuration(-10)).toBe("0m");
  });
});
