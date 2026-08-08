export const statsCopy = {
  titleId: "stats-heading",
  title: "Stats",
  hero: {
    titleId: "stats-heading",
    title: "STATS",
    sentinelId: "stats-hero",
    image: {
      src: "/images/stats/ballerina.webp",
    },
  },
  goalsHeading: "Goals",
  remainingSuffix: "remaining",
  metrics: {
    works: "Works logged",
    filmsWatched: "Films watched",
    seriesCompleted: "Series completed",
    episodesWatched: "Episodes watched",
    booksFinished: "Books finished",
    pagesRead: "Pages read",
    filmWatchTime: "Film watch time",
    seriesWatchTime: "Series watch time",
    totalWatchTime: "TV watch time",
  },
  goalLabels: {
    /** Domain key stays `movies` (goals.json); label is user-facing. */
    movies: "Films",
    series: "Series",
    books: "Books",
    pages: "Pages",
  },
} as const;

export type StatsCopy = typeof statsCopy;
