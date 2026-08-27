import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBookDetail, listBooks } from "@/application/use-cases/books";
import { hasPublishedReview } from "@/application/use-cases/reviews";
import JsonLdScript from "@/components/atoms/JsonLdScript";
import BookDetailTemplate from "@/components/templates/BookDetailTemplate";
import { buildBookJsonLd } from "@/lib/json-ld";
import {
  missingDetailMetadata,
  reviewDetailMetadata,
} from "@/lib/review-detail-metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return listBooks()
    .filter((entry) => hasPublishedReview("books", entry.reviewSlug, "pt-BR"))
    .map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getBookDetail(slug, "pt-BR");
  if (!detail) {
    return missingDetailMetadata("books", slug, "pt-BR");
  }

  return reviewDetailMetadata("books", {
    slug: detail.slug,
    metaTitle: detail.metaTitle,
    metaDescription: detail.metaDescription,
    imageUrl: detail.coverUrl,
    reviewHtml: detail.reviewHtml,
    reviewLocale: detail.reviewLocale,
    alternateReviewHref: detail.alternateReviewHref,
  });
}

export default async function PortugueseBookDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getBookDetail(slug, "pt-BR");
  if (!detail) {
    notFound();
    return null;
  }

  return (
    <>
      <JsonLdScript data={buildBookJsonLd(detail)} />
      <BookDetailTemplate detail={detail} />
    </>
  );
}
