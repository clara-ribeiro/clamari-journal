import type { MetadataRoute } from "next";
import type { ReviewMedium } from "@/application/repositories/review-repository";
import { listBooks } from "@/application/use-cases/books";
import { listMovies } from "@/application/use-cases/movies";
import { getReviewHtml } from "@/application/use-cases/reviews";
import { listSeries } from "@/application/use-cases/series";
import { isLocalSiteImage, extractReviewImages } from "@/lib/review-images";
import {
  INDEXABLE_STATIC_PATHS,
  languageAlternates,
  pathForLocale,
  reviewLanguageAlternates,
  reviewPagePath,
  type ReviewLocale,
} from "@/lib/review-locale";
import { absoluteUrl } from "@/lib/site-url";

export { INDEXABLE_STATIC_PATHS };

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
    const languages = reviewLanguageAlternates(medium, item.slug);
    const locales: ReviewLocale[] = ["en", "pt-BR"];

    return locales.map((locale) =>
      entry(
        reviewPagePath(medium, item.slug, locale),
        hasReview ? 0.8 : 0.6,
        "monthly",
        images,
        languages,
      ),
    );
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = INDEXABLE_STATIC_PATHS.flatMap((path) => {
    const languages = languageAlternates(path);
    const priority = path === "/" ? 1 : 0.8;
    return (["en", "pt-BR"] as const).map((locale) =>
      entry(
        pathForLocale(path, locale),
        priority,
        "weekly",
        undefined,
        languages,
      ),
    );
  });

  return [
    ...staticEntries,
    ...catalogEntries("films", listMovies()),
    ...catalogEntries("series", listSeries()),
    ...catalogEntries("books", listBooks()),
  ];
}
