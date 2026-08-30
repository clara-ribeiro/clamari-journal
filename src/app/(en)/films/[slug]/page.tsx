import type { Metadata } from "next";
import {
  FilmDetailScreen,
  filmDetailMetadata,
  generateFilmParams,
} from "@/lib/locale-screens";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return generateFilmParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return filmDetailMetadata(slug, "en");
}

export default async function FilmDetailPage({ params }: Props) {
  const { slug } = await params;
  return FilmDetailScreen({ slug, locale: "en" });
}
