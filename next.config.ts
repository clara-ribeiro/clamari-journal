import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // Markdown reviews are read from disk (`readFileSync`), so NFT cannot
  // see them. Without this, production prerenders as "Review on the way."
  outputFileTracingIncludes: {
    "/films/[slug]": ["./src/content/reviews/films/**/*.md"],
    "/series/[slug]": ["./src/content/reviews/series/**/*.md"],
    "/books/[slug]": ["./src/content/reviews/books/**/*.md"],
    "/sitemap.xml": ["./src/content/reviews/**/*.md"],
  },
  images: {
    // Dev: don't keep optimized copies on disk — replacing a file under
    // `public/` at the same path otherwise keeps serving the stale encode
    // until `rm -rf .next/cache/images` or a production rebuild.
    ...(isDev ? { maximumDiskCacheSize: 0, minimumCacheTTL: 0 } : {}),
    // Allow lower quality for catalog posters / decorative heroes (mobile LCP).
    qualities: [60, 65, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "books.google.com",
        pathname: "/books/**",
      },
      {
        protocol: "http",
        hostname: "books.google.com",
        pathname: "/books/**",
      },
      {
        protocol: "https",
        hostname: "books.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
