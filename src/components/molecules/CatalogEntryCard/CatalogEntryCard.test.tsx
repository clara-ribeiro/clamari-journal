// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CatalogCardItem } from "@/application/dto";
import CatalogEntryCard from "./index";

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
    medium: "movie",
    slug: "heat",
    title: "Heat",
    href: "/films/heat",
    posterUrl: null,
    favorite: false,
    hasReview: false,
    statusLabel: "Watched",
    statusTone: "positive",
    yearLabel: "1995",
    activityLabel: "No date logged",
    favoriteLabel: "Favorite",
    reviewLabel: "With review",
    metaTags: [],
    statusKey: "watched",
    sortTitle: "heat",
    sortDate: null,
    sortRating: 0,
    sortYear: 1995,
    goalYears: [],
    watchedEpisodeCount: 0,
    ...overrides,
  };
}

describe("CatalogEntryCard", () => {
  it("shows a poster placeholder when artwork is missing", () => {
    const { container } = render(
      <CatalogEntryCard item={item({ posterUrl: null })} tone="dark" />,
    );
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("Heat")).toBeInTheDocument();
  });

  it("renders list layout without a poster", () => {
    render(
      <CatalogEntryCard
        item={item({ title: "Alien" })}
        tone="dark"
        layout="list"
      />,
    );
    expect(screen.getByRole("link", { name: /Alien/ })).toHaveAttribute(
      "href",
      "/films/heat",
    );
  });
});
