"use client";

import type { ReactNode } from "react";
import {
  Alternate,
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
  alternateHref?: string | null;
  alternateLabel?: string | null;
  alternateLang?: string | null;
};

export default function ReviewRenderer({
  heading,
  headingId,
  emptyLabel,
  html,
  children,
  className,
  alternateHref,
  alternateLabel,
  alternateLang,
}: ReviewRendererProps) {
  const compiled = html?.trim() ?? "";
  const hasHtml = compiled.length > 0;
  const showAlternate = Boolean(alternateHref && alternateLabel);

  return (
    <Root className={className} aria-labelledby={headingId}>
      <Title id={headingId}>{heading}</Title>
      {showAlternate ? (
        <Alternate
          href={alternateHref!}
          hrefLang={alternateLang ?? undefined}
          lang={alternateLang ?? undefined}
          prefetch={false}
        >
          {alternateLabel}
        </Alternate>
      ) : null}
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
