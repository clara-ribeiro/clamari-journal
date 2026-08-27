import { describe, expect, it } from "vitest";
import {
  htmlLang,
  isReviewLocale,
  localeFromPathname,
  ogLocale,
  otherReviewLocale,
  pathForLocale,
  reviewFileName,
  reviewLanguageAlternates,
  reviewPagePath,
  stripLocalePrefix,
  tmdbLanguageForLocale,
} from "./review-locale";

describe("review locale helpers", () => {
  it("accepts only the published review locales", () => {
    expect(isReviewLocale("en")).toBe(true);
    expect(isReviewLocale("pt-BR")).toBe(true);
    expect(isReviewLocale("pt")).toBe(false);
  });

  it("maps locale to html lang, OG locale, and TMDB language", () => {
    expect(htmlLang("en")).toBe("en");
    expect(htmlLang("pt-BR")).toBe("pt-BR");
    expect(ogLocale("en")).toBe("en_US");
    expect(ogLocale("pt-BR")).toBe("pt_BR");
    expect(tmdbLanguageForLocale("pt-BR")).toBe("pt-BR");
    expect(tmdbLanguageForLocale("en")).toBe("en-US");
  });

  it("builds sibling paths and filenames", () => {
    expect(reviewPagePath("films", "heat")).toBe("/films/heat");
    expect(reviewPagePath("films", "heat", "pt-BR")).toBe("/pt/films/heat");
    expect(reviewFileName("heat", "en")).toBe("heat.md");
    expect(reviewFileName("heat", "pt-BR")).toBe("heat.pt.md");
    expect(otherReviewLocale("en")).toBe("pt-BR");
  });

  it("lists reciprocal hreflang paths with English as x-default", () => {
    expect(reviewLanguageAlternates("films", "heat")).toEqual({
      en: "/films/heat",
      "pt-BR": "/pt/films/heat",
      "x-default": "/films/heat",
    });
  });

  it("reads locale from the pathname prefix without treating /portugal as Portuguese", () => {
    expect(localeFromPathname("/")).toBe("en");
    expect(localeFromPathname("/films/heat")).toBe("en");
    expect(localeFromPathname("/portugal")).toBe("en");
    expect(localeFromPathname("/pt")).toBe("pt-BR");
    expect(localeFromPathname("/pt/")).toBe("pt-BR");
    expect(localeFromPathname("/pt/films/heat")).toBe("pt-BR");
  });

  it("strips and reapplies the Portuguese prefix", () => {
    expect(stripLocalePrefix("/pt")).toBe("/");
    expect(stripLocalePrefix("/pt/films/heat")).toBe("/films/heat");
    expect(pathForLocale("/", "pt-BR")).toBe("/pt");
    expect(pathForLocale("/films/heat", "pt-BR")).toBe("/pt/films/heat");
    expect(pathForLocale("/pt/films/heat", "en")).toBe("/films/heat");
    expect(pathForLocale("/pt", "en")).toBe("/");
    expect(pathForLocale("/pt/films/heat", "pt-BR")).toBe("/pt/films/heat");
    expect(pathForLocale("/films/heat", "en")).toBe("/films/heat");
  });
});
