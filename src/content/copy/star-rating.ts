export const starRatingCopy = {
  rated: "Rated {value} out of {max}",
  noRating: "No rating",
} as const;

export type StarRatingCopy = typeof starRatingCopy;
