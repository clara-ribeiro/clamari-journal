import type { Element, Root as HastRoot } from "hast";
import type { Root as MdastRoot, Paragraph } from "mdast";
import type { ContainerDirective } from "mdast-util-directive";
import rehypeSanitize, {
  defaultSchema,
  type Options as SanitizeSchema,
} from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { reviewContentCopy } from "@/content/copy/review-content";

const DISALLOWED_TAGS = new Set(["picture", "source", "input"]);

const reviewSanitizeSchema: SanitizeSchema = {
  ...defaultSchema,
  tagNames: Array.from(
    new Set([
      ...(defaultSchema.tagNames ?? []).filter(
        (tag) => !DISALLOWED_TAGS.has(tag),
      ),
      "figure",
      "figcaption",
    ]),
  ),
  attributes: {
    ...defaultSchema.attributes,
    details: [["className", "review-spoiler"]],
  },
};

export type CompileReviewMarkdownOptions = {
  spoilerLabel?: string;
};

/**
 * Compile local review markdown to sanitized HTML.
 * Headings are demoted by two levels so they sit under the page `h1` and
 * the Review heading (`h2`). `:::spoiler` containers become accessible
 * `<details>` disclosures.
 */
export function compileReviewMarkdown(
  source: string,
  options: CompileReviewMarkdownOptions = {},
): string {
  const spoilerLabel =
    options.spoilerLabel?.trim() || reviewContentCopy.spoilerSummary;

  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkSpoilers, spoilerLabel)
    .use(remarkRehype)
    .use(rehypeDemoteHeadings)
    .use(rehypeSanitize, reviewSanitizeSchema)
    .use(rehypeSafeReviewImages)
    .use(rehypeStringify)
    .processSync(source);

  return String(file).trim();
}

function remarkSpoilers(label: string) {
  return (tree: MdastRoot) => {
    visit(tree, (node) => {
      if (node.type !== "containerDirective") return;
      const directive = node as ContainerDirective;
      if (directive.name !== "spoiler") return;

      const data = directive.data ?? {};
      data.hName = "details";
      data.hProperties = { className: ["review-spoiler"] };
      directive.data = data;

      const first = directive.children[0];
      if (isDirectiveLabel(first)) {
        first.data = { ...first.data, hName: "summary" };
        return;
      }

      const title = directive.attributes?.title?.trim() || label;
      directive.children.unshift(summaryParagraph(title));
    });
  };
}

function isDirectiveLabel(node: ContainerDirective["children"][number] | undefined): node is Paragraph {
  return Boolean(
    node &&
      node.type === "paragraph" &&
      node.data &&
      "directiveLabel" in node.data &&
      node.data.directiveLabel,
  );
}

function summaryParagraph(text: string): Paragraph {
  return {
    type: "paragraph",
    data: { hName: "summary" },
    children: [{ type: "text", value: text }],
  };
}

function rehypeDemoteHeadings() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element) => {
      const match = /^h([1-6])$/.exec(node.tagName);
      if (!match) return;
      const nextLevel = Math.min(6, Number(match[1]) + 2);
      node.tagName = `h${nextLevel}`;
    });
  };
}

const SAFE_IMAGE_SRC = /^(https?:\/\/|\/)[^\s]*$/i;

/** Keep http(s) and site-root paths; rewrite `public/images/…` to `/images/…`. */
export function rewriteReviewImageSrc(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const src = value.trim().replace(/\\/g, "/");
  if (!src || src.startsWith("//")) return null;

  if (/^https?:\/\//i.test(src)) {
    return SAFE_IMAGE_SRC.test(src) ? src : null;
  }

  const fromPublic = /(?:^|\/)public(\/images\/[^?\s#]*)/i.exec(src);
  if (fromPublic) {
    return SAFE_IMAGE_SRC.test(fromPublic[1]) ? fromPublic[1] : null;
  }

  if (/^images\//i.test(src)) {
    const rooted = `/${src}`;
    return SAFE_IMAGE_SRC.test(rooted) ? rooted : null;
  }

  return SAFE_IMAGE_SRC.test(src) ? src : null;
}

function stringProp(node: Element, key: string): string {
  const value = node.properties?.[key];
  return typeof value === "string" ? value.trim() : "";
}

function toFigure(img: Element, captionNodes?: Element["children"]): Element {
  const alt = stringProp(img, "alt");
  const titleCaption = stringProp(img, "title");
  const properties = { ...img.properties };
  delete properties.title;
  const nextImg: Element = { ...img, properties };
  const children: Element["children"] = [nextImg];
  const fromTrailing = captionNodes ? trimCaptionChildren(captionNodes) : [];
  if (fromTrailing.length > 0) {
    children.push({
      type: "element",
      tagName: "figcaption",
      properties: {},
      children: fromTrailing,
    });
  } else {
    const caption = titleCaption || alt;
    if (caption) {
      children.push({
        type: "element",
        tagName: "figcaption",
        properties: {},
        children: [{ type: "text", value: caption }],
      });
    }
  }
  return {
    type: "element",
    tagName: "figure",
    properties: {},
    children,
  };
}

function isIgnorable(node: HastRoot["children"][number]): boolean {
  return node.type === "text" && !node.value.trim();
}

function isImageElement(
  node: HastRoot["children"][number],
): node is Element {
  return node.type === "element" && node.tagName === "img";
}

function trimCaptionChildren(nodes: Element["children"]): Element["children"] {
  const next = [...nodes];
  while (next.length > 0 && isIgnorable(next[0])) next.shift();
  const first = next[0];
  if (first?.type === "text") {
    next[0] = { ...first, value: first.value.replace(/^\s+/, "") };
  }
  while (next.length > 0 && isIgnorable(next[next.length - 1])) next.pop();
  const last = next[next.length - 1];
  if (last?.type === "text") {
    next[next.length - 1] = { ...last, value: last.value.replace(/\s+$/, "") };
  }
  return next;
}

/** Keep http(s) and site-root paths; drop javascript/data/protocol-relative src. */
function rehypeSafeReviewImages() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "img" || index == null || !parent) return;
      const src = rewriteReviewImageSrc(node.properties?.src);
      if (!src) {
        parent.children.splice(index, 1);
        return index;
      }
      node.properties = { ...node.properties, src };
    });

    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "p" || index == null || !parent) return;
      const significant = node.children.filter((child) => !isIgnorable(child));
      const img = significant[0];
      if (!img || !isImageElement(img)) return;
      if (significant.slice(1).some(isImageElement)) return;
      const imgIndex = node.children.indexOf(img);
      parent.children[index] = toFigure(img, node.children.slice(imgIndex + 1));
    });
  };
}
