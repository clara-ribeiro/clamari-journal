/** Allowed whole-star ratings from 1 to 5. */
export const RATING_STEPS = [1, 2, 3, 4, 5] as const;

export type RatingValue = (typeof RATING_STEPS)[number];

export function isValidRating(value: number): value is RatingValue {
  return (RATING_STEPS as readonly number[]).includes(value);
}

export function clampRating(value: number): RatingValue {
  const clamped = Math.min(5, Math.max(1, Math.round(value)));
  return clamped as RatingValue;
}
