export const moviesCopy = {
  list: {
    titleId: "movies-heading",
    title: "Movies",
    backLabel: "← Home",
    backHref: "/",
    listAriaLabel: "Movie entries",
    empty: "No movies yet.",
    summary: "{watched} watched · {watchlist} on the list · {total} total",
  },
  detail: {
    backLabel: "← Movies",
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

export type MoviesCopy = typeof moviesCopy;
