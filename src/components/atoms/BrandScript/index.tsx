import { Root, Script } from "./styles";

export type BrandScriptProps = {
  children: string;
  className?: string;
};

export default function BrandScript({
  children,
  className,
}: BrandScriptProps) {
  return (
    <Root className={className} aria-hidden="true">
      <Script>{children}</Script>
    </Root>
  );
}
