import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasPublishedReview } from "@/application/use-cases/reviews";
import {
  getSeriesDetail,
  listSeries,
} from "@/application/use-cases/series";
import JsonLdScript from "@/components/atoms/JsonLdScript";
import SeriesDetailTemplate from "@/components/templates/SeriesDetailTemplate";
import { buildSeriesJsonLd } from "@/lib/json-ld";
import {
  missingDetailMetadata,
  reviewDetailMetadata,
} from "@/lib/review-detail-metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return listSeries()
    .filter((entry) => hasPublishedReview("series", entry.reviewSlug, "pt-BR"))
    .map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getSeriesDetail(slug, "pt-BR");
  if (!detail) {
    return missingDetailMetadata("series", slug, "pt-BR");
  }

  return reviewDetailMetadata("series", {
    slug: detail.slug,
    metaTitle: detail.metaTitle,
    metaDescription: detail.metaDescription,
    imageUrl: detail.posterUrl ?? detail.backdropUrl,
    reviewHtml: detail.reviewHtml,
    reviewLocale: detail.reviewLocale,
    alternateReviewHref: detail.alternateReviewHref,
  });
}

export default async function PortugueseSeriesDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getSeriesDetail(slug, "pt-BR");
  if (!detail) {
    notFound();
    return null;
  }

  return (
    <>
      <JsonLdScript data={buildSeriesJsonLd(detail)} />
      <SeriesDetailTemplate detail={detail} />
    </>
  );
}
