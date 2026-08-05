"use client";

import HomeHero from "@/components/organisms/HomeHero";
import EntriesCarousel from "@/components/organisms/EntriesCarousel";
import HomeStatsCollage from "@/components/organisms/HomeStatsCollage";
import { homeCopy } from "@/content/copy";
import type { JournalEntry } from "@/domain/entities";
import { Root } from "./styles";

export type HomeTemplateProps = {
  recentEntries: JournalEntry[];
  favoriteEntries: JournalEntry[];
  pagesRead: number;
  watchedHours: number;
  className?: string;
};

export default function HomeTemplate({
  recentEntries,
  favoriteEntries,
  pagesRead,
  watchedHours,
  className,
}: HomeTemplateProps) {
  return (
    <Root className={className}>
      <HomeHero />
      <EntriesCarousel
        entries={recentEntries}
        titleId={homeCopy.recentEntries.titleId}
        title={homeCopy.recentEntries.title}
        listAriaLabel={homeCopy.recentEntries.listAriaLabel}
        showAllLabel={homeCopy.recentEntries.showAllLabel}
        showAllHref={homeCopy.recentEntries.showAllHref}
      />
      <EntriesCarousel
        entries={favoriteEntries}
        titleId={homeCopy.favorites.titleId}
        title={homeCopy.favorites.title}
        listAriaLabel={homeCopy.favorites.listAriaLabel}
        showAllLabel={homeCopy.favorites.showAllLabel}
        showAllHref={homeCopy.favorites.showAllHref}
      />
      <HomeStatsCollage pagesRead={pagesRead} watchedHours={watchedHours} />
    </Root>
  );
}
