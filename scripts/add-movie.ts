/**
 * Search TMDB and add a film row to src/data/movies.json (API metadata only).
 *
 *   npm run add:movie
 *   npm run add:movie -- "Poor Things"
 *   npm run add:movie -- "Heat (1995)" --yes
 */

import { readFileSync, writeFileSync } from "node:fs";
import { createInterface, type Interface as ReadlineInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { resolve } from "node:path";
import type { MovieEntry, MovieStatus } from "@/domain/entities";
import {
  buildMovieEntry,
  CatalogMovieError,
  findMovieByTmdbId,
  findSlugInsertIndex,
  movieEntryToJson,
  parseMovieQuery,
  resolveMovieSearch,
  type MovieCatalogDetails,
  type MovieSearchHit,
} from "@/infrastructure/persistence/catalog-movie-entry";
import { parseMovieEntries } from "@/infrastructure/persistence/parse-json";

const ROOT = resolve(import.meta.dirname, "..");
const MOVIES_PATH = resolve(ROOT, "src/data/movies.json");
const TMDB_BASE = "https://api.themoviedb.org/3";
const AMBIGUOUS_EXIT = 2;
const REL_MOVIES = "src/data/movies.json";
const REL_REVIEWS = "src/content/reviews/films";

const USAGE = `Add a film to src/data/movies.json from TMDB (title, poster, runtime, ids).
Personal fields (rating, watch dates, favorite) and the review markdown are edited by hand afterwards — the script prints how.

  npm run add:movie
  npm run add:movie -- "Poor Things"
  npm run add:movie -- "Heat (1995)" --yes
  npm run add:movie -- search "Heat"

Options:
  --tmdb-id <id>   Use this TMDB movie id (skips disambiguation)
  --year <YYYY>    Prefer a release year (also parsed from "Title (1995)")
  --status watched|watchlist|rewatch   Default: watched
  --update         Refresh TMDB fields on an existing row with the same tmdbId
  --yes            Do not prompt; fail if the title is ambiguous
  --json           Print machine-readable JSON (implied when not a TTY)
`;

type CliCommand = "search" | "add";

type CliFlags = {
  help?: boolean;
  update?: boolean;
  yes?: boolean;
  json?: boolean;
  tmdbId?: number;
  year?: number;
  status?: MovieStatus;
};

type TmdbSearchRaw = {
  results?: Array<{
    id: number;
    title?: string;
    original_title?: string;
    release_date?: string;
  }>;
};

type TmdbMovieRaw = {
  id: number;
  title?: string;
  original_title?: string;
  release_date?: string | null;
  runtime?: number | null;
  poster_path?: string | null;
};

class CliError extends Error {
  constructor(
    message: string,
    readonly exitCode: number,
    readonly payload: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = "CliError";
  }
}

function loadEnvLocal() {
  const envPath = resolve(ROOT, ".env.local");
  try {
    const text = readFileSync(envPath, "utf-8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // optional
  }
}

function tmdbLanguage() {
  const configured = process.env.TMDB_LANGUAGE?.trim();
  return configured && configured.length > 0 ? configured : "en-US";
}

function wantsJson(flags: CliFlags): boolean {
  return Boolean(flags.json) || !stdout.isTTY;
}

function canPrompt(flags: CliFlags): boolean {
  return Boolean(stdin.isTTY && stdout.isTTY) && !flags.json && !flags.yes;
}

async function tmdb<T>(path: string): Promise<T> {
  const token = process.env.TMDB_ACCESS_TOKEN?.trim();
  if (!token) {
    throw new CliError(
      "TMDB_ACCESS_TOKEN is required (set it in .env.local)",
      1,
    );
  }

  const response = await fetch(`${TMDB_BASE}${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new CliError(`TMDB ${response.status} for ${path}`, 1);
  }
  return (await response.json()) as T;
}

function parseArgs(argv: string[]): {
  command: CliCommand;
  query: string;
  flags: CliFlags;
} {
  const rest = argv.slice(2);
  let command: CliCommand = "add";
  if (rest[0] === "search" || rest[0] === "add") {
    command = rest.shift() as CliCommand;
  }

  const positionals: string[] = [];
  const flags: CliFlags = {};

  const takeValue = (token: string, index: number): [string, number] => {
    const eq = token.indexOf("=");
    if (eq !== -1) return [token.slice(eq + 1), index];
    const next = rest[index + 1];
    if (!next || next.startsWith("--")) {
      throw new CliError(`Missing value for ${token.replace(/=.*/, "")}`, 1);
    }
    return [next, index + 1];
  };

  for (let i = 0; i < rest.length; i += 1) {
    const token = rest[i];
    if (token === "--help" || token === "-h") {
      flags.help = true;
      continue;
    }
    if (!token.startsWith("--")) {
      positionals.push(token);
      continue;
    }

    const name = (
      token.includes("=") ? token.slice(2, token.indexOf("=")) : token.slice(2)
    ).toLowerCase();

    if (name === "update") {
      flags.update = true;
      continue;
    }
    if (name === "yes" || name === "y") {
      flags.yes = true;
      continue;
    }
    if (name === "json") {
      flags.json = true;
      continue;
    }

    const [value, nextIndex] = takeValue(token, i);
    i = nextIndex;

    if (name === "tmdb-id") {
      const tmdbId = Number(value);
      if (!Number.isInteger(tmdbId) || tmdbId <= 0) {
        throw new CliError(`Invalid --tmdb-id "${value}"`, 1);
      }
      flags.tmdbId = tmdbId;
    } else if (name === "year") {
      const year = Number(value);
      if (!Number.isInteger(year) || year < 1900 || year > 2100) {
        throw new CliError(`Invalid --year "${value}"`, 1);
      }
      flags.year = year;
    } else if (name === "status") {
      if (
        value !== "watched" &&
        value !== "watchlist" &&
        value !== "rewatch"
      ) {
        throw new CliError(`Invalid --status "${value}"`, 1);
      }
      flags.status = value;
    } else {
      throw new CliError(`Unknown option --${name}`, 1);
    }
  }

  return { command, query: positionals.join(" ").trim(), flags };
}

function yearFromDate(value: string | null | undefined): number | null {
  if (!value || value.length < 4) return null;
  const year = Number(value.slice(0, 4));
  return Number.isInteger(year) ? year : null;
}

function toSearchHit(raw: {
  id: number;
  title?: string;
  original_title?: string;
  release_date?: string;
}): MovieSearchHit | null {
  const title = raw.title?.trim();
  if (!Number.isInteger(raw.id) || raw.id <= 0 || !title) return null;
  const releaseDate = raw.release_date?.trim() || null;
  return {
    id: raw.id,
    title,
    originalTitle: raw.original_title?.trim() || null,
    releaseDate,
    year: yearFromDate(releaseDate),
  };
}

function candidatePayload(hit: MovieSearchHit) {
  return {
    tmdbId: hit.id,
    title: hit.title,
    originalTitle: hit.originalTitle ?? null,
    year: hit.year ?? null,
    releaseDate: hit.releaseDate ?? null,
  };
}

function formatHit(hit: MovieSearchHit): string {
  const year = hit.year != null ? String(hit.year) : "ano ?";
  const original =
    hit.originalTitle &&
    hit.originalTitle.localeCompare(hit.title, undefined, {
      sensitivity: "accent",
    }) !== 0
      ? ` — ${hit.originalTitle}`
      : "";
  return `${hit.title} (${year})${original}`;
}

async function searchTmdb(
  query: string,
  year?: number,
): Promise<MovieSearchHit[]> {
  const params = new URLSearchParams({
    query,
    language: tmdbLanguage(),
  });
  if (year != null) params.set("primary_release_year", String(year));
  const data = await tmdb<TmdbSearchRaw>(`/search/movie?${params}`);
  return (data.results ?? [])
    .map(toSearchHit)
    .filter((hit): hit is MovieSearchHit => hit !== null);
}

async function loadMovieDetails(tmdbId: number): Promise<MovieCatalogDetails> {
  const params = new URLSearchParams({ language: tmdbLanguage() });
  const raw = await tmdb<TmdbMovieRaw>(`/movie/${tmdbId}?${params}`);
  const title = raw.title?.trim();
  if (!title) {
    throw new CliError(`TMDB movie ${tmdbId} has no title`, 1);
  }
  const posterPath = raw.poster_path?.trim();
  const runtime =
    typeof raw.runtime === "number" && raw.runtime > 0
      ? raw.runtime
      : undefined;
  const releaseDate = raw.release_date?.trim() || undefined;
  return {
    tmdbId: raw.id,
    title,
    releaseDate,
    runtimeMinutes: runtime,
    posterPath: posterPath || undefined,
  };
}

function loadRawMovies(): Record<string, unknown>[] {
  const raw = JSON.parse(readFileSync(MOVIES_PATH, "utf-8")) as unknown;
  parseMovieEntries(raw);
  if (!Array.isArray(raw)) {
    throw new CliError("movies.json must be an array", 1);
  }
  return raw as Record<string, unknown>[];
}

function writeMovies(raw: Record<string, unknown>[]) {
  parseMovieEntries(raw);
  writeFileSync(MOVIES_PATH, `${JSON.stringify(raw, null, 2)}\n`);
}

function syncRawMovie(record: Record<string, unknown>, entry: MovieEntry) {
  const json = movieEntryToJson(entry);
  for (const [key, value] of Object.entries(json)) {
    if (key === "tvtimeUuid") continue;
    record[key] = value;
  }
}

function printJson(payload: Record<string, unknown>) {
  stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

function withReviewSlug(entry: MovieEntry): MovieEntry {
  return { ...entry, reviewSlug: entry.reviewSlug ?? entry.slug };
}

function persistMovie(input: {
  details: MovieCatalogDetails;
  status: MovieStatus;
  update: boolean;
}): { entry: MovieEntry; created: boolean } {
  const raw = loadRawMovies();
  const movies = parseMovieEntries(raw);
  const existingIndex = findMovieByTmdbId(movies, input.details.tmdbId);

  if (existingIndex >= 0 && !input.update) {
    const existing = movies[existingIndex];
    throw new CliError(
      `"${existing.title}" já está no catálogo (${existing.slug}).`,
      1,
      {
        existingSlug: existing.slug,
        href: `/films/${existing.slug}`,
        tmdbId: existing.tmdbId ?? input.details.tmdbId,
        alreadyExists: true,
      },
    );
  }

  let entry: MovieEntry;
  const created = existingIndex < 0;

  if (created) {
    entry = withReviewSlug(
      buildMovieEntry(
        input.details,
        { status: input.status },
        movies.map((movie) => movie.slug),
      ),
    );
    raw.splice(
      findSlugInsertIndex(
        raw.map((row) => String(row.slug)),
        entry.slug,
      ),
      0,
      movieEntryToJson(entry),
    );
  } else {
    const current = movies[existingIndex];
    entry = withReviewSlug({
      ...current,
      title: input.details.title,
      releaseDate: input.details.releaseDate ?? current.releaseDate,
      runtimeMinutes: input.details.runtimeMinutes ?? current.runtimeMinutes,
      posterPath: input.details.posterPath ?? current.posterPath,
      tmdbId: input.details.tmdbId,
      status: input.status ?? current.status,
    });
    syncRawMovie(raw[existingIndex], entry);
  }

  writeMovies(raw);
  return { entry, created };
}

function reviewMarkdownPath(slug: string) {
  return `${REL_REVIEWS}/${slug}.md`;
}

function nextStepsText(entry: MovieEntry): string {
  const slug = entry.slug;
  const reviewSlug = entry.reviewSlug ?? slug;
  return [
    `Os dados da API (título, pôster, duração, estreia) já estão em ${REL_MOVIES}.`,
    `Procure o objeto com "slug": "${slug}" e complete o que for pessoal:`,
    ``,
    `  "rating": 4,`,
    `  "watchedDates": ["2026-08-25"],`,
    `  "favorite": true,`,
    ``,
    `rating usa números inteiros de 1 a 5. Cada data em watchedDates é uma sessão`,
    `(uma data = assistiu uma vez; duas datas = rewatch, e assim por diante).`,
    `status pode ser watched, watchlist ou rewatch. Campos opcionais: tags,`,
    `watchLocation, streamingService.`,
    ``,
    `Resenha: crie o Markdown`,
    `  ${reviewMarkdownPath(reviewSlug)}`,
    `O campo reviewSlug já aponta para esse arquivo. A página /films/${slug}`,
    `mostra “Review on the way.” até o .md existir. Spoilers:`,
    ``,
    `  :::spoiler[O final]`,
    `  Texto escondido.`,
    `  :::`,
  ].join("\n");
}

function printHumanResult(
  entry: MovieEntry,
  created: boolean,
  alreadyExisted = false,
) {
  if (alreadyExisted) {
    stdout.write(`Já no catálogo: ${entry.title} → /films/${entry.slug}\n\n`);
  } else {
    const verb = created ? "Adicionado" : "Atualizado";
    const year = entry.releaseDate?.slice(0, 4);
    const runtime =
      entry.runtimeMinutes != null ? ` · ${entry.runtimeMinutes} min` : "";
    stdout.write(
      `${verb}: ${entry.title}${year ? ` (${year})` : ""}${runtime}\n`,
    );
    stdout.write(`  página   /films/${entry.slug}\n`);
    stdout.write(`  arquivo  ${REL_MOVIES}\n\n`);
  }
  stdout.write(`${nextStepsText(entry)}\n`);
}

async function runSearch(queryInput: string, flags: CliFlags) {
  const parsed = parseMovieQuery(queryInput);
  const query = parsed.query;
  const year = flags.year ?? parsed.year;
  if (!query) {
    throw new CliError("Provide a movie title to search", 1);
  }

  const hits = await searchTmdb(query, year);
  const resolved = resolveMovieSearch(hits, {
    tmdbId: flags.tmdbId,
    year,
    query,
  });

  if (resolved.status === "none") {
    throw new CliError(`No TMDB movies found for "${query}"`, 1, {
      query,
      year: year ?? null,
      candidates: [],
    });
  }

  if (resolved.status === "ambiguous") {
    throw new CliError(
      `Several TMDB movies match "${query}". Pass --tmdb-id or a year.`,
      AMBIGUOUS_EXIT,
      {
        query,
        year: year ?? null,
        candidates: resolved.hits.map(candidatePayload),
      },
    );
  }

  printJson({
    ok: true,
    action: "search",
    query,
    year: year ?? null,
    match: candidatePayload(resolved.hit),
    candidates: hits.slice(0, 10).map(candidatePayload),
    message: `${resolved.hit.title} (${resolved.hit.year ?? "year unknown"}) — tmdb ${resolved.hit.id}`,
  });
}

function lookupExisting(tmdbId: number): MovieEntry | undefined {
  const movies = parseMovieEntries(loadRawMovies());
  const index = findMovieByTmdbId(movies, tmdbId);
  return index >= 0 ? movies[index] : undefined;
}

async function resolveTmdbIdFromQuery(
  queryInput: string,
  flags: CliFlags,
): Promise<number> {
  if (flags.tmdbId) return flags.tmdbId;

  const parsed = parseMovieQuery(queryInput);
  const query = parsed.query;
  const year = flags.year ?? parsed.year;
  if (!query) {
    throw new CliError("Provide a movie title or --tmdb-id", 1);
  }

  const hits = await searchTmdb(query, year);
  const resolved = resolveMovieSearch(hits, { year, query });
  if (resolved.status === "none") {
    throw new CliError(`No TMDB movies found for "${query}"`, 1, {
      query,
      year: year ?? null,
      candidates: [],
    });
  }
  if (resolved.status === "ambiguous") {
    throw new CliError(
      `Several TMDB movies match "${query}". Re-run with --tmdb-id, or run without --yes to pick interactively.`,
      AMBIGUOUS_EXIT,
      {
        query,
        year: year ?? null,
        candidates: resolved.hits.map(candidatePayload),
      },
    );
  }
  return resolved.hit.id;
}

async function runAdd(queryInput: string, flags: CliFlags) {
  const tmdbId = await resolveTmdbIdFromQuery(queryInput, flags);
  const details = await loadMovieDetails(tmdbId);
  const existing = lookupExisting(details.tmdbId);

  if (existing && !flags.update) {
    if (wantsJson(flags)) {
      printJson({
        ok: true,
        action: "exists",
        entry: {
          slug: existing.slug,
          title: existing.title,
          tmdbId: existing.tmdbId,
          href: `/films/${existing.slug}`,
          reviewSlug: existing.reviewSlug ?? existing.slug,
          reviewPath: reviewMarkdownPath(existing.reviewSlug ?? existing.slug),
        },
        nextSteps: nextStepsText(existing),
        message: `"${existing.title}" already in the catalog as ${existing.slug}`,
      });
      return;
    }
    printHumanResult(existing, false, true);
    return;
  }

  const result = persistMovie({
    details,
    status: flags.status ?? existing?.status ?? "watched",
    update: Boolean(flags.update),
  });

  if (wantsJson(flags)) {
    printJson({
      ok: true,
      action: result.created ? "created" : "updated",
      entry: {
        slug: result.entry.slug,
        title: result.entry.title,
        tmdbId: result.entry.tmdbId,
        status: result.entry.status,
        href: `/films/${result.entry.slug}`,
        reviewSlug: result.entry.reviewSlug ?? result.entry.slug,
        reviewPath: reviewMarkdownPath(
          result.entry.reviewSlug ?? result.entry.slug,
        ),
      },
      nextSteps: nextStepsText(result.entry),
      message: result.created
        ? `Added ${result.entry.title} → /films/${result.entry.slug}`
        : `Updated ${result.entry.title} → /films/${result.entry.slug}`,
    });
    return;
  }

  printHumanResult(result.entry, result.created);
}

async function askYesNo(
  rl: ReadlineInterface,
  prompt: string,
  defaultYes: boolean,
): Promise<boolean> {
  const hint = defaultYes ? "S/n" : "s/N";
  const raw = (await rl.question(`${prompt} [${hint}]: `)).trim().toLowerCase();
  if (!raw) return defaultYes;
  return raw === "s" || raw === "y" || raw === "sim" || raw === "yes";
}

async function pickHit(
  rl: ReadlineInterface,
  hits: MovieSearchHit[],
): Promise<MovieSearchHit> {
  const list = hits.slice(0, 10);
  for (const [index, hit] of list.entries()) {
    stdout.write(`  ${index + 1}. ${formatHit(hit)}\n`);
  }
  while (true) {
    const raw = (await rl.question(`Número [1]: `)).trim();
    const n = raw === "" ? 1 : Number(raw);
    if (Number.isInteger(n) && n >= 1 && n <= list.length) {
      return list[n - 1];
    }
    stdout.write(`Escolha um número de 1 a ${list.length}.\n`);
  }
}

async function resolveTmdbIdInteractively(
  rl: ReadlineInterface,
  flags: CliFlags,
  initialQuery: string,
): Promise<number> {
  if (flags.tmdbId) return flags.tmdbId;

  let queryInput = initialQuery;
  while (true) {
    if (!queryInput) {
      queryInput = (await rl.question("Título do filme: ")).trim();
      continue;
    }

    const parsed = parseMovieQuery(queryInput);
    const query = parsed.query;
    const year = flags.year ?? parsed.year;
    stdout.write("Buscando na TMDB…\n");
    const hits = await searchTmdb(query, year);
    const resolved = resolveMovieSearch(hits, { year, query });

    if (resolved.status === "none" || hits.length === 0) {
      stdout.write(`Nenhum filme encontrado para "${query}".\n`);
      queryInput = (await rl.question("Outro título: ")).trim();
      continue;
    }

    if (resolved.status === "match") {
      stdout.write(`Encontrado: ${formatHit(resolved.hit)}\n`);
      if (await askYesNo(rl, "É este filme?", true)) {
        return resolved.hit.id;
      }
      stdout.write("Outros resultados:\n");
      const picked = await pickHit(rl, hits);
      return picked.id;
    }

    stdout.write(`Vários filmes chamados "${query}":\n`);
    const picked = await pickHit(rl, resolved.hits);
    return picked.id;
  }
}

async function runInteractiveAdd(queryInput: string, flags: CliFlags) {
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    const tmdbId = await resolveTmdbIdInteractively(rl, flags, queryInput);
    const details = await loadMovieDetails(tmdbId);
    const runtime =
      details.runtimeMinutes != null ? ` · ${details.runtimeMinutes} min` : "";
    stdout.write(
      `${details.title}${details.releaseDate ? ` (${details.releaseDate.slice(0, 4)})` : ""}${runtime}\n`,
    );

    const existing = lookupExisting(details.tmdbId);
    if (existing && !flags.update) {
      printHumanResult(existing, false, true);
      return;
    }

    const result = persistMovie({
      details,
      status: flags.status ?? existing?.status ?? "watched",
      update: Boolean(flags.update) || Boolean(existing),
    });
    printHumanResult(result.entry, result.created);
  } finally {
    rl.close();
  }
}

async function main() {
  loadEnvLocal();
  const { command, query, flags } = parseArgs(process.argv);
  if (flags.help) {
    stdout.write(USAGE);
    return;
  }

  if (command === "search") {
    await runSearch(query, flags);
    return;
  }

  if (canPrompt(flags)) {
    await runInteractiveAdd(query, flags);
    return;
  }

  await runAdd(query, flags);
}

main().catch((error) => {
  if (error instanceof CliError) {
    if (error.payload.alreadyExists && stdout.isTTY && !process.argv.includes("--json")) {
      const slug = String(error.payload.existingSlug ?? "");
      const existing = slug
        ? parseMovieEntries(loadRawMovies()).find((movie) => movie.slug === slug)
        : undefined;
      if (existing) {
        printHumanResult(existing, false, true);
        process.exit(0);
        return;
      }
    }
    if (stdout.isTTY && !process.argv.includes("--json")) {
      process.stderr.write(`${error.message}\n`);
    } else {
      printJson({
        ok: false,
        error: error.message,
        ...error.payload,
      });
    }
    process.exit(error.exitCode);
  }
  if (error instanceof CatalogMovieError) {
    if (stdout.isTTY && !process.argv.includes("--json")) {
      process.stderr.write(`${error.message}\n`);
    } else {
      printJson({ ok: false, error: error.message, code: error.code });
    }
    process.exit(1);
  }
  console.error(error);
  process.exit(1);
});
