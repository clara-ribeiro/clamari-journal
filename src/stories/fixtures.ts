import type { CatalogCardItem } from "@/application/dto";
import type {
  BookDetail,
  GoalMetric,
  JournalEntry,
  MovieDetail,
  SeriesDetail,
  StatsMetric,
} from "@/application/dto";

export const journalHeat: JournalEntry = {
  medium: "movie",
  slug: "heat",
  title: "Heat",
  activityDate: "2024-06-01",
  rating: 5,
  href: "/films/heat",
  posterUrl: null,
};

export const journalWire: JournalEntry = {
  medium: "series",
  slug: "the-wire",
  title: "The Wire",
  activityDate: "2025-01-10",
  rating: 5,
  href: "/series/the-wire",
  posterUrl: null,
};

export const journalTitans: JournalEntry = {
  medium: "book",
  slug: "the-titans-curse",
  title: "The Titan's Curse",
  activityDate: "2020-02-01",
  rating: 4.5,
  href: "/books/the-titans-curse",
  posterUrl: null,
};

export const journalEntries: JournalEntry[] = [
  journalHeat,
  journalWire,
  journalTitans,
];

export function catalogCard(
  overrides: Partial<CatalogCardItem> &
    Pick<CatalogCardItem, "slug" | "title" | "medium" | "href">,
): CatalogCardItem {
  return {
    posterUrl: null,
    rating: 4,
    favorite: false,
    hasReview: false,
    statusLabel: "Watched",
    statusTone: "positive",
    yearLabel: "1995",
    activityLabel: "Watched on June 1, 2024",
    favoriteLabel: "Favorite",
    reviewLabel: "With review",
    metaTags: ["Crime"],
    statusKey: "watched",
    sortTitle: overrides.title.toLowerCase(),
    sortDate: "2024-06-01",
    sortRating: 4,
    sortYear: 1995,
    goalYears: [2024],
    watchedEpisodeCount: 0,
    ...overrides,
  };
}

export const catalogHeat = catalogCard({
  medium: "movie",
  slug: "heat",
  title: "Heat",
  href: "/films/heat",
  rating: 5,
  favorite: true,
  hasReview: true,
  sortRating: 5,
  metaTags: ["Crime", "Drama", "2h 50m"],
});

export const catalogAlien = catalogCard({
  medium: "movie",
  slug: "alien",
  title: "Alien",
  href: "/films/alien",
  statusLabel: "Watchlist",
  statusTone: "warning",
  statusKey: "watchlist",
  yearLabel: "1979",
  sortYear: 1979,
  activityLabel: "No date logged",
  sortDate: null,
  goalYears: [],
  rating: undefined,
  sortRating: 0,
  metaTags: ["Horror"],
});

export const catalogWire = catalogCard({
  medium: "series",
  slug: "the-wire",
  title: "The Wire",
  href: "/series/the-wire",
  statusLabel: "Completed",
  statusKey: "completed",
  yearLabel: null,
  sortYear: null,
  activityLabel: "Finished on January 10, 2025",
  sortDate: "2025-01-10",
  goalYears: [2025],
  watchedEpisodeCount: 60,
  metaTags: ["60 eps", "Completed"],
  favorite: true,
  rating: 5,
  sortRating: 5,
});

export const catalogTitans = catalogCard({
  medium: "book",
  slug: "the-titans-curse",
  title: "The Titan's Curse",
  href: "/books/the-titans-curse",
  statusLabel: "Finished",
  statusKey: "finished",
  yearLabel: null,
  sortYear: null,
  activityLabel: "Finished on February 1, 2020",
  sortDate: "2020-02-01",
  goalYears: [2020],
  metaTags: ["physical", "320 pages"],
  rating: 4.5,
  sortRating: 4.5,
  hasReview: true,
});

export const catalogItems: CatalogCardItem[] = [
  catalogHeat,
  catalogAlien,
  catalogWire,
  catalogTitans,
];

export const filmStatusOptions = [
  { value: "watched", label: "Watched" },
  { value: "rewatch", label: "Rewatch" },
  { value: "watchlist", label: "Watchlist" },
];

export const seriesStatusOptions = [
  { value: "watching", label: "Watching" },
  { value: "completed", label: "Completed" },
  { value: "watchlist", label: "Watchlist" },
  { value: "paused", label: "Paused" },
];

