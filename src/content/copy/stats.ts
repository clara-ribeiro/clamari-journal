export const statsCopy = {
  titleId: "stats-heading",
  title: "Stats",
  hero: {
    titleId: "stats-heading",
    title: "STATS",
    sentinelId: "stats-hero",
    image: {
      /** Default / fallback; hero also serves a responsive srcSet. */
      src: "/images/stats/ballerina-720.webp",
    },
  },
  goalsAriaLabel: "Goals",
  remainingSuffix: "remaining",
  goals: {
    fullCircleSrc: "/images/stats/full-circle.webp",
    people: {
      movies: "/images/stats/person-1.webp",
      series: "/images/stats/person-2.webp",
      books: "/images/stats/person-3.webp",
      pages: "/images/stats/person-4.webp",
    },
  },
  collage: {
    titleId: "stats-collage-heading",
    ariaLabel: "Lifetime reading and watching totals",
    /**
     * One left/right pair per metric row (order matches getStatsPageData
     * metrics). Swap each `src` for the real photo — nothing is cycled.
     *
     * Row layout: odd rows = media | stat, even rows = stat | media.
     */
    images: {
      rows: [
        {
          left: { src: "/images/stats/collage/01-left.png", alt: "" },
          right: { src: "/images/stats/collage/01-right.png", alt: "" },
        },
        {
          left: { src: "/images/stats/collage/02-left.png", alt: "" },
          right: { src: "/images/stats/collage/02-right.png", alt: "" },
        },
        {
          left: { src: "/images/stats/collage/03-left.png", alt: "" },
          right: { src: "/images/stats/collage/03-right.png", alt: "" },
        },
        {
          left: { src: "/images/stats/collage/04-left.png", alt: "" },
          right: { src: "/images/stats/collage/04-right.png", alt: "" },
        },
        {
          left: { src: "/images/stats/collage/05-left.png", alt: "" },
          right: { src: "/images/stats/collage/05-right.png", alt: "" },
        },
        {
          left: { src: "/images/stats/collage/06-left.png", alt: "" },
          right: { src: "/images/stats/collage/06-right.png", alt: "" },
        },
        {
          left: { src: "/images/stats/collage/07-left.png", alt: "" },
          right: { src: "/images/stats/collage/07-right.png", alt: "" },
        },
        {
          left: { src: "/images/stats/collage/08-left.png", alt: "" },
          right: { src: "/images/stats/collage/08-right.png", alt: "" },
        },
      ],
    },
  },
  metrics: {
    works: "Works logged",
    filmsWatched: "Films watched",
    seriesCompleted: "Series completed",
    episodesWatched: "Episodes watched",
    booksFinished: "Books finished",
    pagesRead: "Pages read",
    filmWatchTime: "Film watch time",
    seriesWatchTime: "Series watch time",
  },
  goalLabels: {
    /** Domain key stays `movies` (goals.json); label is user-facing. */
    movies: "Films",
    series: "Series",
    books: "Books",
    pages: "Pages",
  },
  goalLinkAriaLabel: "Open {label} finished in {year}",
} as const;

export type StatsCopy = typeof statsCopy;
