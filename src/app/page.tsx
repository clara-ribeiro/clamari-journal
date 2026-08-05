import { preload } from "react-dom";
import {
  listFavoriteEntries,
  listRecentEntries,
} from "@/application/use-cases/entries";
import HomeTemplate from "@/components/templates/HomeTemplate";

const LETTERING_BG_MOBILE = "/images/home/hero/lettering-background-mobile.webp";
const LETTERING_BG_DESKTOP = "/images/home/hero/lettering-background.webp";
const HOME_FEED_LIMIT = 5;

export default async function HomePage() {
  preload(LETTERING_BG_MOBILE, {
    as: "image",
    type: "image/webp",
    fetchPriority: "high",
    media: "(max-width: 767px)",
  });
  preload(LETTERING_BG_DESKTOP, {
    as: "image",
    type: "image/webp",
    fetchPriority: "high",
    media: "(min-width: 768px)",
  });

  const [recentEntries, favoriteEntries] = await Promise.all([
    listRecentEntries(HOME_FEED_LIMIT),
    listFavoriteEntries(HOME_FEED_LIMIT),
  ]);

  return (
    <main id="main-content">
      <HomeTemplate
        recentEntries={recentEntries}
        favoriteEntries={favoriteEntries}
      />
    </main>
  );
}
