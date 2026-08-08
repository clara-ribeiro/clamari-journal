import { listBookCatalogItems } from "@/application/use-cases/books";
import MediumCatalogTemplate from "@/components/templates/MediumCatalogTemplate";
import { booksCopy } from "@/content/copy";
import { parseCatalogSearchParams } from "@/lib/catalog-search-params";

type BooksPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const initialFilters = parseCatalogSearchParams(await searchParams);

  return (
    <MediumCatalogTemplate
      medium="books"
      copy={booksCopy.list}
      items={listBookCatalogItems()}
      initialStatus={initialFilters.status}
      initialYear={initialFilters.year}
    />
  );
}
