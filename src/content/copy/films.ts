export const filmsCopy = {
  list: {
    titleId: "films-heading",
    title: "Films",
    listAriaLabel: "Film entries",
    empty: "No films yet.",
    summary: "{watched} watched · {watchlist} on the list · {total} total",
    hero: {
      titleId: "films-hero-heading",
      title: "Films",
      sentinelId: "films-catalog-hero",
      image: {
        src: "/images/films/poor-things-hero.webp",
        alt: "Poor Things",
      },
    },
  },
  detail: {
    pendingEnrichment: "pending enrichment",
    note: "Dynamic template. Posters, synopsis, and cast will load from TMDB once `tmdbId` is resolved.",
    fields: {
      status: "Status",
      rating: "Rating",
      watched: "Watched",
      tmdb: "TMDB",
    },
  },
} as const;

export type FilmsCopy = typeof filmsCopy;
