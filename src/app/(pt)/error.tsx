"use client";

import { useEffect } from "react";
import StatusPanel from "@/components/molecules/StatusPanel";
import { statesCopy } from "@/content/copy/states";

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  const copy = statesCopy.error;

  useEffect(() => {
    // Keep provider payloads / stacks out of the UI — log digest only.
    console.error(error.digest ?? error.message);
  }, [error]);

  return (
    <StatusPanel
      titleId={copy.titleId}
      title={copy.title}
      message={copy.message}
      onRetry={retry}
    />
  );
}
