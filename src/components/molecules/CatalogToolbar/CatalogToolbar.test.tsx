// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CatalogToolbar from "./index";
import { catalogCopy } from "@/content/copy/catalog";

describe("CatalogToolbar", () => {
  const copy = catalogCopy.toolbar;

  function renderToolbar(
    overrides: Partial<React.ComponentProps<typeof CatalogToolbar>> = {},
  ) {
    const props: React.ComponentProps<typeof CatalogToolbar> = {
      tone: "dark",
      medium: "films",
      search: "",
      onSearchChange: vi.fn(),
      statusFilter: "",
      onStatusFilterChange: vi.fn(),
      statusOptions: [
        { value: "watched", label: "Watched" },
        { value: "watchlist", label: "Watchlist" },
      ],
      yearFilter: null,
      onYearFilterChange: vi.fn(),
      yearOptions: [2026, 2025],
      reviewActive: false,
      onReviewActiveChange: vi.fn(),
      favoriteActive: false,
      onFavoriteActiveChange: vi.fn(),
      sort: "default",
      onSortChange: vi.fn(),
      view: "cards",
      onViewChange: vi.fn(),
      onClearAll: vi.fn(),
      ...overrides,
    };
    return { user: userEvent.setup(), props, ...render(<CatalogToolbar {...props} />) };
  }

  it("wires search, status, year, sort, and view controls", async () => {
    const { user, props } = renderToolbar();

    await user.type(
      screen.getByRole("searchbox", { name: copy.searchAriaLabel }),
      "heat",
    );
    expect(props.onSearchChange).toHaveBeenCalled();

    await user.selectOptions(
      screen.getByRole("combobox", { name: copy.filtersAriaLabel }),
      "watched",
    );
    expect(props.onStatusFilterChange).toHaveBeenCalledWith("watched");

    await user.selectOptions(
      screen.getByRole("combobox", { name: copy.yearAriaLabel }),
      "2025",
    );
    expect(props.onYearFilterChange).toHaveBeenCalledWith(2025);

    await user.selectOptions(
      screen.getByRole("combobox", { name: copy.sortAriaLabel }),
      "titleAsc",
    );
    expect(props.onSortChange).toHaveBeenCalledWith("titleAsc");

    await user.click(
      screen.getByRole("button", { name: copy.viewListAriaLabel }),
    );
    expect(props.onViewChange).toHaveBeenCalledWith("list");
  });

  it("toggles review/favorite filters and clears active controls", async () => {
    const { user, props } = renderToolbar({
      search: "x",
      reviewActive: true,
      favoriteActive: true,
      sort: "titleAsc",
    });

    await user.click(
      screen.getAllByRole("button", { name: copy.reviewAriaLabel })[0]!,
    );
    expect(props.onReviewActiveChange).toHaveBeenCalledWith(false);

    await user.click(
      screen.getAllByRole("button", { name: copy.favoriteAriaLabel })[0]!,
    );
    expect(props.onFavoriteActiveChange).toHaveBeenCalledWith(false);

    await user.click(
      screen.getAllByRole("button", { name: copy.clearAllAriaLabel })[0]!,
    );
    expect(props.onClearAll).toHaveBeenCalled();
  });

  it("hides review and favorite toggles when the feed is already scoped", () => {
    renderToolbar({
      showReviewFilter: false,
      showFavoriteFilter: false,
    });
    expect(
      screen.queryAllByRole("button", { name: copy.reviewAriaLabel }),
    ).toHaveLength(0);
    expect(
      screen.queryAllByRole("button", { name: copy.favoriteAriaLabel }),
    ).toHaveLength(0);
  });
});
