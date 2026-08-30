import type { Metadata } from "next";
import { ReviewsScreen, reviewsMetadata } from "@/lib/locale-screens";

export const metadata: Metadata = reviewsMetadata("en");

type ReviewsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  return ReviewsScreen({ locale: "en", searchParams });
}
