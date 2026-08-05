import { Icon, Root } from "./styles";

const SPARKLE_SRC = "/images/home/hero/button-shine-icon.svg";

export type SparkleIconProps = {
  className?: string;
};

export default function SparkleIcon({ className }: SparkleIconProps) {
  return (
    <Root className={className} aria-hidden="true">
      <Icon src={SPARKLE_SRC} alt="" width={40} height={50} />
    </Root>
  );
}
