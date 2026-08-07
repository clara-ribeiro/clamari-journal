export const seriesCopy = {
  list: {
    titleId: "series-heading",
    title: "Series",
    listAriaLabel: "Series entries",
    empty: "No series yet.",
    noResults: "No series match these filters.",
    summary:
      "{total} series · {episodes} episodes · {completed} completed · {watching} watching",
    hero: {
      titleId: "series-hero-heading",
      title: "Series",
      sentinelId: "series-catalog-hero",
      image: {
        src: "/images/series/fleabag-hero.webp",
        alt: "Fleabag",
      },
    },
  },
  detail: {
    pendingEnrichment: "pending enrichment",
    yes: "yes",
    no: "no",
    episodesHeading: "Watched episodes",
    episodesHeadingTruncated:
      "Watched episodes (showing {shown} of {total})",
    fields: {
      status: "Status",
      favorite: "Favorite",
      started: "Started",
      finished: "Finished",
      episodes: "Episodes",
      tvdb: "TVDB",
      tmdb: "TMDB",
    },
  },
} as const;

export type SeriesCopy = typeof seriesCopy;
