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
  tagNames: (defaultSchema.tagNames ?? []).filter(
    (tag) => !DISALLOWED_TAGS.has(tag),
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

function isSafeImageSrc(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const src = value.trim();
  if (!src || src.startsWith("//")) return false;
  return SAFE_IMAGE_SRC.test(src);
}

/** Keep http(s) and site-root paths; drop javascript/data/protocol-relative src. */
function rehypeSafeReviewImages() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "img" || index == null || !parent) return;
      if (isSafeImageSrc(node.properties?.src)) return;
      parent.children.splice(index, 1);
    });
  };
}
