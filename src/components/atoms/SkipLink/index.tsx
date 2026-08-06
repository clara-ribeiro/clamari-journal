"use client";

import { siteCopy } from "@/content/copy";
import { SkipLink as Root } from "./styles";

export default function SkipLink() {
  return (
    <Root href={`#${siteCopy.a11y.mainContentId}`}>
      {siteCopy.a11y.skipToContent}
    </Root>
  );
}
