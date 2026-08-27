"use client";

import { usePathname } from "next/navigation";
import { siteCopy } from "@/content/copy";
import type { HeaderChromeTone } from "@/lib/chrome-tone";
import { localeFromPathname, pathForLocale } from "@/lib/review-locale";
import { Choice, Current, Divider, Root } from "./styles";

export type LocaleSwitchTone = HeaderChromeTone | "clear";

export type LocaleSwitchProps = {
  tone?: LocaleSwitchTone;
  className?: string;
};

const copy = siteCopy.header.locale;

export default function LocaleSwitch({
  tone = "navy",
  className,
}: LocaleSwitchProps) {
  const pathname = usePathname() ?? "/";
  const locale = localeFromPathname(pathname);

  return (
    <Root className={className} aria-label={copy.ariaLabel}>
      {locale === "en" ? (
        <Current
          tone={tone}
          current
          aria-current="true"
          aria-label={copy.enName}
          lang="en"
        >
          {copy.en}
        </Current>
      ) : (
        <Choice
          href={pathForLocale(pathname, "en")}
          hrefLang="en"
          lang="en"
          aria-label={copy.enName}
          tone={tone}
        >
          {copy.en}
        </Choice>
      )}
      <Divider aria-hidden="true">|</Divider>
      {locale === "pt-BR" ? (
        <Current
          tone={tone}
          current
          aria-current="true"
          aria-label={copy.ptName}
          lang="pt-BR"
        >
          {copy.pt}
        </Current>
      ) : (
        <Choice
          href={pathForLocale(pathname, "pt-BR")}
          hrefLang="pt-BR"
          lang="pt-BR"
          aria-label={copy.ptName}
          tone={tone}
        >
          {copy.pt}
        </Choice>
      )}
    </Root>
  );
}
