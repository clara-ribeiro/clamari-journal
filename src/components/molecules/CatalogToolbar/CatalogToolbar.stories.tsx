import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { CatalogSortId } from "@/lib/catalog-items";
import {
  filmStatusOptions,
  yearOptions,
} from "@/stories/fixtures";
import CatalogToolbar, {
  type CatalogToolbarProps,
  type CatalogViewMode,
} from "./index";

function InteractiveToolbar(
  props: Omit<
    CatalogToolbarProps,
    | "search"
    | "onSearchChange"
    | "statusFilter"
    | "onStatusFilterChange"
    | "yearFilter"
    | "onYearFilterChange"
    | "reviewActive"
    | "onReviewActiveChange"
    | "favoriteActive"
    | "onFavoriteActiveChange"
    | "sort"
    | "onSortChange"
    | "view"
    | "onViewChange"
    | "onClearAll"
  > &
    Partial<
      Pick<
        CatalogToolbarProps,
        | "search"
        | "statusFilter"
        | "yearFilter"
        | "reviewActive"
        | "favoriteActive"
        | "sort"
        | "view"
      >
    >,
) {
  const [search, setSearch] = useState(props.search ?? "");
  const [statusFilter, setStatusFilter] = useState(props.statusFilter ?? "");
  const [yearFilter, setYearFilter] = useState<number | null>(
    props.yearFilter ?? null,
  );
  const [reviewActive, setReviewActive] = useState(props.reviewActive ?? false);
  const [favoriteActive, setFavoriteActive] = useState(
    props.favoriteActive ?? false,
  );
  const [sort, setSort] = useState<CatalogSortId>(props.sort ?? "default");
  const [view, setView] = useState<CatalogViewMode>(props.view ?? "cards");

  return (
    <CatalogToolbar
      {...props}
      search={search}
      onSearchChange={setSearch}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      yearFilter={yearFilter}
      onYearFilterChange={setYearFilter}
      reviewActive={reviewActive}
      onReviewActiveChange={setReviewActive}
      favoriteActive={favoriteActive}
      onFavoriteActiveChange={setFavoriteActive}
      sort={sort}
      onSortChange={setSort}
      view={view}
      onViewChange={setView}
      onClearAll={() => {
        setSearch("");
        setStatusFilter("");
        setYearFilter(null);
        setReviewActive(false);
        setFavoriteActive(false);
        setSort("default");
        setView("cards");
      }}
    />
  );
}

const meta = {
  title: "Molecules/CatalogToolbar",
  component: CatalogToolbar,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { value: "films" },
  },
  render: (args) => <InteractiveToolbar {...args} />,
  args: {
    tone: "dark",
    medium: "films",
    statusOptions: filmStatusOptions,
    yearOptions,
    showReviewFilter: true,
    showFavoriteFilter: true,
  },
} satisfies Meta<typeof CatalogToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FilmsDark: Story = {};

export const SeriesLight: Story = {
  args: {
    tone: "light",
    medium: "series",
  },
  parameters: {
    backgrounds: { value: "paper" },
  },
};

export const FiltersActive: Story = {
  args: {
    search: "heat",
    statusFilter: "watched",
    yearFilter: 2024,
    reviewActive: true,
    favoriteActive: true,
    sort: "ratingHigh",
    view: "list",
  },
};
