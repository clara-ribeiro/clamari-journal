export const seriesCopy = {
  list: {
    titleId: "series-heading",
    title: "Series",
    backLabel: "← Home",
    backHref: "/",
    listAriaLabel: "Series entries",
    empty: "No series yet.",
    summary:
      "{total} series · {episodes} episodes · {completed} completed · {watching} watching",
  },
  detail: {
    backLabel: "← Series",
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
