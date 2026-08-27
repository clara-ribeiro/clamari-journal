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
    expect(review?.locale).toBe("en");
    expect(review?.workTitle).toBeNull();
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

  it("loads a Portuguese sibling without mixing it into the English file", () => {
    const review = repository.findByMediumAndSlug("films", "heat", "pt-BR");
    expect(review?.locale).toBe("pt-BR");
    expect(review?.workTitle).toBe("Fogo Contra Fogo");
    expect(review?.html).toContain("<em>emphasis</em>");
    expect(review?.html).toContain("<summary>Alerta de spoilers</summary>");
    expect(repository.findByMediumAndSlug("films", "heat")?.html).not.toContain(
      "Alerta de spoilers",
    );
  });

  it("loads journal reviews from src/content when cwd is the project root", () => {
    const review = new FileReviewRepository().findByMediumAndSlug(
      "films",
      "cat-on-a-hot-tin-roof",
    );
    expect(review?.html).toContain("drowning man");
    expect(review?.html).toContain("<figure>");
    expect(review?.html).toContain(
      "<figcaption>Maggie keeps reaching for Brick while he keeps finding ways to stay out of reach.</figcaption>",
    );
  });
});
