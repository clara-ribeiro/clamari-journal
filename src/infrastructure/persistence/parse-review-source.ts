/**
 * Optional YAML-ish front matter on review markdown. Only `title` is read;
 * it is the localized work name for H1 / `<title>` when TMDB is unavailable.
 */
export type ParsedReviewSource = {
  workTitle: string | null;
  body: string;
};

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

export function parseReviewSource(source: string): ParsedReviewSource {
  const match = FRONT_MATTER.exec(source);
  if (!match) {
    return { workTitle: null, body: source };
  }

  const titleLine = /^title:\s*(.+)$/m.exec(match[1]);
  const raw = titleLine?.[1]?.trim() ?? "";
  const workTitle = unquote(raw) || null;
  return { workTitle, body: match[2] };
}

function unquote(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1).trim();
  }
  return value;
}
