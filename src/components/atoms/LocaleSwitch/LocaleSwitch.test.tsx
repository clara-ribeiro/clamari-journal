// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { siteCopy } from "@/content/copy";

const navigation = vi.hoisted(() => ({ pathname: "/films/heat" }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
}));

import LocaleSwitch from "./index";

const copy = siteCopy.header.locale;

describe("LocaleSwitch", () => {
  it("marks English current and links to the Portuguese counterpart", () => {
    navigation.pathname = "/films/heat";
    render(<LocaleSwitch />);

    expect(
      screen.getByRole("navigation", { name: copy.ariaLabel }),
    ).toBeInTheDocument();
    expect(screen.getByText(copy.en)).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("link", { name: copy.ptName })).toHaveAttribute(
      "href",
      "/pt/films/heat",
    );
    expect(screen.queryByRole("link", { name: copy.enName })).toBeNull();
  });

  it("marks Portuguese current and links to the English counterpart", () => {
    navigation.pathname = "/pt/films/heat";
    render(<LocaleSwitch />);

    expect(screen.getByText(copy.pt)).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("link", { name: copy.enName })).toHaveAttribute(
      "href",
      "/films/heat",
    );
    expect(screen.queryByRole("link", { name: copy.ptName })).toBeNull();
  });
});
