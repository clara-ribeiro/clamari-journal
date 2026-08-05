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
} as const;

export type HomeCopy = typeof homeCopy;
