import { Root, Title } from "./styles";

export type BrandTitleProps = {
  id?: string;
  children: string;
  className?: string;
};

export default function BrandTitle({
  id = "hero-heading",
  children,
  className,
}: BrandTitleProps) {
  return (
    <Root className={className}>
      <Title id={id}>{children}</Title>
    </Root>
  );
}
