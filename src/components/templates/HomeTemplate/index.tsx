"use client";

import HomeHero from "@/components/organisms/HomeHero";
import EntriesCarousel from "@/components/organisms/EntriesCarousel";
import HomeJournalAbout from "@/components/organisms/HomeJournalAbout";
import HomeStatsCollage from "@/components/organisms/HomeStatsCollage";
import { homeCopy } from "@/content/copy";
import type { JournalEntry } from "@/application/dto";
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
        priorityCount={1}
      />
      <EntriesCarousel
        entries={favoriteEntries}
        titleId={homeCopy.favorites.titleId}
        title={homeCopy.favorites.title}
        listAriaLabel={homeCopy.favorites.listAriaLabel}
        showAllLabel={homeCopy.favorites.showAllLabel}
        showAllHref={homeCopy.favorites.showAllHref}
        priorityCount={0}
      />
      <HomeStatsCollage pagesRead={pagesRead} watchedHours={watchedHours} />
      <HomeJournalAbout />
    </Root>
  );
}
