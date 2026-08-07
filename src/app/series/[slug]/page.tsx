import { notFound } from "next/navigation";
import {
  getSeriesDetail,
  listSeries,
} from "@/application/use-cases/series";
import MediumDetailTemplate from "@/components/templates/MediumDetailTemplate";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listSeries().map((entry) => ({ slug: entry.slug }));
}

export default async function SeriesDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = getSeriesDetail(slug);
  if (!detail) notFound();

  return <MediumDetailTemplate kind="series" detail={detail} />;
}
