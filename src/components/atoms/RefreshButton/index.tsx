"use client";

import { useRouter } from "next/navigation";
import { useLocaleCopy } from "@/content/copy/use-copy";
import { Button } from "./styles";

export type RefreshButtonProps = {
  label?: string;
  className?: string;
};

/** Client-only refresh for soft provider failures (retryable). */
export default function RefreshButton({
  label,
  className,
}: RefreshButtonProps) {
  const router = useRouter();
  const { copy } = useLocaleCopy();
  const resolved = label ?? copy.states.actions.retry;

  return (
    <Button
      type="button"
      className={className}
      onClick={() => router.refresh()}
    >
      {resolved}
    </Button>
  );
}
