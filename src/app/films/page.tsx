import {
  getMoviesPageSummary,
  listMovieCatalogItems,
} from "@/application/use-cases/movies";
import MediumCatalogTemplate from "@/components/templates/MediumCatalogTemplate";
import { filmsCopy } from "@/content/copy";
import { parseCatalogSearchParams } from "@/lib/catalog-search-params";

type FilmsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FilmsPage({ searchParams }: FilmsPageProps) {
  const initialFilters = parseCatalogSearchParams(await searchParams);

  return (
    <MediumCatalogTemplate
      medium="films"
      copy={filmsCopy.list}
      summary={getMoviesPageSummary()}
      items={listMovieCatalogItems()}
      initialStatus={initialFilters.status}
      initialYear={initialFilters.year}
    />
  );
}
