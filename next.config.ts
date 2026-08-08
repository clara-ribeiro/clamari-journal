import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  images: {
    // Dev: don't keep optimized copies on disk — replacing a file under
    // `public/` at the same path otherwise keeps serving the stale encode
    // until `rm -rf .next/cache/images` or a production rebuild.
    ...(isDev ? { maximumDiskCacheSize: 0, minimumCacheTTL: 0 } : {}),
    // Allow lower quality for catalog posters / decorative heroes (mobile LCP).
    qualities: [60, 75],
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
