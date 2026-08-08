import type { CatalogCardItem } from "@/application/dto";

type CatalogSummaryMedium = "films" | "series" | "books";

/** Fill a medium list summary template from the currently visible catalog items. */
export function formatCatalogSummary(
  medium: CatalogSummaryMedium,
  template: string,
  items: readonly CatalogCardItem[],
): string {
  const total = items.length;

  if (medium === "films") {
    const watched = items.filter(
      (item) => item.statusKey === "watched" || item.statusKey === "rewatch",
    ).length;
    const watchlist = items.filter(
      (item) => item.statusKey === "watchlist",
    ).length;
    return template
      .replace("{watched}", String(watched))
      .replace("{watchlist}", String(watchlist))
      .replace("{total}", String(total));
  }

  if (medium === "books") {
    const finished = items.filter((item) => item.statusKey === "finished")
      .length;
    const reading = items.filter((item) => item.statusKey === "reading")
      .length;
    return template
      .replace("{finished}", String(finished))
      .replace("{reading}", String(reading))
      .replace("{total}", String(total));
  }

  const episodes = items.reduce(
    (sum, item) => sum + (item.watchedEpisodeCount ?? 0),
    0,
  );
  const completed = items.filter((item) => item.statusKey === "completed")
    .length;
  const watching = items.filter((item) => item.statusKey === "watching")
    .length;

  return template
    .replace("{total}", String(total))
    .replace("{episodes}", String(episodes))
    .replace("{completed}", String(completed))
    .replace("{watching}", String(watching));
}
