import type { Metadata } from "next";
import { listFavoriteEntries } from "@/application/use-cases/entries";
import AllEntriesTemplate from "@/components/templates/AllEntriesTemplate";
import { favoritesCopy } from "@/content/copy";

export const metadata: Metadata = {
  title: favoritesCopy.title,
  description: favoritesCopy.description,
};

export default async function FavoritesPage() {
  const entries = await listFavoriteEntries();

  return <AllEntriesTemplate entries={entries} copy={favoritesCopy} />;
}
