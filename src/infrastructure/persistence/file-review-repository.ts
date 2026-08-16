import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type {
  ReviewDocument,
  ReviewMedium,
  ReviewRepository,
} from "@/application/repositories/review-repository";
import { isReviewSlug } from "@/domain/value-objects/review-slug";
import { compileReviewMarkdown } from "./compile-review-markdown";

const DEFAULT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../content/reviews",
);

export class FileReviewRepository implements ReviewRepository {
  constructor(private readonly root: string = DEFAULT_ROOT) {}

  findByMediumAndSlug(
    medium: ReviewMedium,
    slug: string,
  ): ReviewDocument | undefined {
    if (!isReviewSlug(slug)) return undefined;

    const filePath = path.resolve(this.root, medium, `${slug}.md`);
    const relative = path.relative(this.root, filePath);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      return undefined;
    }

    let source: string;
    try {
      source = readFileSync(filePath, "utf8");
    } catch (error) {
      if (isNotFound(error)) return undefined;
      throw error;
    }

    const html = compileReviewMarkdown(source);
    if (!html) return undefined;

    return { medium, slug, html };
  }
}

export const reviewRepository = new FileReviewRepository();

function isNotFound(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT",
  );
}
