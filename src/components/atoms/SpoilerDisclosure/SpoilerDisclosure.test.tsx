// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { reviewContentCopy } from "@/content/copy";
import SpoilerDisclosure from "./index";

describe("SpoilerDisclosure", () => {
  it("keeps spoiler content collapsed until activated", async () => {
    const user = userEvent.setup();
    render(
      <SpoilerDisclosure>
        <p>They were dead the whole time.</p>
      </SpoilerDisclosure>,
    );

    const disclosure = screen.getByText(reviewContentCopy.spoilerSummary)
      .closest("details");
    expect(disclosure).toBeInTheDocument();
    expect(disclosure).not.toHaveAttribute("open");
    expect(
      screen.getByText("They were dead the whole time."),
    ).toBeInTheDocument();

    await user.click(screen.getByText(reviewContentCopy.spoilerSummary));
    expect(disclosure).toHaveAttribute("open");
  });

  it("uses a custom summary label", () => {
    render(
      <SpoilerDisclosure label="The ending">
        Hidden.
      </SpoilerDisclosure>,
    );
    expect(screen.getByText("The ending")).toBeInTheDocument();
  });
});
