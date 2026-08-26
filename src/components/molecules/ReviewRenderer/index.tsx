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
  html?: string | null;
  children?: ReactNode;
  className?: string;
};

export default function ReviewRenderer({
  heading,
  headingId,
  emptyLabel,
  html,
  children,
  className,
}: ReviewRendererProps) {
  const compiled = html?.trim() ?? "";
  const hasHtml = compiled.length > 0;

  return (
    <Root className={className} aria-labelledby={headingId}>
      <Title id={headingId}>{heading}</Title>
      {hasHtml ? (
        <Prose dangerouslySetInnerHTML={{ __html: compiled }} />
      ) : children ? (
        <Prose>{children}</Prose>
      ) : (
        <Empty>{emptyLabel}</Empty>
      )}
    </Root>
  );
}
