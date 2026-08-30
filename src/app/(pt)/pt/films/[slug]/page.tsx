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
  return filmDetailMetadata(slug, "pt-BR");
}

export default async function PortugueseFilmDetailPage({ params }: Props) {
  const { slug } = await params;
  return FilmDetailScreen({ slug, locale: "pt-BR" });
}
