import {
  DEFAULT_REVIEW_LOCALE,
  type ReviewLocale,
} from "@/lib/review-locale";

const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;
const MINUTES_PER_MONTH = 30 * MINUTES_PER_DAY;
const MINUTES_PER_YEAR = 365 * MINUTES_PER_DAY;

const units = {
  en: { year: "y", month: "mo", day: "d", hour: "h", minute: "m" },
  "pt-BR": { year: "a", month: "mês", day: "d", hour: "h", minute: "min" },
} as const;

/**
 * Formats a duration in minutes using years, months, days, and hours
 * when needed (approximate calendar units: 365d / 30d).
 */
export function formatDuration(
  totalMinutes: number,
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): string {
  const labels = units[locale];
  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) {
    return `0${labels.minute}`;
  }

  let remaining = Math.round(totalMinutes);

  const years = Math.floor(remaining / MINUTES_PER_YEAR);
  remaining %= MINUTES_PER_YEAR;

  const months = Math.floor(remaining / MINUTES_PER_MONTH);
  remaining %= MINUTES_PER_MONTH;

  const days = Math.floor(remaining / MINUTES_PER_DAY);
  remaining %= MINUTES_PER_DAY;

  const hours = Math.floor(remaining / MINUTES_PER_HOUR);
  remaining %= MINUTES_PER_HOUR;

  const minutes = remaining;
  const parts: string[] = [];

  if (years > 0) parts.push(`${years}${labels.year}`);
  if (months > 0) parts.push(`${months}${labels.month}`);
  if (days > 0) parts.push(`${days}${labels.day}`);
  if (hours > 0) parts.push(`${hours}${labels.hour}`);

  // Keep minutes only when the duration is under a day (cleaner for long spans)
  const hasLargerThanHours = years > 0 || months > 0 || days > 0;
  if (minutes > 0 && !hasLargerThanHours) {
    parts.push(`${minutes}${labels.minute}`);
  }

  return parts.length > 0 ? parts.join(" ") : `0${labels.minute}`;
}

/** Short runtime for catalog cards, e.g. `2h 04m`. */
export function formatShortRuntime(
  totalMinutes: number,
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): string {
  const labels = units[locale];
  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) {
    return `0${labels.minute}`;
  }

  const minutes = Math.round(totalMinutes);
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const mins = minutes % MINUTES_PER_HOUR;

  if (hours <= 0) return `${mins}${labels.minute}`;
  if (mins <= 0) return `${hours}${labels.hour}`;
  return `${hours}${labels.hour} ${String(mins).padStart(2, "0")}${labels.minute}`;
}
