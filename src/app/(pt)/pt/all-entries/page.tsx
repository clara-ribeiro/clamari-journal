import type { Metadata } from "next";
import { AllEntriesScreen, allEntriesMetadata } from "@/lib/locale-screens";

export const metadata: Metadata = allEntriesMetadata("pt-BR");

type AllEntriesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PortugueseAllEntriesPage({
  searchParams,
}: AllEntriesPageProps) {
  return AllEntriesScreen({ locale: "pt-BR", searchParams });
}
