export type ReviewImage = {
  src: string;
  alt: string;
  caption: string;
};

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function attr(tag: string, name: string): string {
  const match = new RegExp(
    `\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`,
    "i",
  ).exec(tag);
  if (!match) return "";
  return decodeEntities(match[2] ?? match[3] ?? "").trim();
}

function captionText(markup: string): string {
  return decodeEntities(
    markup.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
  );
}

/** Site-root image paths Google can crawl on this origin (not TMDB/remote). */
export function isLocalSiteImage(src: string): boolean {
  return src.startsWith("/") && !src.startsWith("//");
}

/**
 * Pull `src` / `alt` / figcaption from compiled review HTML so sitemaps,
 * Open Graph, and JSON-LD can advertise the stills on the page.
 */
export function extractReviewImages(
  html: string | null | undefined,
): ReviewImage[] {
  if (!html?.trim()) return [];

  const images: ReviewImage[] = [];
  const seen = new Set<string>();

  const figureRe = /<figure\b[^>]*>([\s\S]*?)<\/figure>/gi;
  for (const figureMatch of html.matchAll(figureRe)) {
    const body = figureMatch[1] ?? "";
    const imgMatch = /<img\b[^>]*>/i.exec(body);
    if (!imgMatch) continue;
    const src = attr(imgMatch[0], "src");
    if (!src || seen.has(src)) continue;
    const captionMatch = /<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i.exec(
      body,
    );
    seen.add(src);
    images.push({
      src,
      alt: attr(imgMatch[0], "alt"),
      caption: captionMatch ? captionText(captionMatch[1] ?? "") : "",
    });
  }

  for (const imgMatch of html.matchAll(/<img\b[^>]*>/gi)) {
    const src = attr(imgMatch[0], "src");
    if (!src || seen.has(src)) continue;
    seen.add(src);
    images.push({ src, alt: attr(imgMatch[0], "alt"), caption: "" });
  }

  return images;
}

/** Local stills for Open Graph / Twitter (poster stays a separate fallback). */
export function reviewStillMetadata(
  html: string | null | undefined,
): { url: string; alt: string }[] {
  return extractReviewImages(html)
    .filter((image) => isLocalSiteImage(image.src))
    .map((image) => ({
      url: image.src,
      alt: image.alt || image.caption,
    }));
}
