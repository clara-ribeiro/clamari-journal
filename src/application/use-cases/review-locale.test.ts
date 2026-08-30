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

import { resolveDetailLocale } from "./review-locale";

describe("resolveDetailLocale", () => {
  it("keeps English pages live without a Portuguese sibling", () => {
    const context = resolveDetailLocale("films", "heat", "heat", "en");
    expect(context?.reviewHtml).toContain("<strong>strong</strong>");
    expect(context?.alternateReviewHref).toBe("/pt/films/heat");
    expect(context?.alternateReviewLabel).toBe("Versão em Português");
  });

  it("still renders Portuguese chrome when the sibling essay is missing", () => {
    const context = resolveDetailLocale("films", "missing", "missing", "pt-BR");
    expect(context.reviewHtml).toBeNull();
    expect(context.reviewHeading).toBe("Resenha");
    expect(context.alternateReviewHref).toBeNull();
  });

  it("uses front matter title and English as the alternate on pt-BR", () => {
    const context = resolveDetailLocale("films", "heat", "heat", "pt-BR");
    expect(context?.workTitle).toBe("Fogo Contra Fogo");
    expect(context?.reviewHeading).toBe("Resenha");
    expect(context?.alternateReviewHref).toBe("/films/heat");
    expect(context?.alternateReviewLabel).toBe("English Version");
  });
});
