// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import StatusPanel from "./index";
import { statesCopy } from "@/content/copy/states";

vi.mock("@/components/molecules/StateShell", () => ({
  default: ({
    children,
    ...rest
  }: {
    children: React.ReactNode;
    id?: string;
    "aria-labelledby"?: string;
  }) => (
    <div data-testid="state-shell" {...rest}>
      {children}
    </div>
  ),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("StatusPanel", () => {
  it("renders title, message, and home link", () => {
    render(
      <StatusPanel
        title={statesCopy.notFound.title}
        message={statesCopy.notFound.message}
      />,
    );

    expect(
      screen.getByRole("heading", { name: statesCopy.notFound.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(statesCopy.notFound.message)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: `← ${statesCopy.actions.home}` }),
    ).toHaveAttribute("href", statesCopy.actions.homeHref);
  });

  it("shows retry when onRetry is provided", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(
      <StatusPanel
        title={statesCopy.error.title}
        message={statesCopy.error.message}
        onRetry={onRetry}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: statesCopy.actions.retry }),
    );
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
