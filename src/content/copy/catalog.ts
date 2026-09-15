export const catalogCopy = {
  toolbar: {
    searchAriaLabel: "Search catalog",
    searchPlaceholder: {
      films: "Search films",
      series: "Search series",
      books: "Search books",
      all: "Search entries",
    },
    filtersLabel: "Status",
    filtersAriaLabel: "Filter by status",
    filtersAll: "All",
    yearLabel: "Year",
    yearAriaLabel: "Filter by finished year",
    yearAll: "All years",
    reviewLabel: "Review",
    reviewAriaLabel: "Show only entries with a review",
    favoriteLabel: "Favorites",
    favoriteAriaLabel: "Show only favorites",
    sortLabel: "Sort",
    sortAriaLabel: "Sort catalog",
    sortOptions: {
      default: "Recently added",
      titleAsc: "Title A–Z",
      titleDesc: "Title Z–A",
      dateNewest: "Newest activity",
      dateOldest: "Oldest activity",
      yearNewest: "Newest release",
      yearOldest: "Oldest release",
      ratingHigh: "Highest rating",
      ratingLow: "Lowest rating",
    },
    viewCardsLabel: "Card view",
    viewListLabel: "List view",
    viewCardsAriaLabel: "Switch to card view",
    viewListAriaLabel: "Switch to list view",
    clearAllLabel: "Clear",
    clearAllAriaLabel: "Clear search, filters, and sorting",
    seeAll: "See all",
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
    episodeCount: "{count} eps",
    pageCount: "{count} pages",
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
  statusHint: {
    films: {
      watched: "Logged with one watch date.",
      rewatch: "Logged with two or more watch dates.",
      watchlist: "On the list. No watch date logged yet.",
    },
    series: {
      watchlist: "On the list. No episode has been logged yet.",
      watching:
        "An episode was logged in the last 60 days. Still unfinished.",
      paused:
        "No episode in 60 days, but not yet two years. Still unfinished.",
      completed:
        "Every released episode has been watched. Each episode counts once.",
      abandoned: "No episode in two years. Treated as dropped.",
    },
    books: {
      "want-to-read": "On the list. No pages have been logged yet.",
      reading: "A page was logged in the last 60 days. Still unfinished.",
      paused:
        "No page in 60 days, but not yet two years. Still unfinished.",
      finished: "The last page has been reached.",
      abandoned: "No page in two years. Treated as dropped.",
    },
  },
} as const;

export type CatalogUiCopy = typeof catalogCopy;
