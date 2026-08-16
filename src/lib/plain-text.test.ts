import { describe, expect, it } from "vitest";
import {
  META_DESCRIPTION_MAX,
  reviewExcerpt,
  reviewPlainText,
  stripHtml,
  truncateText,
} from "./plain-text";

describe("stripHtml", () => {
  it("strips tags and decodes common entities", () => {
    expect(stripHtml("<p>Hello &amp; <b>world</b></p>")).toBe("Hello & world");
  });
});

describe("truncateText", () => {
  it("returns short text unchanged", () => {
    expect(truncateText("A short line.")).toBe("A short line.");
  });

  it("clips on a word boundary and marks the ellipsis", () => {
    const long = "word ".repeat(50).trim();
    const clipped = truncateText(long, 40);
    expect(clipped.endsWith("…")).toBe(true);
    expect(clipped.length).toBeLessThanOrEqual(40);
    expect(clipped).not.toContain("  ");
  });

  it("hard-clips when there is no usable word boundary", () => {
    const clipped = truncateText("abcdefghijklmnopqrstuvwxyz", 10);
    expect(clipped).toBe("abcdefghi…");
  });
});

describe("reviewPlainText", () => {
  it("drops spoiler disclosures before stripping tags", () => {
    const html =
      "<p>Safe paragraph.</p><details class=\"review-spoiler\"><summary>The ending</summary><p>They almost make it.</p></details>";
    expect(reviewPlainText(html)).toBe("Safe paragraph.");
  });

  it("returns empty when the review is only spoilers", () => {
    expect(
      reviewPlainText(
        "<details class=\"review-spoiler\"><p>Secret.</p></details>",
      ),
    ).toBe("");
  });
});

describe("reviewExcerpt", () => {
  it("returns null when nothing readable remains", () => {
    expect(reviewExcerpt("   ")).toBeNull();
    expect(
      reviewExcerpt(
        "<details class=\"review-spoiler\"><p>Secret.</p></details>",
      ),
    ).toBeNull();
  });

  it("truncates a long review to the meta description cap", () => {
    const html = `<p>${"lorem ".repeat(80).trim()}</p>`;
    const excerpt = reviewExcerpt(html);
    expect(excerpt).not.toBeNull();
    expect(excerpt!.length).toBeLessThanOrEqual(META_DESCRIPTION_MAX);
    expect(excerpt!.endsWith("…")).toBe(true);
  });
});
