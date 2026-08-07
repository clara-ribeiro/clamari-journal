import type { MediumCatalogHeroCopy } from "@/content/copy";
import { Band, Section } from "./styles";

export type CatalogMedium = "films" | "books" | "series";

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
      <Band medium={medium} />
    </Section>
  );
}
