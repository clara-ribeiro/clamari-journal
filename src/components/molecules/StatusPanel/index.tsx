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
  /** When set, shows a retry control (error boundaries / refreshable failures). */
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

/** Shared empty / error / not-found panel over a random melancholic still. */
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
