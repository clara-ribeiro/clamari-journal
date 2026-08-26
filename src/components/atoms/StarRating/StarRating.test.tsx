// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StarRating from "./index";

describe("StarRating", () => {
  it("fills whole stars only", () => {
    const { container } = render(<StarRating value={5} />);
    const icons = container.querySelectorAll("svg");
    expect(icons).toHaveLength(5);
    expect(
      [...icons].filter((icon) => icon.getAttribute("data-state") === "full"),
    ).toHaveLength(5);
    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "Rated 5 out of 5",
    );
  });

  it("does not render half stars", () => {
    const { container } = render(<StarRating value={3} />);
    expect(container.querySelector("[data-half]")).toBeNull();
    const icons = container.querySelectorAll("svg");
    expect(
      [...icons].map((icon) => icon.getAttribute("data-state")),
    ).toEqual(["full", "full", "full", "empty", "empty"]);
  });
});
