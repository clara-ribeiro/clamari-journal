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
          left: { src: "/images/stats/collage/01-left.webp", alt: "" },
          right: { src: "/images/stats/collage/01-right.webp", alt: "" },
        },
        {
          left: { src: "/images/stats/collage/02-left.webp", alt: "" },
          right: { src: "/images/stats/collage/02-right.webp", alt: "" },
        },
        {
          left: { src: "/images/stats/collage/03-left.webp", alt: "" },
          right: { src: "/images/stats/collage/03-right.webp", alt: "" },
        },
        {
          left: { src: "/images/stats/collage/04-left.webp", alt: "" },
          right: { src: "/images/stats/collage/04-right.webp", alt: "" },
        },
        {
          left: { src: "/images/stats/collage/05-left.webp", alt: "" },
          right: { src: "/images/stats/collage/05-right.webp", alt: "" },
        },
        {
          left: { src: "/images/stats/collage/06-left.webp", alt: "" },
          right: { src: "/images/stats/collage/06-right.webp", alt: "" },
        },
        {
          left: { src: "/images/stats/collage/07-left.webp", alt: "" },
          right: { src: "/images/stats/collage/07-right.webp", alt: "" },
        },
        {
          left: { src: "/images/stats/collage/08-left.webp", alt: "" },
          right: { src: "/images/stats/collage/08-right.webp", alt: "" },
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
