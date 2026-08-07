export const catalogCopy = {
  toolbar: {
    searchAriaLabel: "Search catalog",
    searchPlaceholder: {
      films: "Search films",
      series: "Search series",
      books: "Search books",
    },
    filtersLabel: "Filters",
    filtersAriaLabel: "Filter by status",
    filtersAll: "All statuses",
    sortLabel: "Sort",
    sortAriaLabel: "Sort catalog",
    sortOptions: {
      titleAsc: "Title A–Z",
      titleDesc: "Title Z–A",
      dateNewest: "Newest activity",
      dateOldest: "Oldest activity",
      ratingHigh: "Highest rating",
      ratingLow: "Lowest rating",
    },
    viewCardsLabel: "Card view",
    viewListLabel: "List view",
    viewCardsAriaLabel: "Switch to card view",
    viewListAriaLabel: "Switch to list view",
  },
  card: {
    favorite: "Favorite",
    notFavorite: "Not favorite",
    withReview: "With review",
    noReview: "No review",
    watchedOn: "Watched on {date}",
    addedOn: "Added on {date}",
    startedOn: "Started on {date}",
    finishedOn: "Finished on {date}",
    noActivityDate: "No date logged",
  },
  status: {
    films: {
      watched: "Watched",
      rewatch: "Rewatch",
      watchlist: "Watchlist",
    },
    series: {
      watchlist: "Watchlist",
      watching: "Watching",
      "up-to-date": "Up to date",
      paused: "Paused",
      completed: "Completed",
      abandoned: "Abandoned",
    },
    books: {
      "want-to-read": "Want to read",
      reading: "Reading",
      paused: "Paused",
      finished: "Finished",
      abandoned: "Abandoned",
    },
  },
} as const;

export type CatalogUiCopy = typeof catalogCopy;
