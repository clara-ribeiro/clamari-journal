"use client";

import StateShell from "@/components/molecules/StateShell";
import { useLocaleCopy } from "@/content/copy/use-copy";
import { Label } from "./styles";

export type BrandLoaderProps = {
  label?: string;
  className?: string;
};

/** Loading state over rotating melancholic stills. */
export default function BrandLoader({
  label,
  className,
}: BrandLoaderProps) {
  const { copy } = useLocaleCopy();
  const resolved = label ?? copy.states.loading.label;
  return (
    <StateShell className={className} id="main-content" tabIndex={-1} rotate>
      <Label role="status" aria-live="polite" aria-busy={true}>
        {resolved}
      </Label>
    </StateShell>
  );
}
