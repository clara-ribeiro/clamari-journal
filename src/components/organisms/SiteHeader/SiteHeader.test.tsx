// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatusChromeProvider } from "@/components/providers/StatusChromeProvider";
import { siteCopy } from "@/content/copy";
import SiteHeader from "./index";

const navigation = vi.hoisted(() => ({ pathname: "/all-entries" }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
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

const locale = siteCopy.header.locale;

function renderHeader() {
  return render(
    <StatusChromeProvider>
      <SiteHeader />
    </StatusChromeProvider>,
  );
}

describe("SiteHeader", () => {
  it("centers the logo between navigation and the language switch", () => {
    navigation.pathname = "/all-entries";
    renderHeader();

    const language = screen.getByRole("navigation", { name: locale.ariaLabel });
    const primary = screen.getByRole("navigation", {
      name: siteCopy.header.navAriaLabel,
    });
    const brand = screen.getByRole("link", {
      name: siteCopy.brand.fullName,
    });
    expect(screen.getByRole("link", { name: locale.ptName })).toHaveAttribute(
      "href",
      "/pt/all-entries",
    );
    expect(primary.compareDocumentPosition(brand)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(brand.compareDocumentPosition(language)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
});
