import type { Metadata } from "next";
import { listFavoriteCatalogItems } from "@/application/use-cases/mixed-catalog";
import AllEntriesTemplate from "@/components/templates/AllEntriesTemplate";
import { favoritesCopy } from "@/content/copy";
import { pageMetadata } from "@/lib/page-metadata";
import { parseCatalogSearchParams } from "@/lib/catalog-search-params";

export const metadata: Metadata = pageMetadata({
  title: favoritesCopy.title,
  description: favoritesCopy.description,
  path: "/favorites",
});

type FavoritesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FavoritesPage({
  searchParams,
}: FavoritesPageProps) {
  const initialFilters = parseCatalogSearchParams(await searchParams);

  return (
    <AllEntriesTemplate
      items={listFavoriteCatalogItems()}
      copy={favoritesCopy}
      initialStatus={initialFilters.status}
      initialYear={initialFilters.year}
      showFavoriteFilter={false}
    />
  );
}
