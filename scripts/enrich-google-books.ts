/**
 * Resolve cover URLs (and missing titles) for journal books via Google Books.
 *
 * Usage:
 *   npx tsx scripts/enrich-google-books.ts
 *   npm run enrich:google-books
 *
 * Requires network. Optional GOOGLE_BOOKS_API_KEY (low-volume public access works without it).
 * Safe to re-run — refreshes `coverUrl` / `title` from Google Books; never overwrites `customPageCount`.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  coverUrlFromVolumeId,
  normalizeVolume,
} from "../src/infrastructure/google-books/normalize";
import type { GoogleBooksRawVolume } from "../src/infrastructure/google-books/raw";

const ROOT = resolve(import.meta.dirname, "..");
const BOOKS_PATH = resolve(ROOT, "src/data/books.json");
const GOOGLE_BOOKS_BASE = "https://www.googleapis.com/books/v1";

type BookEntry = {
  googleBooksId: string;
  slug: string;
  title?: string;
  coverUrl?: string;
  customPageCount?: number;
  [key: string]: unknown;
};

function loadEnvLocal() {
  const envPath = resolve(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (!match) continue;
    const key = match[1].trim();
    const value = match[2].trim();
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

async function fetchVolume(id: string): Promise<GoogleBooksRawVolume> {
  const url = new URL(`${GOOGLE_BOOKS_BASE}/volumes/${encodeURIComponent(id)}`);
  const key = process.env.GOOGLE_BOOKS_API_KEY?.trim();
  if (key) url.searchParams.set("key", key);

  // Without a key, Google often 429s from shared IPs — fail fast to the cover fallback.
  const maxAttempts = key ? 4 : 1;

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    if (attempt > 0) {
      const waitMs = 2000 * 2 ** (attempt - 1);
      console.log(`retry ${id} in ${waitMs}ms…`);
      await sleep(waitMs);
    }

    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      return response.json() as Promise<GoogleBooksRawVolume>;
    }

    lastError = new Error(`Google Books ${response.status} for ${id}`);
    if (response.status !== 429 && response.status < 500) {
      throw lastError;
    }
  }

  throw lastError ?? new Error(`Google Books failed for ${id}`);
}

function sleep(ms: number) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

async function main() {
  loadEnvLocal();

  const books = JSON.parse(readFileSync(BOOKS_PATH, "utf-8")) as BookEntry[];
  let updated = 0;

  for (const entry of books) {
    try {
      const raw = await fetchVolume(entry.googleBooksId);
      const meta = normalizeVolume(raw);
      let changed = false;

      // Prefer the stable volume-id cover URL. API imageLinks often include
      // short-lived `imgtk` tokens that break offline journal data over time.
      const stableCover =
        coverUrlFromVolumeId(entry.googleBooksId) || meta.coverUrl;
      if (stableCover && entry.coverUrl !== stableCover) {
        entry.coverUrl = stableCover;
        changed = true;
      }
      if (meta.title && entry.title !== meta.title) {
        entry.title = meta.title;
        changed = true;
      }

      if (changed) {
        updated += 1;
        console.log(
          `book ${entry.slug} → "${entry.title}" cover=api (provider pages=${meta.providerPageCount ?? "—"}; personal pages=${entry.customPageCount ?? "—"})`,
        );
      } else {
        console.log(`skip ${entry.slug} (already up to date)`);
      }
    } catch (error) {
      // Without an API key, Google often 429s. Still store the canonical cover URL
      // derived from googleBooksId so listings match the TMDB posterPath pattern.
      const fallbackCover = coverUrlFromVolumeId(entry.googleBooksId);
      if (entry.coverUrl !== fallbackCover) {
        entry.coverUrl = fallbackCover;
        updated += 1;
        console.warn(
          `book ${entry.slug}: API unavailable (${error instanceof Error ? error.message : "error"}); wrote canonical cover URL`,
        );
      } else {
        console.warn(`book fail: ${entry.slug}`, error);
      }
    }

    await sleep(process.env.GOOGLE_BOOKS_API_KEY?.trim() ? 1500 : 200);
  }

  writeFileSync(BOOKS_PATH, `${JSON.stringify(books, null, 2)}\n`);
  console.log(`Books enriched: ${updated}/${books.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
