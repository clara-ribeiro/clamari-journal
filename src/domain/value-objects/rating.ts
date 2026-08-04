/** Allowed half-star ratings from 0.5 to 5. */
export const RATING_STEPS = [
  0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5,
] as const;

export type RatingValue = (typeof RATING_STEPS)[number];

export function isValidRating(value: number): value is RatingValue {
  return (RATING_STEPS as readonly number[]).includes(value);
}

export function clampRating(value: number): RatingValue {
  const clamped = Math.min(5, Math.max(0.5, Math.round(value * 2) / 2));
  return clamped as RatingValue;
}
