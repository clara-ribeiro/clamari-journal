"use client";

import { usePathname } from "next/navigation";
import { copyFor } from "./for-locale";
import {
  DEFAULT_REVIEW_LOCALE,
  localeFromPathname,
  pathForLocale,
  type ReviewLocale,
} from "@/lib/review-locale";

export function useLocaleCopy() {
  const pathname = usePathname() ?? "/";
  const locale: ReviewLocale = localeFromPathname(pathname);
  const copy = copyFor(locale);

  return {
    locale,
    copy,
    href: (path: string) => pathForLocale(path, locale),
  };
}

export { DEFAULT_REVIEW_LOCALE };
