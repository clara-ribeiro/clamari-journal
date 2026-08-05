import HeroNavButton from "@/components/atoms/HeroNavButton";
import { Root } from "./styles";

export type HeroNavItem = {
  href: string;
  label: string;
};

export type HeroNavProps = {
  items: readonly HeroNavItem[];
  ariaLabel: string;
  className?: string;
};

export default function HeroNav({
  items,
  ariaLabel,
  className,
}: HeroNavProps) {
  return (
    <Root className={className} aria-label={ariaLabel}>
      {items.map((item) => (
        <HeroNavButton key={item.href} href={item.href} label={item.label} />
      ))}
    </Root>
  );
}
