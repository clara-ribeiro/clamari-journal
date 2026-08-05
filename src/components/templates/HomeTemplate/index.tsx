"use client";

import HomeHero from "@/components/organisms/HomeHero";
import RecentEntries from "@/components/organisms/RecentEntries";
import type { JournalEntry } from "@/domain/entities";
import { Root } from "./styles";

export type HomeTemplateProps = {
  recentEntries: JournalEntry[];
  className?: string;
};

export default function HomeTemplate({
  recentEntries,
  className,
}: HomeTemplateProps) {
  return (
    <Root className={className}>
      <HomeHero />
      <RecentEntries entries={recentEntries} />
    </Root>
  );
}
