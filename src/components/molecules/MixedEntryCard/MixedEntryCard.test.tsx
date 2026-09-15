// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CatalogCardItem } from "@/application/dto";
import { catalogCopy } from "@/content/copy/catalog";
import MixedEntryCard from "./index";

vi.mock("next/image", () => ({
  default: (props: {
    src: string;
    alt: string;
    onError?: () => void;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={props.src} alt={props.alt} onError={props.onError} />
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

function item(
  overrides: Partial<CatalogCardItem> = {},
): CatalogCardItem {
  return {
    medium: "series",
    slug: "steal",
    title: "Steal",
    href: "/series/steal",
    posterUrl: null,
    favorite: true,
    hasReview: false,
    statusLabel: "Completed",
    statusHint: catalogCopy.statusHint.series.completed,
    statusTone: "positive",
    yearLabel: "2026",
    activityLabel: "No date logged",
    favoriteLabel: "Favorite",
    reviewLabel: "With review",
    metaTags: [],
    statusKey: "completed",
    sortTitle: "steal",
    sortDate: null,
    sortRating: 0,
    sortYear: 2026,
    goalYears: [],
    watchedEpisodeCount: 6,
    ...overrides,
  };
}

describe("MixedEntryCard", () => {
  it("keeps the status hint inside the poster overlay", () => {
    render(<MixedEntryCard item={item()} />);

    expect(screen.getByRole("link", { name: /Steal/ })).toHaveAttribute(
      "href",
      "/series/steal",
    );
    expect(
      screen.getByText(catalogCopy.statusHint.series.completed),
    ).toHaveAttribute("aria-hidden", "true");
    expect(
      screen.getByText(catalogCopy.statusHint.series.completed),
    ).toHaveAttribute("data-placement", "stretch");
  });
});
