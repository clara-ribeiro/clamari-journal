export const META_DESCRIPTION_MAX = 160;

/** Strip HTML tags / entities from provider or review markup. */
export function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncateText(text: string, max = META_DESCRIPTION_MAX): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  const slice = normalized.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const clipped = lastSpace > 40 ? slice.slice(0, lastSpace) : slice;
  return `${clipped}…`;
}

/**
 * Plain text from compiled review HTML, omitting spoiler disclosures so
 * metadata and structured data never leak hidden plot points.
 */
export function reviewPlainText(html: string): string {
  const withoutSpoilers = html.replace(
    /<details\b[^>]*\breview-spoiler\b[^>]*>[\s\S]*?<\/details>/gi,
    " ",
  );
  return stripHtml(withoutSpoilers);
}

export function reviewExcerpt(
  html: string,
  max = META_DESCRIPTION_MAX,
): string | null {
  const plain = reviewPlainText(html);
  if (!plain) return null;
  return truncateText(plain, max);
}
