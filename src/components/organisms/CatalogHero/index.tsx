import type { MediumCatalogHeroCopy } from "@/content/copy";
import { booksCopy, filmsCopy, seriesCopy } from "@/content/copy";
import { Band, Section } from "./styles";

export type CatalogMedium = "films" | "books" | "series";

const mediumHeroSrc = {
  films: filmsCopy.list.hero.image.src,
  books: booksCopy.list.hero.image.src,
  series: seriesCopy.list.hero.image.src,
} as const;

export type CatalogHeroProps = {
  medium: CatalogMedium;
  copy: MediumCatalogHeroCopy;
  className?: string;
};

export default function CatalogHero({
  medium,
  copy,
  className,
}: CatalogHeroProps) {
  return (
    <Section id={copy.sentinelId} className={className} aria-hidden medium={medium}>
      <Band>
        {/* Decorative wordmark art; page title lives in a visually hidden h1. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediumHeroSrc[medium]} alt="" />
      </Band>
    </Section>
  );
}
