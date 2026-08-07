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
        { href: "/films", label: "Films" },
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
  journalAbout: {
    titleId: "journal-about-heading",
    title: "My Journal",
    paragraphs: [
      "I am a software engineer by trade, but a profound lover of the arts at heart. For a long time, I documented my cultural journey on other platforms, but after the fall of TV Show, I decided it was time to merge my two worlds. I built this space from scratch to be my personal archive—a definitive log to record, review, and remember every film I’ve watched, every series I’ve followed, and every book I’ve read.",
      "This site is an open diary. I invite you to read my thoughts, explore my catalog, and step into my world. If you would like to share a recommendation, discuss a piece of work, or simply get in touch, feel free to reach out to me at",
    ],
    email: "claramarcelinors@gmail.com",
    epigraph: "Vissi d'arte, vissi d'amore",
    image: {
      src: "/images/home/about/hereditary-background.webp",
      alt: "",
      /** Mouth focal point in the photo — keep Epigraph on the same % so cover crops stay aligned. */
      focalX: "50%",
      focalY: "83%",
    },
  },
} as const;

export type HomeCopy = typeof homeCopy;
