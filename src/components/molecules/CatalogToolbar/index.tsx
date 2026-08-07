"use client";

import { ArrowUpDown, Heart, LayoutGrid, List, ListFilter, Search, TextQuote } from "lucide-react";
import { catalogCopy } from "@/content/copy/catalog";
import {
  Control,
  ControlFace,
  ControlsRow,
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
  | "yearNewest"
  | "yearOldest"
  | "ratingHigh"
  | "ratingLow"
  | "favoritesFirst"
  | "reviewsFirst";

export type CatalogViewMode = "cards" | "list";

export type CatalogReviewFilter = "" | "with-review" | "without-review";

export type CatalogFavoriteFilter = "" | "favorites";

export type CatalogToolbarProps = {
  tone: CatalogTone;
  medium: "films" | "series" | "books";
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  statusOptions: readonly { value: string; label: string }[];
  reviewFilter: CatalogReviewFilter;
  onReviewFilterChange: (value: CatalogReviewFilter) => void;
  favoriteFilter: CatalogFavoriteFilter;
  onFavoriteFilterChange: (value: CatalogFavoriteFilter) => void;
  sort: CatalogSortId;
  onSortChange: (value: CatalogSortId) => void;
  view: CatalogViewMode;
  onViewChange: (value: CatalogViewMode) => void;
  className?: string;
};

const sharedSortIds: CatalogSortId[] = [
  "titleAsc",
  "titleDesc",
  "dateNewest",
  "dateOldest",
  "ratingHigh",
  "ratingLow",
  "favoritesFirst",
  "reviewsFirst",
];

const filmOnlySortIds: CatalogSortId[] = ["yearNewest", "yearOldest"];

function sortIdsFor(medium: CatalogToolbarProps["medium"]): CatalogSortId[] {
  if (medium === "films") {
    return [
      "titleAsc",
      "titleDesc",
      "dateNewest",
      "dateOldest",
      ...filmOnlySortIds,
      "ratingHigh",
      "ratingLow",
      "favoritesFirst",
      "reviewsFirst",
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
  reviewFilter,
  onReviewFilterChange,
  favoriteFilter,
  onFavoriteFilterChange,
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
  const reviewLabel =
    reviewFilter === "with-review"
      ? copy.reviewWith
      : reviewFilter === "without-review"
        ? copy.reviewWithout
        : copy.reviewAll;
  const favoriteLabel =
    favoriteFilter === "favorites" ? copy.favoriteOnly : copy.favoriteAll;
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

      <ControlsRow>
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
              <TextQuote />
            </IconWrap>
            <span>{copy.reviewLabel}</span>
            <ControlValue>{reviewLabel}</ControlValue>
          </ControlFace>
          <NativeSelect
            aria-label={copy.reviewAriaLabel}
            value={reviewFilter}
            onChange={(event) =>
              onReviewFilterChange(event.target.value as CatalogReviewFilter)
            }
          >
            <option value="">{copy.reviewAll}</option>
            <option value="with-review">{copy.reviewWith}</option>
            <option value="without-review">{copy.reviewWithout}</option>
          </NativeSelect>
        </Control>

        <Control tone={tone}>
          <ControlFace>
            <IconWrap aria-hidden>
              <Heart />
            </IconWrap>
            <span>{copy.favoriteLabel}</span>
            <ControlValue>{favoriteLabel}</ControlValue>
          </ControlFace>
          <NativeSelect
            aria-label={copy.favoriteAriaLabel}
            value={favoriteFilter}
            onChange={(event) =>
              onFavoriteFilterChange(
                event.target.value as CatalogFavoriteFilter,
              )
            }
          >
            <option value="">{copy.favoriteAll}</option>
            <option value="favorites">{copy.favoriteOnly}</option>
          </NativeSelect>
        </Control>
      </ControlsRow>

      <ControlsRow>
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
            {sortIdsFor(medium).map((value) => (
              <option key={value} value={value}>
                {copy.sortOptions[value]}
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
      </ControlsRow>
    </Root>
  );
}
