import {
  SeriesCatalogScreen,
  seriesCatalogMetadata,
} from "@/lib/locale-screens";

export const metadata = seriesCatalogMetadata("en");

type SeriesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SeriesPage({ searchParams }: SeriesPageProps) {
  return SeriesCatalogScreen({ locale: "en", searchParams });
}
