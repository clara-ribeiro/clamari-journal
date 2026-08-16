export const siteCopy = {
  brand: {
    name: "CLAMARI",
    product: "Journal",
    fullName: "CLAMARI Journal",
  },
  metadata: {
    titleDefault: "clamari journal",
    titleTemplate: "%s · clamari journal",
    description:
      "A personal diary to track stories I've watched, followed, and read over time.",
    author: "Clara",
    ogImage: "/images/home/hero/lettering-background.webp",
    ogImageAlt: "CLAMARI Journal lettering",
  },
  a11y: {
    skipToContent: "Skip to content",
    mainContentId: "main-content",
  },
  themeColor: "#021570",
  header: {
    navAriaLabel: "Primary",
    brand: "CLAMARI",
    homeHref: "/",
    brandSentinelId: "hero-brand",
    /** List pages where the header stays hidden until the hero scrolls out of view. */
    revealOnScrollHrefs: ["/", "/films", "/series", "/books", "/stats"],
    /** Detail route prefixes that also reveal the header after the first scroll. */
    revealOnScrollPrefixes: ["/films/", "/series/", "/books/"],
    catalogHeroSentinelIds: {
      "/films": "films-catalog-hero",
      "/series": "series-catalog-hero",
      "/books": "books-catalog-hero",
      "/stats": "stats-hero",
    },
    filmDetailHeroSentinelId: "film-detail-hero",
    seriesDetailHeroSentinelId: "series-detail-hero",
    bookDetailHeroSentinelId: "book-detail-hero",
    items: [
      { href: "/stats", label: "Stats" },
      { href: "/films", label: "Films" },
      { href: "/series", label: "Series" },
      { href: "/books", label: "Books" },
    ],
  },
  footer: {
    brand: "CLAMARI",
    creditPrimary: "Developed by Clara Marcelino Ribeiro,",
    creditSecondary: "Software Engineer",
    tagline: "A personal archive of culture",
    copyright: "© 2026 CLAMARI",
    socialNavLabel: "Social links",
    homeHref: "/",
    social: [
      {
        network: "linkedin",
        href: "https://www.linkedin.com/in/clara-marcelino/",
        label: "LinkedIn",
      },
      {
        network: "github",
        href: "https://github.com/clara-ribeiro/",
        label: "GitHub",
      },
      {
        network: "instagram",
        href: "https://www.instagram.com/clarariibeiros/",
        label: "Instagram",
      },
    ],
  },
} as const;

export type SiteCopy = typeof siteCopy;
