"use client";

import { type ReactNode } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { getCssText, globalStyles } from "@/styles/stitches.config";

globalStyles();

export default function StitchesRegistry({
  children,
}: {
  children: ReactNode;
}) {
  useServerInsertedHTML(() => (
    <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
  ));

  return <>{children}</>;
}
