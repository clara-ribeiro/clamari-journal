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
    items: [
      { href: "/stats", label: "Stats" },
      { href: "/movies", label: "Movies" },
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
