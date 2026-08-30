"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocaleCopy } from "@/content/copy/use-copy";
import type { HeaderChromeTone } from "@/lib/chrome-tone";
import { pathForLocaleWithSearch } from "@/lib/review-locale";
import { Choice, Current, Divider, Root } from "./styles";

export type LocaleSwitchTone = HeaderChromeTone | "clear";

export type LocaleSwitchProps = {
  tone?: LocaleSwitchTone;
  className?: string;
};

function LocaleSwitchLinks({
  tone = "navy",
  className,
  search,
}: LocaleSwitchProps & { search: string }) {
  const pathname = usePathname() ?? "/";
  const { locale, copy } = useLocaleCopy();
  const labels = copy.site.header.locale;

  return (
    <Root className={className} aria-label={labels.ariaLabel}>
      {locale === "en" ? (
        <Current
          tone={tone}
          current
          aria-current="true"
          aria-label={labels.enName}
          lang="en"
        >
          {labels.en}
        </Current>
      ) : (
        <Choice
          href={pathForLocaleWithSearch(pathname, "en", search)}
          hrefLang="en"
          lang="en"
          aria-label={labels.enName}
          tone={tone}
        >
          {labels.en}
        </Choice>
      )}
      <Divider aria-hidden="true">|</Divider>
      {locale === "pt-BR" ? (
        <Current
          tone={tone}
          current
          aria-current="true"
          aria-label={labels.ptName}
          lang="pt-BR"
        >
          {labels.pt}
        </Current>
      ) : (
        <Choice
          href={pathForLocaleWithSearch(pathname, "pt-BR", search)}
          hrefLang="pt-BR"
          lang="pt-BR"
          aria-label={labels.ptName}
          tone={tone}
        >
          {labels.pt}
        </Choice>
      )}
    </Root>
  );
}

function LocaleSwitchWithSearch(props: LocaleSwitchProps) {
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? "";
  return <LocaleSwitchLinks {...props} search={search} />;
}

export default function LocaleSwitch(props: LocaleSwitchProps) {
  return (
    <Suspense fallback={<LocaleSwitchLinks {...props} search="" />}>
      <LocaleSwitchWithSearch {...props} />
    </Suspense>
  );
}
