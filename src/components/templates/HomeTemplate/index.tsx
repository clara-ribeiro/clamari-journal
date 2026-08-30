"use client";

import HomeHero from "@/components/organisms/HomeHero";
import EntriesCarousel from "@/components/organisms/EntriesCarousel";
import HomeJournalAbout from "@/components/organisms/HomeJournalAbout";
import StatsCollage from "@/components/organisms/StatsCollage";
import { useLocaleCopy } from "@/content/copy/use-copy";
import type { JournalEntry } from "@/application/dto";
import { intlLocale } from "@/lib/review-locale";
import { Root } from "./styles";

export type HomeTemplateProps = {
  recentEntries: JournalEntry[];
  reviewEntries: JournalEntry[];
  favoriteEntries: JournalEntry[];
  pagesRead: number;
  watchedHours: number;
  className?: string;
};

export default function HomeTemplate({
  recentEntries,
  reviewEntries,
  favoriteEntries,
  pagesRead,
  watchedHours,
  className,
}: HomeTemplateProps) {
  const { locale, copy, href } = useLocaleCopy();
  const home = copy.home;
  const collage = home.statsCollage;
  const formatCount = (value: number) =>
    value.toLocaleString(intlLocale(locale));

  return (
    <Root className={className}>
      <HomeHero
        titleId={home.hero.titleId}
        title={home.hero.title}
        script={home.hero.script}
        navAriaLabel={home.hero.nav.ariaLabel}
        navItems={home.hero.nav.items.map((item) => ({
          ...item,
          href: href(item.href),
        }))}
      />
      <EntriesCarousel
        entries={recentEntries}
        titleId={home.recentEntries.titleId}
        title={home.recentEntries.title}
        listAriaLabel={home.recentEntries.listAriaLabel}
        showAllLabel={home.recentEntries.showAllLabel}
        showAllHref={href(home.recentEntries.showAllHref)}
        priorityCount={1}
      />
      <HomeJournalAbout />
      <EntriesCarousel
        entries={reviewEntries}
        titleId={home.reviews.titleId}
        title={home.reviews.title}
        listAriaLabel={home.reviews.listAriaLabel}
        showAllLabel={home.reviews.showAllLabel}
        showAllHref={href(home.reviews.showAllHref)}
        priorityCount={0}
      />
      <EntriesCarousel
        entries={favoriteEntries}
        titleId={home.favorites.titleId}
        title={home.favorites.title}
        listAriaLabel={home.favorites.listAriaLabel}
        showAllLabel={home.favorites.showAllLabel}
        showAllHref={href(home.favorites.showAllHref)}
        priorityCount={0}
      />
      <StatsCollage
        stats={[
          {
            id: "pages",
            value: formatCount(pagesRead),
            label: collage.pagesLabel,
          },
          {
            id: "hours",
            value: formatCount(watchedHours),
            label: collage.hoursLabel,
          },
        ]}
        images={collage.images}
        titleId={collage.titleId}
        ariaLabel={collage.ariaLabel}
        statsHref={href(collage.statsHref)}
      />
    </Root>
  );
}
