import { BooksCatalogScreen, booksCatalogMetadata } from "@/lib/locale-screens";

export const metadata = booksCatalogMetadata("pt-BR");

type BooksPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PortugueseBooksPage({
  searchParams,
}: BooksPageProps) {
  return BooksCatalogScreen({ locale: "pt-BR", searchParams });
}
