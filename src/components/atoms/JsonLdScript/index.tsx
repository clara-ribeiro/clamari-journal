import { serializeJsonLd } from "@/lib/json-ld";

export type JsonLdScriptProps = {
  data: Record<string, unknown>;
};

/**
 * Native JSON-LD script tag (not `next/script` — this is data, not JS).
 * See `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`.
 */
export default function JsonLdScript({ data }: JsonLdScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
