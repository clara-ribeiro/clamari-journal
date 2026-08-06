export const homeCopy = {
  hero: {
    titleId: "hero-heading",
    title: "CLAMARI",
    script: "Journal",
    lettering: {
      mobile: "/images/home/hero/lettering-background-mobile.webp",
      desktop: "/images/home/hero/lettering-background.webp",
    },
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
    pagesLabel: "Pages Read",
    hoursLabel: "Hours Watched",
    statsHref: "/stats",
    images: {
      portrait: {
        src: "/images/home/stats/clarice.webp",
        alt: "",
      },
      pages: {
        src: "/images/home/stats/patti-smith-easter.webp",
        alt: "",
      },
      hours: {
        src: "/images/home/stats/o-alto-da-compadecida.webp",
        alt: "",
      },
      landscape: {
        src: "/images/home/stats/lisbela-e-o-prisioneiro.webp",
        alt: "",
      },
    },
  },
} as const;

export type HomeCopy = typeof homeCopy;
