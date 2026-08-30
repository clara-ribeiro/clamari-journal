import { notFound } from "next/navigation";
import { copyFor } from "@/content/copy/for-locale";
import { localePageMetadata } from "@/lib/page-metadata";

const copy = copyFor("pt-BR").states;

export const metadata = localePageMetadata({
  title: copy.notFound.title,
  description: copy.notFound.description,
  path: "/404",
  locale: "pt-BR",
  index: false,
  languages: {},
});

/** Unmatched `/pt/...` URLs render the Portuguese 404 (lang, chrome, noindex). */
export default function PortugueseUnmatchedRoute() {
  notFound();
}

