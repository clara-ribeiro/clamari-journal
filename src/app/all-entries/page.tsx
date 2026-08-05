import type { Metadata } from "next";
import { listAllEntries } from "@/application/use-cases/entries";
import AllEntriesTemplate from "@/components/templates/AllEntriesTemplate";
import { allEntriesCopy } from "@/content/copy";

export const metadata: Metadata = {
  title: allEntriesCopy.title,
  description: allEntriesCopy.description,
};

export default function AllEntriesPage() {
  const entries = listAllEntries();

  return <AllEntriesTemplate entries={entries} />;
}
