"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { Bubble, Root } from "./styles";

export type StatusHintProps = {
  hint: string;
  children: ReactNode;
  /** Keyboard-focusable wrapper — use on detail facts, not inside links. */
  focusable?: boolean;
  /** `end` aligns to the badge; `start` keeps detail-page copy in the value column. */
  placement?: "start" | "end";
  className?: string;
};

export default function StatusHint({
  hint,
  children,
  focusable = false,
  placement = "end",
  className,
}: StatusHintProps) {
  const tooltipId = useId();

  if (!hint) return children;

  return (
    <Root
      className={className}
      tabIndex={focusable ? 0 : undefined}
      aria-describedby={focusable ? tooltipId : undefined}
    >
      {children}
      <Bubble
        id={focusable ? tooltipId : undefined}
        data-status-hint
        placement={placement}
        role={focusable ? "tooltip" : undefined}
        aria-hidden={focusable ? undefined : true}
      >
        {hint}
      </Bubble>
    </Root>
  );
}
