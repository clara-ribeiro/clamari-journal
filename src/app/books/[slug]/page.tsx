import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBookDetail, listBooks } from "@/application/use-cases/books";
import BookDetailTemplate from "@/components/templates/BookDetailTemplate";
import { detailPageMetadata, pageMetadata } from "@/lib/page-metadata";
import { statesCopy } from "@/content/copy/states";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listBooks().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getBookDetail(slug);
  if (!detail) {
    return pageMetadata({
      title: statesCopy.notFound.title,
      description: statesCopy.notFound.description,
      path: `/books/${slug}`,
      index: false,
    });
  }

  return detailPageMetadata({
    title: detail.metaTitle,
    description: detail.metaDescription,
    path: `/books/${detail.slug}`,
    imageUrl: detail.coverUrl,
  });
}

export default async function BookDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getBookDetail(slug);
  if (!detail) notFound();

  return <BookDetailTemplate detail={detail} />;
}
