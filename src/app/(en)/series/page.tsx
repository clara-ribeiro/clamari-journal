import { listSeriesCatalogItems } from "@/application/use-cases/series";
import MediumCatalogTemplate from "@/components/templates/MediumCatalogTemplate";
import { seriesCopy } from "@/content/copy";
import { pageMetadata } from "@/lib/page-metadata";
import { parseCatalogSearchParams } from "@/lib/catalog-search-params";

export const metadata = pageMetadata({
  title: seriesCopy.list.title,
  description: seriesCopy.list.description,
  path: "/series",
});

type SeriesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SeriesPage({ searchParams }: SeriesPageProps) {
  const initialFilters = parseCatalogSearchParams(await searchParams);

  return (
    <MediumCatalogTemplate
      medium="series"
      copy={seriesCopy.list}
      items={listSeriesCatalogItems()}
      initialStatus={initialFilters.status}
      initialYear={initialFilters.year}
    />
  );
}
