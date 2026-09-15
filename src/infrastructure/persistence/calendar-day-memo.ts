import { isoToday } from "@/domain/journal-status";

export type CalendarDayMemo<T> = (() => T) & { invalidate: () => void };

/**
 * Compute once per UTC calendar day in this process.
 * Idle status only changes at a day boundary, so page requests reuse the value.
 */
export function memoizeByCalendarDay<T>(
  compute: (today: string) => T,
  todayFn: () => string = isoToday,
): CalendarDayMemo<T> {
  let cachedDate: string | undefined;
  let cached: T | undefined;
  const read = () => {
    const today = todayFn();
    if (cachedDate === today && cached !== undefined) return cached;
    cached = compute(today);
    cachedDate = today;
    return cached;
  };
  read.invalidate = () => {
    cachedDate = undefined;
    cached = undefined;
  };
  return read;
}
