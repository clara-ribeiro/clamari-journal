"use client";

import { useEffect, useMemo, useState } from "react";
import { getImageProps } from "next/image";
import { preload } from "react-dom";
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
import { isTmdbImageUrl, tmdbImageLoader } from "@/lib/tmdb-image";
import {
  Cell,
  Content,
  Empty,
  Grid,
  ListGrid,
  LoadMore,
  Page,
  Summary,
  Title,
} from "./styles";

/** Initial paint budget — full catalogs (hundreds of cards) blow TBT on hydrate. */
const PAGE_SIZE = 30;

const POSTER_SIZES =
  "(max-width: 767px) 45vw, (max-width: 1023px) 30vw, 18vw";

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

function compareDateNewest(a: CatalogCardItem, b: CatalogCardItem) {
  return (b.sortDate ?? "").localeCompare(a.sortDate ?? "");
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
      case "dateNewest": {
        // Default: reviewed titles first, then newest activity.
        const reviewDelta = Number(b.hasReview) - Number(a.hasReview);
        return reviewDelta !== 0 ? reviewDelta : compareDateNewest(a, b);
      }
      case "dateOldest":
        return (a.sortDate ?? "").localeCompare(b.sortDate ?? "");
      case "ratingHigh":
        return b.sortRating - a.sortRating;
      case "ratingLow":
        return a.sortRating - b.sortRating;
      case "favoritesFirst": {
        const favoriteDelta = Number(b.favorite) - Number(a.favorite);
        return favoriteDelta !== 0 ? favoriteDelta : compareDateNewest(a, b);
      }
      case "reviewsFirst": {
        const reviewDelta = Number(b.hasReview) - Number(a.hasReview);
        return reviewDelta !== 0 ? reviewDelta : compareDateNewest(a, b);
      }
      default:
        return 0;
    }
  });
  return next;
}

/** Kick off the mobile LCP poster (first card) early in the document. */
function preloadLcpPoster(posterUrl: string | null | undefined) {
  if (!posterUrl) return;
  const { props } = getImageProps({
    src: posterUrl,
    alt: "",
    width: 342,
    height: 513,
    sizes: POSTER_SIZES,
    ...(isTmdbImageUrl(posterUrl)
      ? { loader: tmdbImageLoader }
      : { quality: 60 }),
    // Must match the LCP <Image> — otherwise Next's LCP observer warns on lazy.
    loading: "eager",
    fetchPriority: "high",
  });
  preload(props.src, {
    as: "image",
    imageSrcSet: props.srcSet,
    imageSizes: props.sizes,
    fetchPriority: "high",
  });
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
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = items.filter((item) => {
      if (statusFilter && item.statusKey !== statusFilter) return false;
      if (!query) return true;
      return item.title.toLowerCase().includes(query);
    });
    return sortItems(filtered, sort);
  }, [items, search, statusFilter, sort]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, statusFilter, sort, view]);

  const shownItems = visibleItems.slice(0, visibleCount);
  const hasMore = visibleCount < visibleItems.length;

  // Default sort is newest — match that for the LCP preload target.
  preloadLcpPoster(visibleItems[0]?.posterUrl);

  return (
    <Page medium={medium}>
      <CatalogHero medium={medium} copy={copy.hero} />
      <Title id={copy.titleId}>{copy.title}</Title>
      <Content id="main-content" aria-labelledby={copy.titleId}>
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
          <>
            <ListGrid aria-label={copy.listAriaLabel} tone={tone}>
              {shownItems.map((item) => (
                <Cell key={item.slug} tone={tone}>
                  <CatalogEntryCard item={item} tone={tone} layout="list" />
                </Cell>
              ))}
            </ListGrid>
            {hasMore ? (
              <LoadMore
                type="button"
                tone={tone}
                onClick={() => setVisibleCount(visibleItems.length)}
              >
                {catalogCopy.toolbar.seeAll}
              </LoadMore>
            ) : null}
          </>
        ) : (
          <>
            <Grid aria-label={copy.listAriaLabel} tone={tone}>
              {shownItems.map((item, index) => (
                <Cell key={item.slug} tone={tone}>
                  <CatalogEntryCard
                    item={item}
                    tone={tone}
                    layout="cards"
                    priority={index === 0}
                  />
                </Cell>
              ))}
            </Grid>
            {hasMore ? (
              <LoadMore
                type="button"
                tone={tone}
                onClick={() => setVisibleCount(visibleItems.length)}
              >
                {catalogCopy.toolbar.seeAll}
              </LoadMore>
            ) : null}
          </>
        )}
      </Content>
    </Page>
  );
}
