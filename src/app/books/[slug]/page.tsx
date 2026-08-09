import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBookDetail, listBooks } from "@/application/use-cases/books";
import BookDetailTemplate from "@/components/templates/BookDetailTemplate";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listBooks().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getBookDetail(slug);
  if (!detail) {
    return { title: "Book not found" };
  }

  return {
    title: detail.metaTitle,
    description: detail.metaDescription,
  };
}

export default async function BookDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getBookDetail(slug);
  if (!detail) notFound();

  return <BookDetailTemplate detail={detail} />;
}
