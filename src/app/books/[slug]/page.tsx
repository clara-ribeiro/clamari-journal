import { notFound } from "next/navigation";
import { getBookDetail, listBooks } from "@/application/use-cases/books";
import MediumDetailTemplate from "@/components/templates/MediumDetailTemplate";
import { booksCopy } from "@/content/copy";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listBooks().map((book) => ({ slug: book.slug }));
}

export default async function BookDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = getBookDetail(slug);
  if (!detail) notFound();

  return (
    <MediumDetailTemplate
      kind="book"
      detail={detail}
      backLabel={booksCopy.detail.backLabel}
    />
  );
}
