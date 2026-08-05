export const homeCopy = {
  hero: {
    titleId: "hero-heading",
    title: "CLAMARI",
    script: "Journal",
    nav: {
      ariaLabel: "Browse by medium",
      items: [
        { href: "/movies", label: "Movies" },
        { href: "/series", label: "Series" },
        { href: "/books", label: "Books" },
      ],
    },
  },
  recentEntries: {
    titleId: "recent-entries-heading",
    title: "Recent Entries",
    showAllLabel: "Show All",
    showAllHref: "/all-entries",
    listAriaLabel: "Recent journal entries",
  },
  favorites: {
    titleId: "favorites-heading",
    title: "Favorites",
    showAllLabel: "Show All",
    showAllHref: "/favorites",
    listAriaLabel: "Favorite journal entries",
  },
  statsCollage: {
    titleId: "lifetime-stats-heading",
    ariaLabel: "Lifetime reading and watching totals",
    pagesLabel: "Páginas Lidas",
    hoursLabel: "Horas Assistidas",
    statsHref: "/stats",
    images: {
      portrait: {
        src: "/images/home/stats/placeholder-portrait.svg",
        alt: "",
      },
      pages: {
        src: "/images/home/stats/placeholder-pages.svg",
        alt: "",
      },
      hours: {
        src: "/images/home/stats/placeholder-hours.svg",
        alt: "",
      },
      landscape: {
        src: "/images/home/stats/placeholder-landscape.svg",
        alt: "",
      },
    },
  },
} as const;

export type HomeCopy = typeof homeCopy;
