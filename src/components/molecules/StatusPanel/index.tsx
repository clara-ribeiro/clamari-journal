"use client";

import StateShell from "@/components/molecules/StateShell";
import { statesCopy } from "@/content/copy/states";
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
  homeHref = statesCopy.actions.homeHref,
  homeLabel = statesCopy.actions.home,
  onRetry,
  retryLabel = statesCopy.actions.retry,
  className,
}: StatusPanelProps) {
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
            {retryLabel}
          </RetryButton>
        ) : null}
        <HomeLink href={homeHref} prefetch={false}>
          ← {homeLabel}
        </HomeLink>
      </Actions>
    </StateShell>
  );
}
