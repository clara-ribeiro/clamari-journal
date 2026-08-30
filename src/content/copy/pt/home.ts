export const homeCopyPt = {
  hero: {
    titleId: "hero-heading",
    title: "CLAMARI",
    script: "Journal",
    lettering: {
      mobile: "/images/home/hero/lettering-background-mobile.webp",
      desktop: "/images/home/hero/lettering-background.webp",
    },
    nav: {
      ariaLabel: "Navegar por tipo",
      items: [
        { href: "/films", label: "Filmes" },
        { href: "/series", label: "Séries" },
        { href: "/books", label: "Livros" },
      ],
    },
  },
  recentEntries: {
    titleId: "recent-entries-heading",
    title: "Entradas recentes",
    showAllLabel: "Ver todas",
    showAllHref: "/all-entries",
    listAriaLabel: "Entradas recentes do diário",
  },
  reviews: {
    titleId: "reviews-heading",
    title: "Resenhas",
    showAllLabel: "Ver todas",
    showAllHref: "/reviews",
    listAriaLabel: "Entradas com resenha",
  },
  favorites: {
    titleId: "favorites-heading",
    title: "Favoritos",
    showAllLabel: "Ver todos",
    showAllHref: "/favorites",
    listAriaLabel: "Entradas favoritas do diário",
  },
  statsCollage: {
    titleId: "lifetime-stats-heading",
    ariaLabel: "Totais de leitura e de tempo assistido",
    pagesLabel: "Páginas lidas",
    hoursLabel: "Horas assistidas",
    statsHref: "/stats",
    images: {
      rows: [
        {
          left: {
            src: "/images/home/stats/clarice.webp",
            alt: "",
          },
          right: {
            src: "/images/home/stats/patti-smith-easter.webp",
            alt: "",
          },
        },
        {
          left: {
            src: "/images/home/stats/o-alto-da-compadecida.webp",
            alt: "",
          },
          right: {
            src: "/images/home/stats/lisbela-e-o-prisioneiro.webp",
            alt: "",
          },
        },
      ],
    },
  },
  journalAbout: {
    titleId: "journal-about-heading",
    title: "Meu diário",
    paragraphs: [
      "Sou engenheira de software de ofício e, de coração, uma apaixonada pelas artes. Durante muito tempo registrei essa jornada cultural em outras plataformas, mas depois da queda do TV Show decidi unir os dois mundos. Construí este espaço do zero para ser o meu arquivo pessoal — um diário definitivo para anotar, resenhar e lembrar cada filme que assisti, cada série que acompanhei e cada livro que li.",
      "Este site é um diário aberto. Convido você a ler o que penso, explorar o catálogo e entrar no meu mundo. Se quiser indicar alguma obra, conversar sobre um trabalho ou simplesmente falar comigo, é só escrever para",
    ],
    email: "claramarcelinors@gmail.com",
    epigraph: "Vissi d'arte, vissi d'amore",
    image: {
      src: "/images/home/about/hereditary-background.webp",
      alt: "",
      focalX: "50%",
      focalY: "83%",
    },
  },
} as const;
