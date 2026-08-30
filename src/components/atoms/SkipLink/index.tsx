"use client";

import { useLocaleCopy } from "@/content/copy/use-copy";
import { SkipLink as Root } from "./styles";

export default function SkipLink() {
  const { copy } = useLocaleCopy();
  return (
    <Root href={`#${copy.site.a11y.mainContentId}`}>
      {copy.site.a11y.skipToContent}
    </Root>
  );
}
