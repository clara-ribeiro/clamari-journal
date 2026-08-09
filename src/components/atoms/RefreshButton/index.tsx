"use client";

import { useRouter } from "next/navigation";
import { statesCopy } from "@/content/copy/states";
import { Button } from "./styles";

export type RefreshButtonProps = {
  label?: string;
  className?: string;
};

/** Client-only refresh for soft provider failures (retryable). */
export default function RefreshButton({
  label = statesCopy.actions.retry,
  className,
}: RefreshButtonProps) {
  const router = useRouter();

  return (
    <Button
      type="button"
      className={className}
      onClick={() => router.refresh()}
    >
      {label}
    </Button>
  );
}
