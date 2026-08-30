import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";
import type {
  ReviewDocument,
  ReviewMedium,
  ReviewRepository,
} from "@/application/repositories/review-repository";
import { reviewLocaleCopy } from "@/content/copy/review-content";
import { isReviewSlug } from "@/domain/value-objects/review-slug";
import {
  DEFAULT_REVIEW_LOCALE,
  reviewFileName,
  type ReviewLocale,
} from "@/lib/review-locale";
import { compileReviewMarkdown } from "./compile-review-markdown";
import { parseReviewSource } from "./parse-review-source";

/**
 * Reviews live on disk, not in the JS bundle. After `next build`,
 * `import.meta.url` points at a compiled chunk, so a relative path from
 * this file misses `src/content/reviews`. `process.cwd()` is the project
 * root in `next dev`, `next build`, and on Vercel.
 */
const DEFAULT_ROOT = path.join(process.cwd(), "src/content/reviews");

export class FileReviewRepository implements ReviewRepository {
  constructor(private readonly root: string = DEFAULT_ROOT) {}

  findByMediumAndSlug(
    medium: ReviewMedium,
    slug: string,
    locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
  ): ReviewDocument | undefined {
    if (!isReviewSlug(slug)) return undefined;

    const filePath = path.resolve(this.root, medium, reviewFileName(slug, locale));
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

    const parsed = parseReviewSource(source);
    const html = compileReviewMarkdown(parsed.body, {
      spoilerLabel: reviewLocaleCopy[locale].spoilerSummary,
    });
    if (!html) return undefined;

    return {
      medium,
      slug,
      locale,
      html,
      workTitle: parsed.workTitle,
    };
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
