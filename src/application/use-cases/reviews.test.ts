import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import { FileReviewRepository } from "@/infrastructure/persistence/file-review-repository";

vi.mock("@/composition/repositories", () => ({
  reviewRepository: new FileReviewRepository(
    path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../infrastructure/persistence/fixtures/reviews",
    ),
  ),
}));

import { getReviewHtml } from "./reviews";

describe("getReviewHtml", () => {
  it("returns compiled html when the review file exists", () => {
    const html = getReviewHtml("films", "heat");
    expect(html).toContain("<strong>strong</strong>");
    expect(html).toContain("<summary>The ending</summary>");
  });

  it("returns null when the slug is missing or the file is absent", () => {
    expect(getReviewHtml("films", null)).toBeNull();
    expect(getReviewHtml("films", "missing-review")).toBeNull();
  });
});
