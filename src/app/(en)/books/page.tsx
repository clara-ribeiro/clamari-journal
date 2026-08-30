import { BooksCatalogScreen, booksCatalogMetadata } from "@/lib/locale-screens";

export const metadata = booksCatalogMetadata("en");

type BooksPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BooksPage({ searchParams }: BooksPageProps) {
  return BooksCatalogScreen({ locale: "en", searchParams });
}