export const bookStatusOptions = [
  { value: "finished", label: "Finished" },
  { value: "reading", label: "Reading" },
  { value: "want-to-read", label: "Want to read" },
];

export const allStatusOptions = [
  ...filmStatusOptions,
  ...seriesStatusOptions,
  ...bookStatusOptions,
];

export const yearOptions = [2026, 2025, 2024, 2023, 2020];

export const statsMetrics: StatsMetric[] = [
  { id: "pages", value: "12,480", label: "Pages read" },
  { id: "hours", value: "312", label: "Hours watched" },
  { id: "films", value: "186", label: "Films logged" },
  { id: "series", value: "42", label: "Series caught up" },
];

export const goalMetrics: GoalMetric[] = [
  {
    key: "movies",
    value: "48/100",
    label: "Films",
    current: 48,
    target: 100,
    percent: 48,
    exceeded: false,
    year: 2026,
    href: "/films?year=2026#main-content",
  },
  {
    key: "series",
    value: "12/20",
    label: "Series",
    current: 12,
    target: 20,
    percent: 60,
    exceeded: false,
    year: 2026,
    href: "/series?year=2026#main-content",
  },
  {
    key: "books",
    value: "14/10",
    label: "Books",
    current: 14,
    target: 10,
    percent: 140,
    exceeded: true,
    year: 2026,
    href: "/books?year=2026#main-content",
  },
  {
    key: "pages",
    value: "3,200/1,000",
    label: "Pages",
    current: 3200,
    target: 1000,
    percent: 320,
    exceeded: true,
    year: 2026,
    href: "/books?year=2026#main-content",
  },
];

export const movieDetail: MovieDetail = {
  slug: "heat",
  title: "Heat",
  originalTitle: null,
  yearLabel: "1995",
  runtimeLabel: "2h 50m",
  genres: ["Crime", "Drama", "Action"],
  synopsis:
    "A group of professional bank robbers start to feel the heat from police when they unknowingly leave a clue at their latest heist.",
  posterUrl: null,
  backdropUrl: null,
  directorsLabel: "Michael Mann",
  writersLabel: "Michael Mann",
  cast: [
    { id: 1, name: "Al Pacino", role: "Vincent Hanna", profileUrl: null },
    { id: 2, name: "Robert De Niro", role: "Neil McCauley", profileUrl: null },
    { id: 3, name: "Val Kilmer", role: "Chris Shiherlis", profileUrl: null },
    { id: 4, name: "Jon Voight", role: "Nate", profileUrl: null },
    { id: 5, name: "Tom Sizemore", role: "Michael Cheritto", profileUrl: null },
    { id: 6, name: "Diane Venora", role: "Justine Hanna", profileUrl: null },
    { id: 7, name: "Amy Brenneman", role: "Eady", profileUrl: null },
    { id: 8, name: "Ashley Judd", role: "Charlene Shiherlis", profileUrl: null },
  ],
  countriesLabel: "United States of America",
  languagesLabel: "English",
  trailer: {
    name: "Official Trailer",
    url: "https://www.youtube.com/watch?v=0xbBLJ1WGwQ",
  },
  metadataNotice: null,
  statusLabel: "Watched",
  rating: 5,
  favorite: true,
  favoriteLabel: "Favorite",
  tags: ["heist"],
  watchLocation: "Home",
  streamingService: "Criterion Channel",
  viewingCount: 2,
  viewingCountLabel: "2 viewings",
  viewings: [
    { dateLabel: "January 1, 2020", kindLabel: "First watch" },
    { dateLabel: "June 1, 2024", kindLabel: "Rewatch" },
  ],
  viewingsEmptyLabel: "No viewings logged yet.",
  reviewSlug: null,
  reviewHtml: null,
  reviewEmptyLabel: "No review yet.",
  metaTitle: "Heat",
  metaDescription: "A group of professional bank robbers.",
};

