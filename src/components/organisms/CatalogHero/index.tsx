import Image from "next/image";
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
        <Image
          src={mediumHeroSrc[medium]}
          alt=""
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1439px) 100vw, 90rem"
          // Decorative band — on mobile LCP is the first catalog poster, so
          // keep this out of the critical image queue.
          fetchPriority="low"
          quality={60}
          style={{ objectFit: "cover" }}
        />
      </Band>
    </Section>
  );
}
