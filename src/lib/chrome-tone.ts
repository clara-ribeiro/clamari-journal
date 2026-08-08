/**
 * Site chrome (header / footer) surfaces, keyed to each page’s hero
 * and last content section so the bars never clash with adjacent fields.
 */
export type HeaderChromeTone = "navy" | "stats" | "films" | "paper";

export type FooterChromeTone =
  | "navy"
  | "stats"
  | "films"
  | "paper"
  | "white"
  | "ink";

export type PageChrome = {
  /** Matches the page hero (or body field when there is no hero). */
  header: HeaderChromeTone;
  /** Matches the last content section above the footer. */
  footer: FooterChromeTone;
};

function isPrefix(pathname: string, root: string) {
  return pathname === root || pathname.startsWith(`${root}/`);
}

/** Resolve header + footer tones from the current pathname. */
export function chromeForPath(pathname: string): PageChrome {
  if (pathname === "/") {
    return { header: "navy", footer: "ink" };
  }

  if (pathname === "/stats") {
    return { header: "stats", footer: "white" };
  }

  if (isPrefix(pathname, "/films")) {
    return { header: "films", footer: "films" };
  }

  if (isPrefix(pathname, "/series") || isPrefix(pathname, "/books")) {
    return { header: "paper", footer: "paper" };
  }

  // all-entries, reviews, favorites, and anything else on the navy body field
  return { header: "navy", footer: "navy" };
}