export const seriesDetail: SeriesDetail = {
  slug: "the-wire",
  title: "The Wire",
  originalTitle: null,
  yearLabel: "2002",
  genres: ["Drama", "Crime"],
  synopsis: "Baltimore drug scene, seen through the eyes of drug dealers and law enforcement.",
  posterUrl: null,
  backdropUrl: null,
  creatorsLabel: "David Simon",
  writersLabel: null,
  cast: [
    { id: 1, name: "Dominic West", role: "Jimmy McNulty", profileUrl: null },
    { id: 2, name: "Lance Reddick", role: "Cedric Daniels", profileUrl: null },
  ],
  countriesLabel: "United States of America",
  languagesLabel: "English",
  productionStatusLabel: "Ended",
  trailer: null,
  metadataNotice: null,
  statusLabel: "Completed",
  rating: 5,
  favorite: true,
  favoriteLabel: "Favorite",
  startedLabel: "January 1, 2024",
  finishedLabel: "January 10, 2025",
  watchedEpisodesLabel: "60 / 60",
  watchedTimeLabel: "2d 5h",
  progressLabel: "100%",
  progressPercent: 100,
  nextEpisodeLabel: null,
  seasons: [
    {
      id: "season-1",
      seasonNumber: 1,
      title: "Season 1",
      isSpecials: false,
      progressLabel: "1 of 2 watched",
      episodeCount: 2,
      watchedCount: 1,
      episodes: [
        {
          id: "1-1",
          seasonNumber: 1,
          episodeNumber: 1,
          codeLabel: "S1 E1",
          title: "The Target",
          runtimeLabel: "1h 02m",
          airDateLabel: "June 2, 2002",
          watched: true,
          watchedDateLabel: "January 1, 2024",
          isNext: false,
        },
        {
          id: "1-2",
          seasonNumber: 1,
          episodeNumber: 2,
          codeLabel: "S1 E2",
          title: "The Detail",
          runtimeLabel: "58m",
          airDateLabel: "June 9, 2002",
          watched: false,
          watchedDateLabel: null,
          isNext: true,
        },
      ],
    },
  ],
  seasonsEmptyLabel: "No seasons available.",
  reviewSlug: null,
  reviewHtml: null,
  reviewEmptyLabel: "No review yet.",
  metaTitle: "The Wire",
  metaDescription: "Baltimore drug scene.",
};

export const bookDetail: BookDetail = {
  slug: "the-titans-curse",
  title: "The Titan's Curse",
  subtitle: "Book 3",
  authorsLabel: "Rick Riordan",
  yearLabel: "2007",
  categories: ["Juvenile Fiction", "Fantasy"],
  synopsis:
    "When the goddess Artemis goes missing, she is believed to have been kidnapped. And now it's up to Percy and his friends to find out what happened.",
  heroExcerpt:
    "When the goddess Artemis goes missing, she is believed to have been kidnapped.",
  coverUrl: null,
  publisherLabel: "Disney Hyperion",
  pageCountLabel: "320",
  languageLabel: "en",
  isbn10Label: "1423101456",
  isbn13Label: "9781423101451",
  metadataNotice: null,
  statusLabel: "Finished",
  rating: 5,
  favorite: true,
  favoriteLabel: "Favorite",
  formatLabel: "Physical",
  tags: ["percy-jackson"],
  startedLabel: "January 1, 2020",
  finishedLabel: "February 1, 2020",
  currentPageLabel: null,
  progressLabel: "100%",
  progressPercent: 100,
  quotes: [
    {
      id: "quote-0",
      text: "The sea does not like to be restrained.",
      pageLabel: "p. 42",
      note: "Classic line.",
    },
  ],
  quotesEmptyLabel: "No quotations saved yet.",
  history: [
    {
      id: "history-0",
      dateLabel: "January 1, 2020",
      pageLabel: "p. 1",
      note: null,
    },
    {
      id: "history-1",
      dateLabel: "January 15, 2020",
      pageLabel: "p. 100",
      note: "Halfway and hooked.",
    },
  ],
  historyEmptyLabel: "No reading dates recorded yet.",
  notes: [
    {
      id: "note-0",
      dateLabel: "January 15, 2020",
      text: "Halfway and hooked.",
    },
  ],
  notesEmptyLabel: "No notes yet.",
  reviewSlug: null,
  reviewHtml: null,
  reviewEmptyLabel: "No review yet.",
  metaTitle: "The Titan's Curse",
  metaDescription: "When the goddess Artemis goes missing.",
};
