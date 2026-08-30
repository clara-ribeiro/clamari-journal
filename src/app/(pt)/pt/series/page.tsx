import {
  SeriesCatalogScreen,
  seriesCatalogMetadata,
} from "@/lib/locale-screens";

export const metadata = seriesCatalogMetadata("pt-BR");

type SeriesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PortugueseSeriesPage({
  searchParams,
}: SeriesPageProps) {
  return SeriesCatalogScreen({ locale: "pt-BR", searchParams });
}
