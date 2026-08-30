import { FilmsCatalogScreen, filmsCatalogMetadata } from "@/lib/locale-screens";

export const metadata = filmsCatalogMetadata("pt-BR");

type FilmsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PortugueseFilmsPage({
  searchParams,
}: FilmsPageProps) {
  return FilmsCatalogScreen({ locale: "pt-BR", searchParams });
}
