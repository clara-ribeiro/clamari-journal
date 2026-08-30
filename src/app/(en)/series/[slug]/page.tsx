import type { Metadata } from "next";
import {
  SeriesDetailScreen,
  generateSeriesParams,
  seriesDetailMetadata,
} from "@/lib/locale-screens";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return generateSeriesParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return seriesDetailMetadata(slug, "en");
}

export default async function SeriesDetailPage({ params }: Props) {
  const { slug } = await params;
  return SeriesDetailScreen({ slug, locale: "en" });
}
