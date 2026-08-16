import type { Metadata } from "next";
import { listReviewCatalogItems } from "@/application/use-cases/mixed-catalog";
import AllEntriesTemplate from "@/components/templates/AllEntriesTemplate";
import { reviewsCopy } from "@/content/copy";
import { pageMetadata } from "@/lib/page-metadata";
import { parseCatalogSearchParams } from "@/lib/catalog-search-params";

export const metadata: Metadata = pageMetadata({
  title: reviewsCopy.title,
  description: reviewsCopy.description,
  path: "/reviews",
});

type ReviewsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ReviewsPage({
  searchParams,
}: ReviewsPageProps) {
  const initialFilters = parseCatalogSearchParams(await searchParams);

  return (
    <AllEntriesTemplate
      items={listReviewCatalogItems()}
      copy={reviewsCopy}
      initialStatus={initialFilters.status}
      initialYear={initialFilters.year}
      showReviewFilter={false}
    />
  );
}
