"use client";

import { useEffect, useMemo, useState } from "react";
import { getImageProps } from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
import { catalogQueryString } from "@/lib/catalog-search-params";
import { formatCatalogSummary } from "@/lib/catalog-summary";
import { foldSearchText } from "@/lib/search-text";
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
  items: CatalogCardItem[];
  initialStatus?: string;
  initialYear?: number | null;
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

function compareYearNewest(a: CatalogCardItem, b: CatalogCardItem) {
  return (b.sortYear ?? -1) - (a.sortYear ?? -1);
}

function sortItems(
  items: CatalogCardItem[],
  sort: CatalogSortId,
): CatalogCardItem[] {
  const next = [...items];
  next.sort((a, b) => {
    switch (sort) {
      case "default":
      case "dateNewest":
        return compareDateNewest(a, b);
      case "titleAsc":
        return a.sortTitle.localeCompare(b.sortTitle);
      case "titleDesc":
        return b.sortTitle.localeCompare(a.sortTitle);
      case "dateOldest":
        return (a.sortDate ?? "").localeCompare(b.sortDate ?? "");
      case "yearNewest":
        return compareYearNewest(a, b);
      case "yearOldest":
        return (a.sortYear ?? Number.MAX_SAFE_INTEGER) -
          (b.sortYear ?? Number.MAX_SAFE_INTEGER);
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
  items,
  initialStatus = "",
  initialYear = null,
}: MediumCatalogTemplateProps) {
  const tone = toneForMedium(medium);
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [yearFilter, setYearFilter] = useState<number | null>(initialYear);
  const [reviewActive, setReviewActive] = useState(false);
  const [favoriteActive, setFavoriteActive] = useState(false);
  const [sort, setSort] = useState<CatalogSortId>("default");
  const [view, setView] = useState<CatalogViewMode>("cards");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setStatusFilter(initialStatus);
    setYearFilter(initialYear);
  }, [initialStatus, initialYear]);

  useEffect(() => {
    const query = catalogQueryString({
      status: statusFilter,
      year: yearFilter,
    });
    const hash = yearFilter != null ? "#main-content" : "";
    const nextUrl = `${pathname}${query}${hash}`;
    const current =
      typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search}${window.location.hash}`
        : nextUrl;
    if (current !== nextUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [pathname, router, statusFilter, yearFilter]);

  // Goal deep-links (and `?year=`) should land on the catalog, not the hero.
  useEffect(() => {
    if (initialYear == null) return;
    const node = document.getElementById("main-content");
    if (!node) return;
    node.scrollIntoView({ behavior: "auto", block: "start" });
  }, [initialYear, pathname]);

  const yearOptions = useMemo(() => {
    const years = new Set<number>();
    for (const item of items) {
      for (const year of item.goalYears) years.add(year);
    }
    if (yearFilter != null) years.add(yearFilter);
    return [...years].sort((a, b) => b - a);
  }, [items, yearFilter]);

  const visibleItems = useMemo(() => {
    const query = foldSearchText(search.trim());
    const filtered = items.filter((item) => {
      if (statusFilter && item.statusKey !== statusFilter) return false;
      if (yearFilter != null && !item.goalYears.includes(yearFilter)) {
        return false;
      }
      if (reviewActive || favoriteActive) {
        const matchesReview = reviewActive && item.hasReview;
        const matchesFavorite = favoriteActive && item.favorite;
        if (!matchesReview && !matchesFavorite) return false;
      }
      if (!query) return true;
      return foldSearchText(item.title).includes(query);
    });
    return sortItems(filtered, sort);
  }, [
    items,
    search,
    statusFilter,
    yearFilter,
    reviewActive,
    favoriteActive,
    sort,
  ]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, statusFilter, yearFilter, reviewActive, favoriteActive, sort, view]);

  const shownItems = visibleItems.slice(0, visibleCount);
  const hasMore = visibleCount < visibleItems.length;
  const liveSummary = formatCatalogSummary(medium, copy.summary, visibleItems);

  // Match the first painted card for the LCP preload target.
  preloadLcpPoster(visibleItems[0]?.posterUrl);

  function clearAllControls() {
    setSearch("");
    setStatusFilter("");
    setYearFilter(null);
    setReviewActive(false);
    setFavoriteActive(false);
    setSort("default");
  }

  return (
    <Page medium={medium}>
      <CatalogHero medium={medium} copy={copy.hero} />
      <Content id="main-content" aria-labelledby={copy.titleId}>
        <Title id={copy.titleId}>{copy.title}</Title>
        <CatalogToolbar
          tone={tone}
          medium={medium}
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          statusOptions={statusOptionsFor(medium)}
          yearFilter={yearFilter}
          onYearFilterChange={setYearFilter}
          yearOptions={yearOptions}
          reviewActive={reviewActive}
          onReviewActiveChange={setReviewActive}
          favoriteActive={favoriteActive}
          onFavoriteActiveChange={setFavoriteActive}
          sort={sort}
          onSortChange={setSort}
          view={view}
          onViewChange={setView}
          onClearAll={clearAllControls}
        />

        {visibleItems.length === 0 ? (
          <Empty medium={medium}>
            {items.length === 0 ? copy.empty : copy.noResults}
          </Empty>
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

        <Summary>{liveSummary}</Summary>
      </Content>
    </Page>
  );
}
