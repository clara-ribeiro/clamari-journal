import type { Metadata } from "next";
import {
  BookDetailScreen,
  bookDetailMetadata,
  generateBookParams,
} from "@/lib/locale-screens";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return generateBookParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return bookDetailMetadata(slug, "pt-BR");
}

export default async function PortugueseBookDetailPage({ params }: Props) {
  const { slug } = await params;
  return BookDetailScreen({ slug, locale: "pt-BR" });
}
