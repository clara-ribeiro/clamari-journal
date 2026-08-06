export const statsCopy = {
  titleId: "stats-heading",
  title: "Stats",
  backLabel: "← Home",
  backHref: "/",
  goalsHeading: "Goals",
  remainingSuffix: "remaining",
  metrics: {
    works: "Works logged",
    moviesWatched: "Movies watched",
    seriesCompleted: "Series completed",
    episodesWatched: "Episodes watched",
    booksFinished: "Books finished",
    pagesRead: "Pages read",
    movieWatchTime: "Movie watch time",
    seriesWatchTime: "Series watch time",
    totalWatchTime: "TV watch time",
  },
  goalLabels: {
    movies: "Movies",
    series: "Series",
    books: "Books",
    pages: "Pages",
  },
} as const;

export type StatsCopy = typeof statsCopy;
