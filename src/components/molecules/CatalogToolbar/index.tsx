"use client";

import { ArrowUpDown, LayoutGrid, List, ListFilter, Search } from "lucide-react";
import { catalogCopy } from "@/content/copy/catalog";
import {
  Control,
  ControlFace,
  ControlValue,
  IconWrap,
  NativeSelect,
  Root,
  SearchField,
  SearchInput,
  ViewToggle,
} from "./styles";

export type CatalogTone = "light" | "dark";

export type CatalogSortId =
  | "titleAsc"
  | "titleDesc"
  | "dateNewest"
  | "dateOldest"
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
  sort: CatalogSortId;
  onSortChange: (value: CatalogSortId) => void;
  view: CatalogViewMode;
  onViewChange: (value: CatalogViewMode) => void;
  className?: string;
};

const sortOptions = Object.entries(catalogCopy.toolbar.sortOptions) as Array<
  [CatalogSortId, string]
>;

export default function CatalogToolbar({
  tone,
  medium,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
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

      <Control tone={tone}>
        <ControlFace>
          <IconWrap aria-hidden>
            <ListFilter />
          </IconWrap>
          <span>{copy.filtersLabel}</span>
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
            <ArrowUpDown />
          </IconWrap>
          <span>{copy.sortLabel}</span>
          <ControlValue>{sortLabel}</ControlValue>
        </ControlFace>
        <NativeSelect
          aria-label={copy.sortAriaLabel}
          value={sort}
          onChange={(event) =>
            onSortChange(event.target.value as CatalogSortId)
          }
        >
          {sortOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
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
