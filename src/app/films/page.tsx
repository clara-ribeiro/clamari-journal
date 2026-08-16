import { listMovieCatalogItems } from "@/application/use-cases/movies";
import MediumCatalogTemplate from "@/components/templates/MediumCatalogTemplate";
import { filmsCopy } from "@/content/copy";
import { pageMetadata } from "@/lib/page-metadata";
import { parseCatalogSearchParams } from "@/lib/catalog-search-params";

export const metadata = pageMetadata({
  title: filmsCopy.list.title,
  description: filmsCopy.list.description,
  path: "/films",
});

type FilmsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FilmsPage({ searchParams }: FilmsPageProps) {
  const initialFilters = parseCatalogSearchParams(await searchParams);

  return (
    <MediumCatalogTemplate
      medium="films"
      copy={filmsCopy.list}
      items={listMovieCatalogItems()}
      initialStatus={initialFilters.status}
      initialYear={initialFilters.year}
    />
  );
}
