import type { Metadata } from "next";
import { listMixedCatalogItems } from "@/application/use-cases/mixed-catalog";
import AllEntriesTemplate from "@/components/templates/AllEntriesTemplate";
import { allEntriesCopy } from "@/content/copy";
import { pageMetadata } from "@/lib/page-metadata";
import { parseCatalogSearchParams } from "@/lib/catalog-search-params";

export const metadata: Metadata = pageMetadata({
  title: allEntriesCopy.title,
  description: allEntriesCopy.description,
  path: "/all-entries",
});

type AllEntriesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AllEntriesPage({
  searchParams,
}: AllEntriesPageProps) {
  const initialFilters = parseCatalogSearchParams(await searchParams);

  return (
    <AllEntriesTemplate
      items={listMixedCatalogItems()}
      copy={allEntriesCopy}
      initialStatus={initialFilters.status}
      initialYear={initialFilters.year}
    />
  );
}
