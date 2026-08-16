import type { MetadataRoute } from "next";
import { listBooks } from "@/application/use-cases/books";
import { listMovies } from "@/application/use-cases/movies";
import { listSeries } from "@/application/use-cases/series";
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
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = INDEXABLE_STATIC_PATHS.map((path) =>
    entry(path, path === "/" ? 1 : 0.8, "weekly"),
  );

  const filmEntries = listMovies().map((movie) =>
    entry(`/films/${movie.slug}`, 0.6, "monthly"),
  );
  const seriesEntries = listSeries().map((series) =>
    entry(`/series/${series.slug}`, 0.6, "monthly"),
  );
  const bookEntries = listBooks().map((book) =>
    entry(`/books/${book.slug}`, 0.6, "monthly"),
  );

  return [...staticEntries, ...filmEntries, ...seriesEntries, ...bookEntries];
}
