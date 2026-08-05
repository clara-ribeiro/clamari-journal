import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookBySlug, listBooks } from "@/application/use-cases/books";
import { styled } from "@/styles/stitches.config";

const Page = styled("main", {
  minHeight: "100dvh",
  px: "$lg",
  py: "$2xl",
  maxWidth: "$containerReading",
  mx: "auto",
});

const Back = styled(Link, {
  color: "$loContrast",
  fontSize: "$body2",
  display: "inline-block",
  marginBottom: "$lg",
  "&:hover": { color: "$primary" },
});

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listBooks().map((book) => ({ slug: book.slug }));
}

export default async function BookDetailPage({ params }: Props) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();

  return (
    <Page>
      <Back href="/books">← Books</Back>
      <h1>{book.title ?? book.slug}</h1>
      <p>Status: {book.status}</p>
    </Page>
  );
}
