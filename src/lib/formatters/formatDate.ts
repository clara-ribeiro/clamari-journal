const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return dateFormatter.format(date);
}

const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;
const MINUTES_PER_MONTH = 30 * MINUTES_PER_DAY;
const MINUTES_PER_YEAR = 365 * MINUTES_PER_DAY;

/**
 * Formats a duration in minutes using years, months, days, and hours
 * when needed (approximate calendar units: 365d / 30d).
 */
export function formatDuration(totalMinutes: number): string {
  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) return "0m";

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

  if (years > 0) parts.push(`${years}y`);
  if (months > 0) parts.push(`${months}mo`);
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);

  // Keep minutes only when the duration is under a day (cleaner for long spans)
  const hasLargerThanHours = years > 0 || months > 0 || days > 0;
  if (minutes > 0 && !hasLargerThanHours) {
    parts.push(`${minutes}m`);
  }

  return parts.length > 0 ? parts.join(" ") : "0m";
}

/** @deprecated Prefer formatDuration */
export function formatHours(minutes: number): string {
  return formatDuration(minutes);
}
