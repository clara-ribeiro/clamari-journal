import { getStatsPageData } from "@/application/use-cases/stats";
import StatsTemplate from "@/components/templates/StatsTemplate";
import { preload } from "react-dom";

export default function StatsPage() {
  // Match StatsHero sizes: ~60vw. Mobile Lighthouse uses ~412 CSS px → ~247px
  // display; preload 480w. Larger viewports use 1080w.
  preload("/images/stats/ballerina-480.webp", {
    as: "image",
    type: "image/webp",
    fetchPriority: "high",
    imageSrcSet:
      "/images/stats/ballerina-480.webp 480w, /images/stats/ballerina-720.webp 720w, /images/stats/ballerina-1080.webp 1080w, /images/stats/ballerina-1600.webp 1600w",
    imageSizes: "(max-width: 1023px) 60vw, min(60vw, 48rem)",
  });

  const { metrics, goals } = getStatsPageData();
  return <StatsTemplate metrics={metrics} goals={goals} />;
}
