import { afterEach, describe, expect, it, vi } from "vitest";
import {
  absoluteUrl,
  allowSearchIndexing,
  getSiteUrl,
} from "./site-url";

describe("getSiteUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("prefers SITE_URL over Vercel hosts", () => {
    vi.stubEnv("SITE_URL", "https://clamari.com.br");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "preview.example.vercel.app");
    vi.stubEnv("VERCEL_URL", "feat-42.vercel.app");

    expect(getSiteUrl().origin).toBe("https://clamari.com.br");
    expect(absoluteUrl("/films")).toBe("https://clamari.com.br/films");
  });

  it("uses the Vercel production host when SITE_URL is unset", () => {
    vi.stubEnv("SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "clamari.com.br");
    vi.stubEnv("VERCEL_URL", "feat-42.vercel.app");

    expect(getSiteUrl().origin).toBe("https://clamari.com.br");
  });

  it("falls back to localhost and never uses VERCEL_URL", () => {
    vi.stubEnv("SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    vi.stubEnv("VERCEL_URL", "feat-42.vercel.app");

    expect(getSiteUrl().origin).toBe("http://localhost:3000");
  });
});

describe("allowSearchIndexing", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("indexes production and local builds, not Preview", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(allowSearchIndexing()).toBe(true);

    vi.stubEnv("VERCEL_ENV", "preview");
    expect(allowSearchIndexing()).toBe(false);

    vi.stubEnv("VERCEL_ENV", "");
    expect(allowSearchIndexing()).toBe(true);
  });
});
