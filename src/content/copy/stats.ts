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
  goalsHeading: "Goals",
  goalsHeadingId: "goals-heading",
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
    images: {
      portrait: {
        src: "/images/stats/collage/placeholder-portrait.svg",
        alt: "",
      },
      landscape: {
        src: "/images/stats/collage/placeholder-landscape.svg",
        alt: "",
      },
      stats: [
        {
          src: "/images/stats/collage/placeholder-landscape.svg",
          alt: "",
        },
        {
          src: "/images/stats/collage/placeholder-faces.svg",
          alt: "",
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
