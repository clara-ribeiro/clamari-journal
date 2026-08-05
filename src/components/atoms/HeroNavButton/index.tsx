import SparkleIcon from "@/components/atoms/SparkleIcon";
import { ButtonLink, Root } from "./styles";

export type HeroNavButtonProps = {
  href: string;
  label: string;
  className?: string;
};

export default function HeroNavButton({
  href,
  label,
  className,
}: HeroNavButtonProps) {
  return (
    <Root className={className}>
      <ButtonLink href={href} aria-label={label} prefetch={false}>
        <SparkleIcon />
        <span>{label}</span>
        <SparkleIcon />
      </ButtonLink>
    </Root>
  );
}
