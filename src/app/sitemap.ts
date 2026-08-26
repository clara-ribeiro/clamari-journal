import type { MetadataRoute } from "next";
import type { ReviewMedium } from "@/application/repositories/review-repository";
import { listBooks } from "@/application/use-cases/books";
import { listMovies } from "@/application/use-cases/movies";
import { getReviewHtml } from "@/application/use-cases/reviews";
import { listSeries } from "@/application/use-cases/series";
import { isLocalSiteImage, extractReviewImages } from "@/lib/review-images";
import { absoluteUrl } from "@/lib/site-url";

export const INDEXABLE_STATIC_PATHS = [
  "/",
  "/films",
  "/series",
  "/books",
  "/stats",
  "/all-entries",
  "/favorites",
  "/reviews",
] as const;

function entry(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  images?: string[],
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    changeFrequency,
    priority,
    ...(images?.length ? { images } : {}),
  };
}

function publishedReview(medium: ReviewMedium, slug: string | undefined) {
  const html = getReviewHtml(medium, slug ?? null);
  const images = extractReviewImages(html)
    .map((image) => image.src)
    .filter(isLocalSiteImage)
    .map((src) => absoluteUrl(src));
  return { hasReview: Boolean(html?.trim()), images };
}

function catalogEntry(
  path: string,
  medium: ReviewMedium,
  reviewSlug: string | undefined,
): MetadataRoute.Sitemap[number] {
  const { hasReview, images } = publishedReview(medium, reviewSlug);
  return entry(path, hasReview ? 0.8 : 0.6, "monthly", images);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = INDEXABLE_STATIC_PATHS.map((path) =>
    entry(path, path === "/" ? 1 : 0.8, "weekly"),
  );

  const filmEntries = listMovies().map((movie) =>
    catalogEntry(`/films/${movie.slug}`, "films", movie.reviewSlug),
  );
  const seriesEntries = listSeries().map((series) =>
    catalogEntry(`/series/${series.slug}`, "series", series.reviewSlug),
  );
  const bookEntries = listBooks().map((book) =>
    catalogEntry(`/books/${book.slug}`, "books", book.reviewSlug),
  );

  return [...staticEntries, ...filmEntries, ...seriesEntries, ...bookEntries];
}
