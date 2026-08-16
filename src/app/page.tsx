import { getHomeFeeds } from "@/application/use-cases/entries";
import { getLifetimeStats } from "@/application/use-cases/stats";
import HomeTemplate from "@/components/templates/HomeTemplate";
import { homeCopy, siteCopy } from "@/content/copy";
import { pageMetadata } from "@/lib/page-metadata";
import { preload } from "react-dom";

const HOME_FEED_LIMIT = 5;

export const metadata = pageMetadata({
  title: siteCopy.metadata.titleDefault,
  description: siteCopy.metadata.description,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  preload(homeCopy.hero.lettering.mobile, {
    as: "image",
    type: "image/webp",
    fetchPriority: "high",
    media: "(max-width: 767px)",
  });
  preload(homeCopy.hero.lettering.desktop, {
    as: "image",
    type: "image/webp",
    fetchPriority: "high",
    media: "(min-width: 768px)",
  });

  const { recentEntries, reviewEntries, favoriteEntries } =
    getHomeFeeds(HOME_FEED_LIMIT);
  const lifetimeStats = getLifetimeStats();

  return (
    <main id="main-content" tabIndex={-1}>
      <HomeTemplate
        recentEntries={recentEntries}
        reviewEntries={reviewEntries}
        favoriteEntries={favoriteEntries}
        pagesRead={lifetimeStats.pagesRead}
        watchedHours={lifetimeStats.watchedHours}
      />
    </main>
  );
}
