import { describe, expect, it } from "vitest";
import { parseReviewSource } from "./parse-review-source";

describe("parseReviewSource", () => {
  it("returns the whole file as body when there is no front matter", () => {
    const source = "A paragraph.\n";
    expect(parseReviewSource(source)).toEqual({
      workTitle: null,
      body: source,
    });
  });

  it("reads an optional title and leaves the essay body", () => {
    expect(
      parseReviewSource(
        "---\ntitle: Gata em Telhado de Zinco Quente\n---\n\nComo um homem.\n",
      ),
    ).toEqual({
      workTitle: "Gata em Telhado de Zinco Quente",
      body: "\nComo um homem.\n",
    });
  });

  it("strips matching quotes around the title", () => {
    expect(
      parseReviewSource("---\ntitle: \"Clube da Luta\"\n---\nBody\n").workTitle,
    ).toBe("Clube da Luta");
  });
});
