import { describe, expect, it } from "vitest";
import { reviewContentCopy } from "@/content/copy/review-content";
import { buildDetailMeta } from "./detail-meta";

const copy = {
  descriptionFallback: "Personal journal entry for {title}.",
  descriptionFromSynopsis: "{synopsis}",
};

describe("buildDetailMeta", () => {
  it("uses the work title and synopsis when there is no review", () => {
    const meta = buildDetailMeta({
      title: "Heat",
      synopsis: "A crime epic in Los Angeles.",
      reviewHtml: null,
      copy,
    });

    expect(meta.metaTitle).toBe("Heat");
    expect(meta.metaDescription).toBe("A crime epic in Los Angeles.");
  });

  it("falls back to the personal-entry line without a synopsis", () => {
    const meta = buildDetailMeta({
      title: "Local Title",
      synopsis: null,
      reviewHtml: null,
      copy,
    });

    expect(meta.metaDescription).toBe("Personal journal entry for Local Title.");
  });

  it("names a published review in the title and prefers its excerpt", () => {
    const meta = buildDetailMeta({
      title: "Hereditary",
      synopsis: "A family is haunted after the death of their secretive grandmother.",
      reviewHtml: "<p>Grief as architecture.</p>",
      copy,
    });

    expect(meta.metaTitle).toBe(
      reviewContentCopy.seo.titleWithReview.replace("{title}", "Hereditary"),
    );
    expect(meta.metaDescription).toBe("Grief as architecture.");
  });

  it("keeps the work title when the slug is pending (empty html)", () => {
    const meta = buildDetailMeta({
      title: "Heat",
      synopsis: "A crime epic.",
      reviewHtml: "   ",
      copy,
    });

    expect(meta.metaTitle).toBe("Heat");
    expect(meta.metaDescription).toBe("A crime epic.");
  });

  it("does not put spoiler text in the description", () => {
    const meta = buildDetailMeta({
      title: "Heat",
      synopsis: "A crime epic.",
      reviewHtml:
        "<p>Precision first.</p><details class=\"review-spoiler\"><p>They almost make it.</p></details>",
      copy,
    });

    expect(meta.metaDescription).toBe("Precision first.");
    expect(meta.metaDescription).not.toContain("almost make it");
  });
});
