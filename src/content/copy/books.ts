export const booksCopy = {
  list: {
    titleId: "books-heading",
    title: "Books",
    backLabel: "← Home",
    backHref: "/",
    listAriaLabel: "Book entries",
    empty: "No books yet. Add entries in src/data/books.json.",
    summary: "{finished} finished · {reading} in progress · {total} total",
  },
  detail: {
    backLabel: "← Books",
    fields: {
      status: "Status",
      rating: "Rating",
      pages: "Pages",
      format: "Format",
    },
  },
} as const;

export type BooksCopy = typeof booksCopy;
