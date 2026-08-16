"use client";

import type { ReactNode } from "react";
import { reviewContentCopy } from "@/content/copy";
import { Body, Root, Summary } from "./styles";

export type SpoilerDisclosureProps = {
  label?: string;
  children: ReactNode;
  className?: string;
};

export default function SpoilerDisclosure({
  label = reviewContentCopy.spoilerSummary,
  children,
  className,
}: SpoilerDisclosureProps) {
  return (
    <Root className={className}>
      <Summary>{label}</Summary>
      <Body>{children}</Body>
    </Root>
  );
}
