export const siteCopyPt = {
  brand: {
    name: "CLAMARI",
    product: "Journal",
    fullName: "CLAMARI Journal",
  },
  metadata: {
    titleDefault: "clamari journal · diário de filmes, séries e livros",
    titleTemplate: "%s · clamari journal",
    description:
      "Diário pessoal de filmes, séries e livros: catálogo, estatísticas e resenhas da Clara.",
    author: "Clara",
    ogImage: "/images/home/hero/lettering-background.webp",
    ogImageAlt: "Lettering do CLAMARI Journal",
  },
  a11y: {
    skipToContent: "Ir para o conteúdo",
    mainContentId: "main-content",
  },
  themeColor: "#021570",
  header: {
    navAriaLabel: "Principal",
    brand: "CLAMARI",
    homeHref: "/",
    brandSentinelId: "hero-brand",
    revealOnScrollHrefs: ["/", "/films", "/series", "/books", "/stats"],
    revealOnScrollPrefixes: [
      "/films/",
      "/series/",
      "/books/",
      "/pt/films/",
      "/pt/series/",
      "/pt/books/",
    ],
    catalogHeroSentinelIds: {
      "/films": "films-catalog-hero",
      "/series": "series-catalog-hero",
      "/books": "books-catalog-hero",
      "/stats": "stats-hero",
    },
    filmDetailHeroSentinelId: "film-detail-hero",
    seriesDetailHeroSentinelId: "series-detail-hero",
    bookDetailHeroSentinelId: "book-detail-hero",
    items: [
      { href: "/stats", label: "Estatísticas" },
      { href: "/films", label: "Filmes" },
      { href: "/series", label: "Séries" },
      { href: "/books", label: "Livros" },
    ],
    locale: {
      ariaLabel: "Idioma",
      en: "EN",
      enName: "English",
      pt: "PT",
      ptName: "Português",
    },
  },
  footer: {
    brand: "CLAMARI",
    creditPrimary: "Desenvolvido por Clara Marcelino Ribeiro,",
    creditSecondary: "Engenheira de Software",
    tagline: "Um arquivo pessoal de cultura",
    copyright: "© 2026 CLAMARI",
    socialNavLabel: "Redes sociais",
    homeHref: "/",
    social: [
      {
        network: "linkedin",
        href: "https://www.linkedin.com/in/clara-marcelino/",
        label: "LinkedIn",
      },
      {
        network: "github",
        href: "https://github.com/clara-ribeiro/",
        label: "GitHub",
      },
      {
        network: "instagram",
        href: "https://www.instagram.com/clarariibeiros/",
        label: "Instagram",
      },
    ],
  },
} as const;
