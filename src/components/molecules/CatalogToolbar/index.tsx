"use client";

import { ArrowUpDown, Heart, LayoutGrid, List, ListFilter, Search, TextQuote } from "lucide-react";
import { catalogCopy } from "@/content/copy/catalog";
import {
  Control,
  ControlFace,
  ControlLabel,
  ControlValue,
  FilterToggle,
  FilterToggleLabel,
  IconWrap,
  NativeSelect,
  Root,
  SearchField,
  SearchInput,
  ViewToggle,
} from "./styles";

export type CatalogTone = "light" | "dark";

export type CatalogSortId =
  | "default"
  | "titleAsc"
  | "titleDesc"
  | "dateNewest"
  | "dateOldest"
  | "yearNewest"
  | "yearOldest"
  | "ratingHigh"
  | "ratingLow";

export type CatalogViewMode = "cards" | "list";

export type CatalogToolbarProps = {
  tone: CatalogTone;
  medium: "films" | "series" | "books";
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  statusOptions: readonly { value: string; label: string }[];
  reviewActive: boolean;
  onReviewActiveChange: (value: boolean) => void;
  favoriteActive: boolean;
  onFavoriteActiveChange: (value: boolean) => void;
  sort: CatalogSortId;
  onSortChange: (value: CatalogSortId) => void;
  view: CatalogViewMode;
  onViewChange: (value: CatalogViewMode) => void;
  className?: string;
};

const sharedSortIds: CatalogSortId[] = [
  "default",
  "titleAsc",
  "titleDesc",
  "dateNewest",
  "dateOldest",
  "ratingHigh",
  "ratingLow",
];

const filmOnlySortIds: CatalogSortId[] = ["yearNewest", "yearOldest"];

function sortIdsFor(medium: CatalogToolbarProps["medium"]): CatalogSortId[] {
  if (medium === "films") {
    return [
      "default",
      "titleAsc",
      "titleDesc",
      "dateNewest",
      "dateOldest",
      ...filmOnlySortIds,
      "ratingHigh",
      "ratingLow",
    ];
  }
  return sharedSortIds;
}

export default function CatalogToolbar({
  tone,
  medium,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  reviewActive,
  onReviewActiveChange,
  favoriteActive,
  onFavoriteActiveChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  className,
}: CatalogToolbarProps) {
  const copy = catalogCopy.toolbar;

  const statusLabel =
    statusOptions.find((option) => option.value === statusFilter)?.label ??
    copy.filtersAll;
  const sortLabel = copy.sortOptions[sort];
  const nextView: CatalogViewMode = view === "cards" ? "list" : "cards";

  return (
    <Root className={className} tone={tone}>
      <SearchField tone={tone}>
        <IconWrap aria-hidden>
          <Search />
        </IconWrap>
        <SearchInput
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={copy.searchPlaceholder[medium]}
          aria-label={copy.searchAriaLabel}
        />
      </SearchField>

      <FilterToggle
        type="button"
        tone={tone}
        active={reviewActive}
        aria-pressed={reviewActive}
        aria-label={copy.reviewAriaLabel}
        title={copy.reviewLabel}
        onClick={() => onReviewActiveChange(!reviewActive)}
      >
        <TextQuote aria-hidden />
        {reviewActive ? null : (
          <FilterToggleLabel>{copy.reviewLabel}</FilterToggleLabel>
        )}
      </FilterToggle>

      <FilterToggle
        type="button"
        tone={tone}
        active={favoriteActive}
        aria-pressed={favoriteActive}
        aria-label={copy.favoriteAriaLabel}
        title={copy.favoriteLabel}
        onClick={() => onFavoriteActiveChange(!favoriteActive)}
      >
        <Heart aria-hidden fill={favoriteActive ? "currentColor" : "none"} />
        {favoriteActive ? null : (
          <FilterToggleLabel>{copy.favoriteLabel}</FilterToggleLabel>
        )}
      </FilterToggle>

      <Control tone={tone}>
        <ControlFace>
          <IconWrap aria-hidden>
            <ArrowUpDown />
          </IconWrap>
          <ControlLabel>{copy.sortLabel}</ControlLabel>
          <ControlValue>{sortLabel}</ControlValue>
        </ControlFace>
        <NativeSelect
          aria-label={copy.sortAriaLabel}
          value={sort}
          onChange={(event) =>
            onSortChange(event.target.value as CatalogSortId)
          }
        >
          {sortIdsFor(medium).map((value) => (
            <option key={value} value={value}>
              {copy.sortOptions[value]}
            </option>
          ))}
        </NativeSelect>
      </Control>

      <Control tone={tone}>
        <ControlFace>
          <IconWrap aria-hidden>
            <ListFilter />
          </IconWrap>
          <ControlLabel>{copy.filtersLabel}</ControlLabel>
          <ControlValue>{statusLabel}</ControlValue>
        </ControlFace>
        <NativeSelect
          aria-label={copy.filtersAriaLabel}
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
        >
          <option value="">{copy.filtersAll}</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect>
      </Control>

      <ViewToggle
        type="button"
        tone={tone}
        aria-label={
          view === "cards" ? copy.viewListAriaLabel : copy.viewCardsAriaLabel
        }
        aria-pressed={view === "list"}
        title={view === "cards" ? copy.viewListLabel : copy.viewCardsLabel}
        onClick={() => onViewChange(nextView)}
      >
        {view === "cards" ? <LayoutGrid aria-hidden /> : <List aria-hidden />}
      </ViewToggle>
    </Root>
  );
}
