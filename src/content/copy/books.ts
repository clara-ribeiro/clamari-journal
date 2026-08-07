export const booksCopy = {
  list: {
    titleId: "books-heading",
    title: "Books",
    listAriaLabel: "Book entries",
    empty: "No books yet. Add entries in src/data/books.json.",
    noResults: "No books match these filters.",
    summary: "{finished} finished · {reading} in progress · {total} total",
    hero: {
      titleId: "books-hero-heading",
      title: "Books",
      sentinelId: "books-catalog-hero",
      image: {
        src: "/images/books/clarice-hero.webp",
        alt: "",
      },
    },
  },
  detail: {
    fields: {
      status: "Status",
      rating: "Rating",
      pages: "Pages",
      format: "Format",
    },
  },
} as const;

export type BooksCopy = typeof booksCopy;
