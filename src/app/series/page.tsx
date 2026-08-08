import { listSeriesCatalogItems } from "@/application/use-cases/series";
import MediumCatalogTemplate from "@/components/templates/MediumCatalogTemplate";
import { seriesCopy } from "@/content/copy";
import { parseCatalogSearchParams } from "@/lib/catalog-search-params";

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
