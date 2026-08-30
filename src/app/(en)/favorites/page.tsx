import type { Metadata } from "next";
import { FavoritesScreen, favoritesMetadata } from "@/lib/locale-screens";

export const metadata: Metadata = favoritesMetadata("en");

type FavoritesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FavoritesPage({
  searchParams,
}: FavoritesPageProps) {
  return FavoritesScreen({ locale: "en", searchParams });
}
