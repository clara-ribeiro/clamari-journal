"use client";

import { useMemo, useState } from "react";
import type { CatalogCardItem } from "@/application/dto";
import type { MediumCatalogCopy } from "@/content/copy";
import { catalogCopy } from "@/content/copy/catalog";
import CatalogEntryCard from "@/components/molecules/CatalogEntryCard";
import CatalogToolbar, {
  type CatalogSortId,
  type CatalogTone,
  type CatalogViewMode,
} from "@/components/molecules/CatalogToolbar";
import CatalogHero, {
  type CatalogMedium,
} from "@/components/organisms/CatalogHero";
import {
  Back,
  Cell,
  Content,
  Empty,
  Grid,
  ListGrid,
  Page,
  Summary,
  Title,
} from "./styles";

export type MediumCatalogTemplateProps = {
  medium: CatalogMedium;
  copy: MediumCatalogCopy;
  summary: string;
  items: CatalogCardItem[];
};

function toneForMedium(medium: CatalogMedium): CatalogTone {
  return medium === "films" ? "dark" : "light";
}

function statusOptionsFor(medium: CatalogMedium) {
  return Object.entries(catalogCopy.status[medium]).map(([value, label]) => ({
    value,
    label,
  }));
}

function sortItems(
  items: CatalogCardItem[],
  sort: CatalogSortId,
): CatalogCardItem[] {
  const next = [...items];
  next.sort((a, b) => {
    switch (sort) {
      case "titleAsc":
        return a.sortTitle.localeCompare(b.sortTitle);
      case "titleDesc":
        return b.sortTitle.localeCompare(a.sortTitle);
      case "dateNewest":
        return (b.sortDate ?? "").localeCompare(a.sortDate ?? "");
      case "dateOldest":
        return (a.sortDate ?? "").localeCompare(b.sortDate ?? "");
      case "ratingHigh":
        return b.sortRating - a.sortRating;
      case "ratingLow":
        return a.sortRating - b.sortRating;
      default:
        return 0;
    }
  });
  return next;
}

export default function MediumCatalogTemplate({
  medium,
  copy,
  summary,
  items,
}: MediumCatalogTemplateProps) {
  const tone = toneForMedium(medium);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState<CatalogSortId>("dateNewest");
  const [view, setView] = useState<CatalogViewMode>("cards");

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = items.filter((item) => {
      if (statusFilter && item.statusKey !== statusFilter) return false;
      if (!query) return true;
      return item.title.toLowerCase().includes(query);
    });
    return sortItems(filtered, sort);
  }, [items, search, statusFilter, sort]);

  return (
    <Page medium={medium}>
      <CatalogHero medium={medium} copy={copy.hero} />
      <Title id={copy.titleId}>{copy.title}</Title>
      <Content id="main-content" aria-labelledby={copy.titleId}>
        <Back href={copy.backHref} prefetch={false} medium={medium}>
          {copy.backLabel}
        </Back>
        <Summary>{summary}</Summary>

        <CatalogToolbar
          tone={tone}
          medium={medium}
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          statusOptions={statusOptionsFor(medium)}
          sort={sort}
          onSortChange={setSort}
          view={view}
          onViewChange={setView}
        />

        {visibleItems.length === 0 ? (
          <Empty medium={medium}>{copy.empty}</Empty>
        ) : view === "list" ? (
          <ListGrid aria-label={copy.listAriaLabel} tone={tone}>
            {visibleItems.map((item) => (
              <Cell key={item.slug} tone={tone}>
                <CatalogEntryCard item={item} tone={tone} layout="list" />
              </Cell>
            ))}
          </ListGrid>
        ) : (
          <Grid aria-label={copy.listAriaLabel} tone={tone}>
            {visibleItems.map((item, index) => (
              <Cell key={item.slug} tone={tone}>
                <CatalogEntryCard
                  item={item}
                  tone={tone}
                  layout="cards"
                  priority={index < 5}
                />
              </Cell>
            ))}
          </Grid>
        )}
      </Content>
    </Page>
  );
}
