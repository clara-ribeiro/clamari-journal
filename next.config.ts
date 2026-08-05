import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
