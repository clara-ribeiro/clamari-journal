import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

export function generateStaticParams() {
  return listSeries().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getSeriesDetail(slug);
  if (!detail) {
    return missingDetailMetadata("series", slug, "en");
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

export default async function SeriesDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getSeriesDetail(slug);
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
