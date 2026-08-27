import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasPublishedReview } from "@/application/use-cases/reviews";
import {
  getMovieDetail,
  listMovies,
} from "@/application/use-cases/movies";
import JsonLdScript from "@/components/atoms/JsonLdScript";
import FilmDetailTemplate from "@/components/templates/FilmDetailTemplate";
import { buildMovieJsonLd } from "@/lib/json-ld";
import {
  missingDetailMetadata,
  reviewDetailMetadata,
} from "@/lib/review-detail-metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return listMovies()
    .filter((movie) => hasPublishedReview("films", movie.reviewSlug, "pt-BR"))
    .map((movie) => ({ slug: movie.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getMovieDetail(slug, "pt-BR");
  if (!detail) {
    return missingDetailMetadata("films", slug, "pt-BR");
  }

  return reviewDetailMetadata("films", {
    slug: detail.slug,
    metaTitle: detail.metaTitle,
    metaDescription: detail.metaDescription,
    imageUrl: detail.posterUrl ?? detail.backdropUrl,
    reviewHtml: detail.reviewHtml,
    reviewLocale: detail.reviewLocale,
    alternateReviewHref: detail.alternateReviewHref,
  });
}

export default async function PortugueseFilmDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getMovieDetail(slug, "pt-BR");
  if (!detail) {
    notFound();
    return null;
  }

  return (
    <>
      <JsonLdScript data={buildMovieJsonLd(detail)} />
      <FilmDetailTemplate detail={detail} />
    </>
  );
}
