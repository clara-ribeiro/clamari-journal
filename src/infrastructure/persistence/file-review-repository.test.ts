import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { FileReviewRepository } from "./file-review-repository";

const fixturesRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures/reviews",
);

describe("FileReviewRepository", () => {
  const repository = new FileReviewRepository(fixturesRoot);

  it("loads and compiles a review by medium and slug", () => {
    const review = repository.findByMediumAndSlug("films", "heat");
    expect(review?.slug).toBe("heat");
    expect(review?.medium).toBe("films");
    expect(review?.html).toContain("<em>emphasis</em>");
    expect(review?.html).toContain('<details class="review-spoiler">');
    expect(review?.html).toContain("<summary>The ending</summary>");
  });

  it("returns undefined when the file is missing", () => {
    expect(
      repository.findByMediumAndSlug("films", "not-a-real-review"),
    ).toBeUndefined();
  });

  it("rejects unsafe slugs", () => {
    expect(repository.findByMediumAndSlug("films", "../heat")).toBeUndefined();
    expect(repository.findByMediumAndSlug("films", "heat.md")).toBeUndefined();
  });
});
