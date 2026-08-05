import { preload } from "react-dom";
import HomeTemplate from "@/components/templates/HomeTemplate";

const LETTERING_BG_MOBILE = "/images/home/hero/lettering-background-mobile.webp";
const LETTERING_BG_DESKTOP = "/images/home/hero/lettering-background.webp";

export default function HomePage() {
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

  return (
    <main id="main-content">
      <HomeTemplate />
    </main>
  );
}
