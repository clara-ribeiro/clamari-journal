import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getSeriesDetail,
  listSeries,
} from "@/application/use-cases/series";
import SeriesDetailTemplate from "@/components/templates/SeriesDetailTemplate";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listSeries().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getSeriesDetail(slug);
  if (!detail) {
    return { title: "Series not found" };
  }

  return {
    title: detail.metaTitle,
    description: detail.metaDescription,
  };
}

export default async function SeriesDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getSeriesDetail(slug);
  if (!detail) notFound();

  return <SeriesDetailTemplate detail={detail} />;
}
