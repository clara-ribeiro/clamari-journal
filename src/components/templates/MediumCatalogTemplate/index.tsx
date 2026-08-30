"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getImageProps } from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { isStorybookRuntime } from "@/lib/is-storybook";
import { preload } from "react-dom";
import type { CatalogCardItem } from "@/application/dto";
import type { MediumCatalogCopy } from "@/content/copy";
import { useLocaleCopy } from "@/content/copy/use-copy";
import CatalogEntryCard from "@/components/molecules/CatalogEntryCard";
import CatalogToolbar, {
  type CatalogSortId,
  type CatalogTone,
  type CatalogViewMode,
} from "@/components/molecules/CatalogToolbar";
import CatalogHero, {
  type CatalogMedium,
} from "@/components/organisms/CatalogHero";
import { selectCatalogItems } from "@/lib/catalog-items";
import { catalogQueryString } from "@/lib/catalog-search-params";
import { formatCatalogSummary } from "@/lib/catalog-summary";
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

function statusOptionsFor(
  medium: CatalogMedium,
  catalog: ReturnType<typeof useLocaleCopy>["copy"]["catalog"],
) {
  return Object.entries(catalog.status[medium]).map(([value, label]) => ({
    value,
    label,
  }));
}

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
  const { copy: bundle } = useLocaleCopy();
  const catalog = bundle.catalog;
  const tone = toneForMedium(medium);
  const router = useRouter();
  const pathname = usePathname();
  const lastSyncedUrl = useRef<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [yearFilter, setYearFilter] = useState<number | null>(initialYear);
  const [reviewActive, setReviewActive] = useState(false);
  const [favoriteActive, setFavoriteActive] = useState(false);
  const [sort, setSort] = useState<CatalogSortId>("default");
  const [view, setView] = useState<CatalogViewMode>("cards");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [syncedInitial, setSyncedInitial] = useState({
    status: initialStatus,
    year: initialYear,
  });
  const filterKey = [
    search,
    statusFilter,
    yearFilter,
    reviewActive,
    favoriteActive,
    sort,
    view,
  ].join("\0");
  const [resetFilterKey, setResetFilterKey] = useState(filterKey);

  if (
    syncedInitial.status !== initialStatus ||
    syncedInitial.year !== initialYear
  ) {
    setSyncedInitial({ status: initialStatus, year: initialYear });
    setStatusFilter(initialStatus);
    setYearFilter(initialYear);
  }

  if (resetFilterKey !== filterKey) {
    setResetFilterKey(filterKey);
    setVisibleCount(PAGE_SIZE);
  }

  useEffect(() => {
    // Docs autodocs mounts every story on one page; shared URL + replace
    // fights between variants (e.g. Films vs FilteredInitial) and shakes.
    if (isStorybookRuntime()) return;

    const query = catalogQueryString({
      status: statusFilter,
      year: yearFilter,
    });
    const hash = yearFilter != null ? "#main-content" : "";
    const nextUrl = `${pathname}${query}${hash}`;

    // Read only catalog keys — Storybook’s iframe adds `id` / `viewMode` to
    // window.location.search, which must not trigger a replace loop.
    const live = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : "",
    );
    const liveStatus = live.get("status")?.trim() ?? "";
    const liveYearRaw = live.get("year")?.trim();
    const liveYear =
      liveYearRaw && /^\d{4}$/.test(liveYearRaw) ? Number(liveYearRaw) : null;

    if (liveStatus === statusFilter && liveYear === yearFilter) {
      lastSyncedUrl.current = nextUrl;
      return;
    }

    if (lastSyncedUrl.current === nextUrl) return;
    lastSyncedUrl.current = nextUrl;
    router.replace(nextUrl, { scroll: false });
  }, [pathname, router, statusFilter, yearFilter]);

  useEffect(() => {
    if (isStorybookRuntime() || initialYear == null) return;
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

  const visibleItems = useMemo(
    () =>
      selectCatalogItems(
        items,
        {
          search,
          statusFilter,
          yearFilter,
          reviewActive,
          favoriteActive,
        },
        sort,
      ),
    [
      items,
      search,
      statusFilter,
      yearFilter,
      reviewActive,
      favoriteActive,
      sort,
    ],
  );

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
      <Content id="main-content" tabIndex={-1} aria-labelledby={copy.titleId}>
        <Title id={copy.titleId}>{copy.title}</Title>
        <CatalogToolbar
          tone={tone}
          medium={medium}
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          statusOptions={statusOptionsFor(medium, catalog)}
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
                {catalog.toolbar.seeAll}
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
                {catalog.toolbar.seeAll}
              </LoadMore>
            ) : null}
          </>
        )}

        <Summary>{liveSummary}</Summary>
      </Content>
    </Page>
  );
}
