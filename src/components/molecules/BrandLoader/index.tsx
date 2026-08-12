"use client";

import StateShell from "@/components/molecules/StateShell";
import { statesCopy } from "@/content/copy/states";
import { Label } from "./styles";

export type BrandLoaderProps = {
  label?: string;
  className?: string;
};

/** Loading state over rotating melancholic stills. */
export default function BrandLoader({
  label = statesCopy.loading.label,
  className,
}: BrandLoaderProps) {
  return (
    <StateShell className={className} id="main-content" tabIndex={-1} rotate>
      <Label role="status" aria-live="polite" aria-busy={true}>
        {label}
      </Label>
    </StateShell>
  );
}
