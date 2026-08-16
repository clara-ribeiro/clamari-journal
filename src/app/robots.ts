import type { MetadataRoute } from "next";
import { allowSearchIndexing, absoluteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const index = allowSearchIndexing();

  return {
    rules: index
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: new URL(absoluteUrl("/")).host,
  };
}
