import { reviewRepository } from "@/composition/repositories";
import type { ReviewMedium } from "@/application/repositories/review-repository";

export function getReviewHtml(
  medium: ReviewMedium,
  reviewSlug: string | null | undefined,
): string | null {
  if (!reviewSlug) return null;
  return reviewRepository.findByMediumAndSlug(medium, reviewSlug)?.html ?? null;
}
