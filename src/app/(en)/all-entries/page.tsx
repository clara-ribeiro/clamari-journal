import type { Metadata } from "next";
import { AllEntriesScreen, allEntriesMetadata } from "@/lib/locale-screens";

export const metadata: Metadata = allEntriesMetadata("en");

type AllEntriesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AllEntriesPage({
  searchParams,
}: AllEntriesPageProps) {
  return AllEntriesScreen({ locale: "en", searchParams });
}
