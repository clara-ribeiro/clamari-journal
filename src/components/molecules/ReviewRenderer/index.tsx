"use client";

import type { ReactNode } from "react";
import {
  Empty,
  Prose,
  Root,
  Title,
} from "./styles";

export type ReviewRendererProps = {
  heading: string;
  headingId: string;
  emptyLabel: string;
  children?: ReactNode;
  className?: string;
};

export default function ReviewRenderer({
  heading,
  headingId,
  emptyLabel,
  children,
  className,
}: ReviewRendererProps) {
  return (
    <Root className={className}>
      <Title id={headingId}>{heading}</Title>
      {children ? <Prose>{children}</Prose> : <Empty>{emptyLabel}</Empty>}
    </Root>
  );
}
