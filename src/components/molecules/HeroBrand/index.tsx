import BrandScript from "@/components/atoms/BrandScript";
import BrandTitle from "@/components/atoms/BrandTitle";
import { Root, ScriptLayer } from "./styles";

export type HeroBrandProps = {
  titleId?: string;
  title: string;
  script: string;
  className?: string;
};

export default function HeroBrand({
  titleId,
  title,
  script,
  className,
}: HeroBrandProps) {
  return (
    <Root className={className}>
      <BrandTitle id={titleId}>{title}</BrandTitle>
      <ScriptLayer>
        <BrandScript>{script}</BrandScript>
      </ScriptLayer>
    </Root>
  );
}
