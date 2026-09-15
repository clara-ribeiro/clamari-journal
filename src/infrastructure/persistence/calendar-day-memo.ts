import { isoToday } from "@/domain/journal-status";

/**
 * Compute once per UTC calendar day in this process.
 * Idle status only changes at a day boundary, so page requests reuse the value.
 */
export function memoizeByCalendarDay<T>(
  compute: (today: string) => T,
  todayFn: () => string = isoToday,
): () => T {
  let cachedDate: string | undefined;
  let cached: T | undefined;
  return () => {
    const today = todayFn();
    if (cachedDate === today && cached !== undefined) return cached;
    cached = compute(today);
    cachedDate = today;
    return cached;
  };
}
