import type { Metadata } from "next";
import { ReviewsScreen, reviewsMetadata } from "@/lib/locale-screens";

export const metadata: Metadata = reviewsMetadata("pt-BR");

type ReviewsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PortugueseReviewsPage({
  searchParams,
}: ReviewsPageProps) {
  return ReviewsScreen({ locale: "pt-BR", searchParams });
}
