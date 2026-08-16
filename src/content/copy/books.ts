export const booksCopy = {
  list: {
    titleId: "books-heading",
    title: "Books",
    description:
      "Books logged in the clamari journal — reading, finished, paused, and still on the shelf.",
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
    titleId: "book-detail-heading",
    heroSentinelId: "book-detail-hero",
    backLabel: "All books",
    backHref: "/books",
    metadata: {
      heading: "About the book",
      headingId: "book-metadata-heading",
      unresolved:
        "This entry could not be matched in Google Books. Cover and credits will appear after enrichment.",
      unavailable:
        "Google Books metadata could not be loaded. Personal journal details below are still available.",
      authors: "Authors",
      publisher: "Publisher",
      year: "Published",
      pages: "Pages",
      language: "Language",
      categories: "Categories",
      isbn10: "ISBN-10",
      isbn13: "ISBN-13",
      synopsis: "Synopsis",
      noSynopsis: "No synopsis available.",
    },
    journal: {
      heading: "In your journal",
      headingId: "book-journal-heading",
      status: "Status",
      rating: "Your rating",
      favorite: "Favorite",
      format: "Format",
      tags: "Tags",
      started: "Started",
      finished: "Finished",
      currentPage: "Current page",
      progress: "Progress",
      noRating: "Not rated",
      noTags: "No tags",
    },
    format: {
      physical: "Physical",
      ebook: "Ebook",
      audiobook: "Audiobook",
    },
    quotes: {
      heading: "Quotations",
      headingId: "book-quotes-heading",
      empty: "No quotations saved yet.",
      page: "p. {page}",
    },
    history: {
      heading: "Reading history",
      headingId: "book-history-heading",
      empty: "No reading dates recorded yet.",
      page: "p. {page}",
    },
    notes: {
      heading: "Notes",
      headingId: "book-notes-heading",
      empty: "No notes yet.",
    },
    review: {
      heading: "Review",
      headingId: "book-review-heading",
      empty: "No review yet.",
      pending: "Review on the way.",
    },
    meta: {
      descriptionFallback: "Personal journal entry for {title}.",
      descriptionFromSynopsis: "{synopsis}",
    },
  },
} as const;

export type BooksCopy = typeof booksCopy;
