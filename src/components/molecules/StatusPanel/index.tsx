"use client";

import StateShell from "@/components/molecules/StateShell";
import { useLocaleCopy } from "@/content/copy/use-copy";
import {
  Actions,
  HomeLink,
  Message,
  RetryButton,
  Title,
} from "./styles";

export type StatusPanelProps = {
  title: string;
  message: string;
  titleId?: string;
  homeHref?: string;
  homeLabel?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

export default function StatusPanel({
  title,
  message,
  titleId = "status-heading",
  homeHref,
  homeLabel,
  onRetry,
  retryLabel,
  className,
}: StatusPanelProps) {
  const { copy, href } = useLocaleCopy();
  const resolvedHomeHref = homeHref ?? href(copy.states.actions.homeHref);
  const resolvedHomeLabel = homeLabel ?? copy.states.actions.home;
  const resolvedRetry = retryLabel ?? copy.states.actions.retry;
  return (
    <StateShell
      className={className}
      id="main-content"
      tabIndex={-1}
      aria-labelledby={titleId}
    >
      <Title id={titleId}>{title}</Title>
      <Message>{message}</Message>
      <Actions>
        {onRetry ? (
          <RetryButton type="button" onClick={onRetry}>
            {resolvedRetry}
          </RetryButton>
        ) : null}
        <HomeLink href={resolvedHomeHref} prefetch={false}>
          ← {resolvedHomeLabel}
        </HomeLink>
      </Actions>
    </StateShell>
  );
}
