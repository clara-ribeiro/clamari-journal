import type { Metadata } from "next";
import { FavoritesScreen, favoritesMetadata } from "@/lib/locale-screens";

export const metadata: Metadata = favoritesMetadata("pt-BR");

type FavoritesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PortugueseFavoritesPage({
  searchParams,
}: FavoritesPageProps) {
  return FavoritesScreen({ locale: "pt-BR", searchParams });
}
