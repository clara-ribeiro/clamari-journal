import { describe, expect, it } from "vitest";
import { chromeForPath } from "./chrome-tone";

describe("chromeForPath", () => {
  it("uses navy chrome on home and navy body pages", () => {
    expect(chromeForPath("/")).toEqual({ header: "navy", footer: "ink" });
    expect(chromeForPath("/pt")).toEqual({ header: "navy", footer: "ink" });
    expect(chromeForPath("/all-entries")).toEqual({
      header: "navy",
      footer: "navy",
    });
    expect(chromeForPath("/favorites")).toEqual({
      header: "navy",
      footer: "navy",
    });
    expect(chromeForPath("/reviews")).toEqual({
      header: "navy",
      footer: "navy",
    });
  });

  it("uses stats chrome on the stats page", () => {
    expect(chromeForPath("/stats")).toEqual({
      header: "stats",
      footer: "white",
    });
    expect(chromeForPath("/pt/stats")).toEqual({
      header: "stats",
      footer: "white",
    });
  });

  it("uses films chrome for film routes including detail", () => {
    expect(chromeForPath("/films")).toEqual({
      header: "films",
      footer: "films",
    });
    expect(chromeForPath("/films/heat")).toEqual({
      header: "films",
      footer: "films",
    });
    expect(chromeForPath("/pt/films/heat")).toEqual({
      header: "films",
      footer: "films",
    });
  });

  it("uses paper chrome for series and books", () => {
    expect(chromeForPath("/series")).toEqual({
      header: "paper",
      footer: "paper",
    });
    expect(chromeForPath("/series/the-wire")).toEqual({
      header: "paper",
      footer: "paper",
    });
    expect(chromeForPath("/books/the-lightning-thief")).toEqual({
      header: "paper",
      footer: "paper",
    });
    expect(chromeForPath("/pt/series/the-wire")).toEqual({
      header: "paper",
      footer: "paper",
    });
    expect(chromeForPath("/pt/books/the-lightning-thief")).toEqual({
      header: "paper",
      footer: "paper",
    });
  });
});
