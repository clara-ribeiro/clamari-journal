import { describe, expect, it } from "vitest";
import { compileReviewMarkdown } from "./compile-review-markdown";

describe("compileReviewMarkdown", () => {
  it("renders headings, paragraphs, emphasis, quotes, lists, links, and rules", () => {
    const html = compileReviewMarkdown(`
# Title

A paragraph with *emphasis* and **strong**.

> Quoted line.

- Alpha
- Beta

1. One
2. Two

[Example](https://example.com)

---
`);

    expect(html).toContain("<h3>Title</h3>");
    expect(html).toContain("<em>emphasis</em>");
    expect(html).toContain("<strong>strong</strong>");
    expect(html).toContain("<blockquote>");
    expect(html).toContain("<ul>");
    expect(html).toContain("<ol>");
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain("<hr>");
  });

  it("turns spoiler directives into collapsed details", () => {
    const html = compileReviewMarkdown(`
:::spoiler[The ending]
They were dead the whole time.
:::
`);

    expect(html).toContain('<details class="review-spoiler">');
    expect(html).toContain("<summary>The ending</summary>");
    expect(html).toContain("<p>They were dead the whole time.</p>");
    expect(html).not.toContain(" open");
  });

  it("uses the default spoiler label when none is given", () => {
    const html = compileReviewMarkdown(`
:::spoiler
Hidden plot.
:::
`);

    expect(html).toContain("<summary>Spoilers</summary>");
    expect(html).toContain("Hidden plot.");
  });

  it("renders markdown images from https and site-root paths", () => {
    const html = compileReviewMarkdown(`
![Poster](https://image.tmdb.org/t/p/w500/poster.jpg)

![Local still](/images/reviews/hereditary.webp)
`);

    expect(html).toContain("<img");
    expect(html).toContain('src="https://image.tmdb.org/t/p/w500/poster.jpg"');
    expect(html).toContain('alt="Poster"');
    expect(html).toContain('src="/images/reviews/hereditary.webp"');
  });

  it("strips scripts, javascript URLs, and unsafe image sources", () => {
    const html = compileReviewMarkdown(`
<script>alert(1)</script>

![xss](javascript:alert(1))

[click](javascript:alert(1))

<iframe src="https://evil.example"></iframe>
`);

    expect(html).not.toContain("<script");
    expect(html).not.toContain("alert(1)");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("javascript:");
    expect(html).toContain("<a>click</a>");
  });
});
