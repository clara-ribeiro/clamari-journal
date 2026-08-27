import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

export function generateStaticParams() {
  return listMovies().map((movie) => ({ slug: movie.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getMovieDetail(slug);
  if (!detail) {
    return missingDetailMetadata("films", slug, "en");
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

export default async function FilmDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getMovieDetail(slug);
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
