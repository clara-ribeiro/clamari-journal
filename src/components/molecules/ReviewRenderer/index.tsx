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
  /** Rendered review body — null until markdown/MDX reviews land (#26) */
  children?: ReactNode;
  className?: string;
};

/**
 * Shared review shell for medium detail pages.
 * Issue #26 will feed markdown/MDX into `children`.
 */
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
