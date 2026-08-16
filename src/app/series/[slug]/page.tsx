import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getSeriesDetail,
  listSeries,
} from "@/application/use-cases/series";
import JsonLdScript from "@/components/atoms/JsonLdScript";
import SeriesDetailTemplate from "@/components/templates/SeriesDetailTemplate";
import { detailPageMetadata, pageMetadata } from "@/lib/page-metadata";
import { buildSeriesJsonLd } from "@/lib/json-ld";
import { statesCopy } from "@/content/copy/states";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listSeries().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getSeriesDetail(slug);
  if (!detail) {
    return pageMetadata({
      title: statesCopy.notFound.title,
      description: statesCopy.notFound.description,
      path: `/series/${slug}`,
      index: false,
    });
  }

  return detailPageMetadata({
    title: detail.metaTitle,
    description: detail.metaDescription,
    path: `/series/${detail.slug}`,
    imageUrl: detail.posterUrl ?? detail.backdropUrl,
    hasReview: Boolean(detail.reviewHtml?.trim()),
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
