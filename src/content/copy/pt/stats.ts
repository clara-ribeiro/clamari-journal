export const statsCopyPt = {
  titleId: "stats-heading",
  title: "Estatísticas",
  description:
    "Totais de filmes, séries, livros e páginas registrados no clamari journal.",
  hero: {
    titleId: "stats-heading",
    title: "STATS",
    sentinelId: "stats-hero",
    image: {
      src: "/images/stats/ballerina-720.webp",
    },
  },
  goalsHeadingId: "goals-heading",
  goalsAriaLabel: "Metas",
  remainingSuffix: "restantes",
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
    ariaLabel: "Totais de leitura e de tempo assistido",
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
    works: "Obras registradas",
    filmsWatched: "Filmes assistidos",
    seriesCompleted: "Séries completas",
    episodesWatched: "Episódios assistidos",
    booksFinished: "Livros lidos",
    pagesRead: "Páginas lidas",
    filmWatchTime: "Tempo de filmes",
    seriesWatchTime: "Tempo de séries",
  },
  goalLabels: {
    movies: "Filmes",
    series: "Séries",
    books: "Livros",
    pages: "Páginas",
  },
  goalLinkAriaLabel: "Abrir {label} concluídos em {year}",
} as const;
