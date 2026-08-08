"use client";

import {
  ArrowUpDown,
  Calendar,
  FilterX,
  Heart,
  LayoutGrid,
  List,
  ListFilter,
  PencilLine,
  Search,
} from "lucide-react";
import { catalogCopy } from "@/content/copy/catalog";
import {
  ClearAllButton,
  ClearAllLabel,
  Control,
  ControlFace,
  ControlLabel,
  ControlValue,
  DropdownRow,
  FilterToggle,
  FilterToggleLabel,
  IconActions,
  IconWrap,
  NativeSelect,
  Root,
  SearchField,
  SearchInput,
  SearchRow,
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
  medium: "films" | "series" | "books" | "all";
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  statusOptions: readonly { value: string; label: string }[];
  yearFilter: number | null;
  onYearFilterChange: (value: number | null) => void;
  yearOptions: readonly number[];
  reviewActive: boolean;
  onReviewActiveChange: (value: boolean) => void;
  /** Hide when the page is already a reviews-only feed. Default true. */
  showReviewFilter?: boolean;
  favoriteActive: boolean;
  onFavoriteActiveChange: (value: boolean) => void;
  /** Hide when the page is already a favorites-only feed. Default true. */
  showFavoriteFilter?: boolean;
  sort: CatalogSortId;
  onSortChange: (value: CatalogSortId) => void;
  view: CatalogViewMode;
  onViewChange: (value: CatalogViewMode) => void;
  onClearAll: () => void;
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

const yearSortIds: CatalogSortId[] = ["yearNewest", "yearOldest"];

function sortIdsFor(medium: CatalogToolbarProps["medium"]): CatalogSortId[] {
  if (medium === "films" || medium === "all") {
    return [
      "default",
      "titleAsc",
      "titleDesc",
      "dateNewest",
      "dateOldest",
      ...yearSortIds,
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
  yearFilter,
  onYearFilterChange,
  yearOptions,
  reviewActive,
  onReviewActiveChange,
  showReviewFilter = true,
  favoriteActive,
  onFavoriteActiveChange,
  showFavoriteFilter = true,
  sort,
  onSortChange,
  view,
  onViewChange,
  onClearAll,
  className,
}: CatalogToolbarProps) {
  const copy = catalogCopy.toolbar;

  const statusLabel =
    statusOptions.find((option) => option.value === statusFilter)?.label ??
    copy.filtersAll;
  const yearLabel =
    yearFilter != null ? String(yearFilter) : copy.yearAll;
  const sortLabel = copy.sortOptions[sort];
  const nextView: CatalogViewMode = view === "cards" ? "list" : "cards";
  const canClear =
    search.trim() !== "" ||
    statusFilter !== "" ||
    yearFilter != null ||
    (showReviewFilter && reviewActive) ||
    (showFavoriteFilter && favoriteActive) ||
    sort !== "default";

  return (
    <Root className={className} tone={tone}>
      <SearchRow>
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

        <IconActions>
          {showReviewFilter ? (
            <FilterToggle
              type="button"
              tone={tone}
              active={reviewActive}
              aria-pressed={reviewActive}
              aria-label={copy.reviewAriaLabel}
              title={copy.reviewLabel}
              onClick={() => onReviewActiveChange(!reviewActive)}
            >
              <PencilLine aria-hidden />
              {reviewActive ? null : (
                <FilterToggleLabel>{copy.reviewLabel}</FilterToggleLabel>
              )}
            </FilterToggle>
          ) : null}

          {showFavoriteFilter ? (
            <FilterToggle
              type="button"
              tone={tone}
              active={favoriteActive}
              aria-pressed={favoriteActive}
              aria-label={copy.favoriteAriaLabel}
              title={copy.favoriteLabel}
              onClick={() => onFavoriteActiveChange(!favoriteActive)}
            >
              <Heart
                aria-hidden
                fill={favoriteActive ? "currentColor" : "none"}
              />
              {favoriteActive ? null : (
                <FilterToggleLabel>{copy.favoriteLabel}</FilterToggleLabel>
              )}
            </FilterToggle>
          ) : null}

          {canClear ? (
            <ClearAllButton
              type="button"
              tone={tone}
              aria-label={copy.clearAllAriaLabel}
              title={copy.clearAllLabel}
              onClick={onClearAll}
            >
              <FilterX aria-hidden />
              <ClearAllLabel>{copy.clearAllLabel}</ClearAllLabel>
            </ClearAllButton>
          ) : null}
        </IconActions>
      </SearchRow>

      <DropdownRow>
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

        <Control tone={tone}>
          <ControlFace>
            <IconWrap aria-hidden>
              <Calendar />
            </IconWrap>
            <ControlLabel>{copy.yearLabel}</ControlLabel>
            <ControlValue>{yearLabel}</ControlValue>
          </ControlFace>
          <NativeSelect
            aria-label={copy.yearAriaLabel}
            value={yearFilter == null ? "" : String(yearFilter)}
            onChange={(event) => {
              const value = event.target.value;
              onYearFilterChange(value ? Number(value) : null);
            }}
          >
            <option value="">{copy.yearAll}</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
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
          {view === "cards" ? (
            <LayoutGrid aria-hidden />
          ) : (
            <List aria-hidden />
          )}
        </ViewToggle>
      </DropdownRow>
    </Root>
  );
}
