import { describe, expect, it } from "vitest";
import { foldSearchText } from "./search-text";

describe("foldSearchText", () => {
  it("folds accents and case", () => {
    expect(foldSearchText("São Paulo")).toBe("sao paulo");
    expect(foldSearchText("AÇÃO")).toBe("acao");
  });

  it("matches folded queries against folded titles", () => {
    const title = foldSearchText("La Vie d'Adèle");
    expect(title.includes(foldSearchText("adele"))).toBe(true);
  });
});
