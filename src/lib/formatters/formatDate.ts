import {
  DEFAULT_REVIEW_LOCALE,
  type ReviewLocale,
} from "@/lib/review-locale";

const dateOptions: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

const dateFormatters: Record<ReviewLocale, Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat("en-US", dateOptions),
  "pt-BR": new Intl.DateTimeFormat("pt-BR", dateOptions),
};

export function formatDate(
  value?: string | null,
  locale: ReviewLocale = DEFAULT_REVIEW_LOCALE,
): string {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return dateFormatters[locale].format(date);
}
