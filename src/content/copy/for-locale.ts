import { allEntriesCopy } from "./all-entries";
import { booksCopy } from "./books";
import { catalogCopy } from "./catalog";
import { favoritesCopy } from "./favorites";
import { filmsCopy } from "./films";
import { homeCopy } from "./home";
import { reviewsCopy } from "./reviews";
import { seriesCopy } from "./series";
import { siteCopy } from "./site";
import { starRatingCopy } from "./star-rating";
import { statesCopy, stateScenes } from "./states";
import { statsCopy } from "./stats";
import { allEntriesCopyPt } from "./pt/all-entries";
import { booksCopyPt } from "./pt/books";
import { catalogCopyPt } from "./pt/catalog";
import { favoritesCopyPt } from "./pt/favorites";
import { filmsCopyPt } from "./pt/films";
import { homeCopyPt } from "./pt/home";
import { reviewsCopyPt } from "./pt/reviews";
import { seriesCopyPt } from "./pt/series";
import { siteCopyPt } from "./pt/site";
import { starRatingCopyPt } from "./pt/star-rating";
import { statesCopyPt } from "./pt/states";
import { statsCopyPt } from "./pt/stats";
import {
  DEFAULT_REVIEW_LOCALE,
  type ReviewLocale,
} from "@/lib/review-locale";

export const englishCopy = {
  site: siteCopy,
  home: homeCopy,
  films: filmsCopy,
  series: seriesCopy,
  books: booksCopy,
  catalog: catalogCopy,
  stats: statsCopy,
  states: statesCopy,
  allEntries: allEntriesCopy,
  favorites: favoritesCopy,
  reviews: reviewsCopy,
  starRating: starRatingCopy,
} as const;

export const portugueseCopy = {
  site: siteCopyPt,
  home: homeCopyPt,
  films: filmsCopyPt,
  series: seriesCopyPt,
  books: booksCopyPt,
  catalog: catalogCopyPt,
  stats: statsCopyPt,
  states: statesCopyPt,
  allEntries: allEntriesCopyPt,
  favorites: favoritesCopyPt,
  reviews: reviewsCopyPt,
  starRating: starRatingCopyPt,
} as const;

export type AppCopy = typeof englishCopy | typeof portugueseCopy;

export function copyFor(
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): AppCopy {
  return locale === "pt-BR" ? portugueseCopy : englishCopy;
}

export { stateScenes };
