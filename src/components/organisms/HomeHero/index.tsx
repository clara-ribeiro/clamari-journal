import HeroBrand from "@/components/molecules/HeroBrand";
import HeroNav, { type HeroNavItem } from "@/components/molecules/HeroNav";
import { homeCopy } from "@/content/copy";
import { BrandStage, NavStage, Section } from "./styles";

export type HomeHeroProps = {
  titleId?: string;
  title?: string;
  script?: string;
  navAriaLabel?: string;
  navItems?: readonly HeroNavItem[];
  className?: string;
};

export default function HomeHero({
  titleId = homeCopy.hero.titleId,
  title = homeCopy.hero.title,
  script = homeCopy.hero.script,
  navAriaLabel = homeCopy.hero.nav.ariaLabel,
  navItems = homeCopy.hero.nav.items,
  className,
}: HomeHeroProps) {
  return (
    <Section className={className} aria-labelledby={titleId}>
      <BrandStage>
        <HeroBrand titleId={titleId} title={title} script={script} />
      </BrandStage>
      <NavStage>
        <HeroNav items={navItems} ariaLabel={navAriaLabel} />
      </NavStage>
    </Section>
  );
}
