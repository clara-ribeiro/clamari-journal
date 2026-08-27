import type { MetadataRoute } from "next";
import type { ReviewMedium } from "@/application/repositories/review-repository";
import { listBooks } from "@/application/use-cases/books";
import { listMovies } from "@/application/use-cases/movies";
import {
  getReviewHtml,
  hasPublishedReview,
} from "@/application/use-cases/reviews";
import { listSeries } from "@/application/use-cases/series";
import { isLocalSiteImage, extractReviewImages } from "@/lib/review-images";
import {
  reviewLanguageAlternates,
  reviewPagePath,
} from "@/lib/review-locale";
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
  languages?: Record<string, string>,
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    changeFrequency,
    priority,
    ...(images?.length ? { images } : {}),
    ...(languages
      ? {
          alternates: {
            languages: Object.fromEntries(
              Object.entries(languages).map(([key, href]) => [
                key,
                absoluteUrl(href),
              ]),
            ),
          },
        }
      : {}),
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

function catalogEntries(
  medium: ReviewMedium,
  items: readonly { slug: string; reviewSlug?: string }[],
): MetadataRoute.Sitemap {
  return items.flatMap((item) => {
    const { hasReview, images } = publishedReview(medium, item.reviewSlug);
    const enPath = reviewPagePath(medium, item.slug, "en");
    const hasPt = hasPublishedReview(medium, item.reviewSlug, "pt-BR");
    const languages = hasPt
      ? reviewLanguageAlternates(medium, item.slug)
      : undefined;

    const rows: MetadataRoute.Sitemap = [
      entry(enPath, hasReview ? 0.8 : 0.6, "monthly", images, languages),
    ];

    if (hasPt) {
      rows.push(
        entry(
          reviewPagePath(medium, item.slug, "pt-BR"),
          0.8,
          "monthly",
          images,
          languages,
        ),
      );
    }

    return rows;
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = INDEXABLE_STATIC_PATHS.map((path) =>
    entry(path, path === "/" ? 1 : 0.8, "weekly"),
  );

  return [
    ...staticEntries,
    ...catalogEntries("films", listMovies()),
    ...catalogEntries("series", listSeries()),
    ...catalogEntries("books", listBooks()),
  ];
}
