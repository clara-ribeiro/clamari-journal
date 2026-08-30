import { FilmsCatalogScreen, filmsCatalogMetadata } from "@/lib/locale-screens";

export const metadata = filmsCatalogMetadata("en");

type FilmsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FilmsPage({ searchParams }: FilmsPageProps) {
  return FilmsCatalogScreen({ locale: "en", searchParams });
}
