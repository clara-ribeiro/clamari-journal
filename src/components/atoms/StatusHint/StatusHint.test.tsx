// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StatusHint from "./index";

describe("StatusHint", () => {
  it("renders the hint for hover and keeps it out of the accessible name", () => {
    render(
      <StatusHint hint="Stopped mid-way, with no plan to continue.">
        Abandoned
      </StatusHint>,
    );

    expect(screen.getByText("Abandoned")).toBeInTheDocument();
    expect(
      screen.getByText("Stopped mid-way, with no plan to continue."),
    ).toHaveAttribute("aria-hidden", "true");
  });

  it("exposes the hint to assistive tech when focusable", () => {
    render(
      <StatusHint hint="In progress — still being watched." focusable>
        Watching
      </StatusHint>,
    );

    const trigger = screen.getByText("Watching");
    expect(trigger).toHaveAttribute("tabindex", "0");
    const tooltipId = trigger?.getAttribute("aria-describedby");
    expect(tooltipId).toBeTruthy();
    expect(document.getElementById(tooltipId!)).toHaveTextContent(
      "In progress — still being watched.",
    );
  });

  it("renders children only when the hint is empty", () => {
    const { container } = render(
      <StatusHint hint="">Watching</StatusHint>,
    );
    expect(container.textContent).toBe("Watching");
    expect(container.querySelector("[data-status-hint]")).toBeNull();
  });
});
