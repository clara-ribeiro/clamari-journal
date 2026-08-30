"use client";

import { useEffect } from "react";
import StatusPanel from "@/components/molecules/StatusPanel";
import { useLocaleCopy } from "@/content/copy/use-copy";

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  const { copy, href } = useLocaleCopy();
  const panel = copy.states.error;

  useEffect(() => {
    console.error(error.digest ?? error.message);
  }, [error]);

  return (
    <StatusPanel
      titleId={panel.titleId}
      title={panel.title}
      message={panel.message}
      onRetry={retry}
      retryLabel={copy.states.actions.retry}
      homeHref={href(copy.states.actions.homeHref)}
      homeLabel={copy.states.actions.home}
    />
  );
}
