# clamari journal

Personal diary for movies, series, and books. Read-only site: personal records live in repository files, and metadata comes from external APIs.

## Stack

- Next.js 16 (App Router) + TypeScript — see `AGENTS.md` / `node_modules/next/dist/docs/` before assuming APIs (this Next version may differ from training data)
- React 19
- Stitches (`@stitches/react`) + `StitchesRegistry` in the root layout
- Lucide React (icons)
- Vitest
- Deploy: Vercel (app) + Storybook on a subdomain (separate Vercel project)

Fonts (via `next/font` in `src/app/root-document.tsx`): Anton (`$display`), Monsieur La Doulaise (`$script`), Instrument Serif (`$section`). Prefer font tokens over raw `var(--font-…)` stacks.

## Getting started

Requires **Node 22** (see `.nvmrc`; `engines.node` allows `>=20.9.0` for local work). Vercel reads `.nvmrc` for Production and Preview.

```bash
cp .env.example .env.local
# set TMDB_ACCESS_TOKEN (and optionally GOOGLE_BOOKS_API_KEY)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For production-like checks (including Lighthouse):

```bash
npm run build && npm start
```

## Architecture

```text
src/
├── app/                      # Thin routes + layout + StitchesRegistry
├── components/               # Atomic design (atoms → templates)
├── content/
│   ├── copy/                 # UI strings (site, pages)
│   └── reviews/              # Local Markdown reviews (`{films,series,books}/{slug}.md`)
├── composition/              # Binds repository ports → infrastructure
├── domain/                   # Entities and pure rules
│   ├── entities/
│   └── value-objects/
├── application/              # Use cases + repository contracts + DTOs
│   ├── dto/
│   ├── repositories/
│   └── use-cases/
├── infrastructure/           # External adapters (server-only APIs)
│   ├── persistence/          # Reads/validates files under data/
│   ├── tmdb/
│   └── google-books/
├── data/                     # Personal journal records (JSON)
├── lib/                      # Shared utilities
├── styles/                   # Stitches tokens + globalCss
└── test/                     # Test stubs (e.g. server-only)

public/images/                # Static marketing assets (hero, stats, noise)
scripts/                      # import:tvtime, enrich:tmdb, enrich:google-books
```

Flow: `app` → `use-cases` → ports via `composition/repositories` → `infrastructure/persistence` → `data/*.json` and `content/reviews/**/*.md`.

APIs (TMDB / Google Books) live under `infrastructure`, marked `server-only`, and must not be imported from client components.

### Routes

| Path | Purpose |
|---|---|
| `/` | Home (hero, carousels, stats collage) |
| `/all-entries` | Full entry grid |
| `/favorites` | Favorites grid |
| `/films`, `/series`, `/books` | Medium catalogs |
| `/films/[slug]`, `/series/[slug]`, `/books/[slug]` | Medium detail |
| `/stats` | Lifetime stats |
| `/sitemap.xml`, `/robots.txt` | Generated crawl files (`src/app/sitemap.ts`, `src/app/robots.ts`) |

## Conventions

Rules and patterns for keeping the codebase coherent. Follow these when adding or changing code.

### Responsibilities

| Concern | Lives in | Must not |
|---|---|---|
| Routes / data fetching for a page | `src/app/**/page.tsx` | Own presentation styles or assemble list DTOs |
| UI composition | `src/components/**` | Call repositories or read JSON directly |
| Visual styles | Co-located `styles.ts` | Inline `style={}`, `styled()` in `index.tsx` / `page.tsx` |
| UI strings, image paths, aria labels | `src/content/copy/` | Hardcoded copy in components |
| Domain types & pure rules | `src/domain/` | Know about React, Next, or file paths |
| Ready-to-render DTOs | `src/application/dto/` + use-cases | Live in `domain/` or be assembled in UI |
| Use cases | `src/application/use-cases/` | Import from `components/` or concrete `File*` repos |
| Port ↔ adapter binding | `src/composition/` | Be scattered across use-cases |
| Persistence & external APIs | `src/infrastructure/` | Leak into client bundles |
| Design tokens | `src/styles/stitches.config.ts` | One-off colors/spacing when a token fits |

### Style isolation (mandatory)

1. Every UI component is a folder: `ComponentName/index.tsx` + `ComponentName/styles.ts`.
2. All Stitches `styled()` definitions live in `styles.ts` only.
3. `index.tsx` imports styled primitives from `./styles` and only composes structure, props, and content.
4. **No** inline `style={{ ... }}` in components or pages.
5. **No** `styled(...)` inside `index.tsx`, templates, or route `page.tsx` files.
6. Route pages stay thin: fetch via use-cases → pass data into a template/organism.
7. Variants and visual treatments (backgrounds, opacity overlays, hover, breakpoints) belong in `styles.ts`, even when driven by copy paths imported from `@/content/copy`.
8. Prefer font tokens (`$display`, `$script`, `$section`, `$heading`, `$body`) over raw `var(--font-…)` stacks.
9. Templates that use Stitches `styled` must be Client Components (`"use client"`). `@stitches/react` registers CSS in the same runtime as `StitchesRegistry`; Server Components generate class names that never reach `getCssText()`, so the page renders unstyled.

### Layout & CSS constraints

1. **Do not use `position: absolute` or `position: relative` anywhere** in app/UI styles. Prefer flex, aspect-ratio, overflow clipping, margins, and background-image.
2. Do not use Next.js `Image` with the `fill` prop (it injects absolute positioning). Use explicit `width` / `height` plus CSS sizing (`width/height: 100%`, `object-fit`).
3. When CSS changes only one of `width` / `height` on a Next `Image`, set the other to `auto` (or both deliberately for `object-fit: cover` fill) so the aspect ratio does not break.
4. Prefer flex for section layouts unless an existing polished surface already uses another approach. `StatsCollage` must stay flex-only (no CSS grid).
5. Reuse shared content width via `$containerWide` / `$containerContent` / `$containerReading` and consistent horizontal padding with the home sections.
6. **Keep load-bearing sizing** where layout depends on it:
   - `minWidth: 0` on flex/grid children that shrink or use text ellipsis (cards, carousel items, catalog grids)
   - `minmax(0, 1fr)` (not bare `1fr`) in equal-column grids so long titles cannot widen a track
   - Container `maxWidth` + `mx: auto` on reading/catalog page shells
7. Breakpoints (Stitches media): `sm` 480px, `md` 768px, `lg` 1024px, `xl` 1280px; plus `@motionReduce`.

### Atomic design

```text
atoms/       → single-purpose UI (BrandTitle, StarRating, SkipLink, …)
molecules/   → small compositions (EntryCard, HeroNav, …)
organisms/   → sections (HomeHero, EntriesCarousel, StatsCollage, …)
templates/   → page shells (HomeTemplate, MediumCatalogTemplate, StatsTemplate, …)
```

- Default-export the component; export a `{Name}Props` type.
- Accept optional `className?: string` when composition needs it.
- Name styled wrappers clearly (`Root`, `Section`, `List`, …).

### Content / copy

- Page and section strings live under `src/content/copy/` (`siteCopy`, `homeCopy`, …), exported from `content/copy/index.ts`.
- Use `as const` objects and `type XCopy = typeof xCopy`.
- Image `src` / `alt` for marketing surfaces (e.g. stats collage, hero lettering) live in copy; styles may import those paths for `background-image`.
- Static files: `public/images/home/**`, `public/images/shared/noise-grain.webp`.
- Remote posters: allowlisted in `next.config.ts` (`image.tmdb.org`, Google Books hosts).

### Data & application layer

- Personal records: `src/data/*.json`, validated at load in `infrastructure/persistence/parse-json.ts`.
- Use-cases return **ready-to-render DTOs** from `application/dto` (e.g. `JournalEntry`, `CatalogListItem`). UI must not build `href` / `posterUrl` / summary strings.
- Movie/series art: offline `npm run enrich:tmdb` writes `tmdbId` + `posterPath`.
- Book covers: offline `npm run enrich:google-books` writes `coverUrl` from Google Books (no per-request API in listings).
- Repository interfaces in `application/repositories`; wire implementations only in `composition/repositories.ts`.
- External API clients (`tmdb`, `google-books`) import `server-only`.
- Reviews: `src/content/reviews/{films,series,books}/{reviewSlug}.md`. `FileReviewRepository` compiles Markdown to sanitized HTML; `ReviewRenderer` shows the body or the empty/pending label.

### Adding a film

The catalog is file-based (no admin UI). In a terminal, with `TMDB_ACCESS_TOKEN` in `.env.local`:

```bash
npm run add:movie
```

The script asks for the title, searches TMDB, lets you pick when several films match, and writes API metadata (`tmdbId`, poster, runtime, release date) into `src/data/movies.json`. It does **not** collect rating, watch dates, or review text.

After it saves, it prints how to finish the journal row by hand:

1. In `src/data/movies.json`, find the new object (`slug`) and add personal fields: `rating` (whole stars `1`–`5`), `watchedDates` (`YYYY-MM-DD`; one date per viewing), optional `favorite`, `tags`, `watchLocation`, `streamingService`.
2. For a review, create `src/content/reviews/films/{slug}.md`. The script already sets `reviewSlug` to that filename. Until the markdown exists, the detail page shows the pending label.

Pass the title to skip the first prompt:

```bash
npm run add:movie -- "Poor Things"
npm run add:movie -- "Heat (1995)" --yes
```

`--yes` disables prompts (fails if the title is ambiguous).

### Publishing a review

Until a database exists, reviews ship with the Git deploy:

1. Set `reviewSlug` on the journal entry in `movies.json` / `series.json` / `books.json` (kebab-case, matching the filename).
2. Add `src/content/reviews/{films,series,books}/{reviewSlug}.md`.
3. Optional Portuguese sibling: add `src/content/reviews/{films,series,books}/{reviewSlug}.pt.md`. That publishes a second page at `/pt/{films|series|books}/{slug}` with `lang="pt-BR"`, Portuguese title/description, and `hreflang` both ways. Do not put both languages in one file. Translate by hand.
4. Commit and deploy.

The Portuguese file may start with optional front matter for the localized work title (used in the H1 and `<title>` when TMDB `pt-BR` is unavailable):

```md
---
title: Gata em Telhado de Zinco Quente
---

Texto da resenha em português.
```

Reuse the same stills as the English essay (`/images/reviews/...`). The English URL stays the canonical `en` page; `/pt/...` is `pt-BR`. The header language switch (EN | PT) is always available and maps the current path to the other locale. Without a `.pt.md` file, the English detail page has no `hreflang`, and the Portuguese URL 404s until the sibling exists.

Spoiler blocks (`:::spoiler`) stay collapsed on the page and are **omitted** from the meta description and JSON-LD `reviewBody`. On Portuguese pages the default summary is “Alerta de spoilers”.

Supported Markdown: headings, paragraphs, emphasis, strong, block quotes, lists, links, images, and separators (`---`). Raw HTML and scripts are stripped. Images allow `https://…` URLs or site-root paths (`/images/reviews/still.webp` in `public/`). Spoilers use a container directive (collapsed `<details>` / `<summary>`):

```md
![Still from the film](/images/reviews/hereditary-still.webp)

:::spoiler[The ending]
They almost make it.
:::
```

Omit the `[label]` to use the default “Spoilers” summary. If `reviewSlug` is set but the file is missing, the detail page shows the pending label. Detail routes stay in `sitemap.xml`; review HTML is part of the statically generated page.

### Personal JSON conventions

Edit files under `src/data/` carefully; malformed entries fail at repository load with a path like `movies.json[12].rating`.

| File | Identity | Notes |
|---|---|---|
| `movies.json` | unique `slug`; unique `tvtimeUuid` / `tmdbId` when set | `status`: `watchlist` \| `watched` \| `rewatch`. Dates `YYYY-MM-DD`. `tmdbId` / `posterPath` optional until enrichment. Optional `reviewSlug` matches `src/content/reviews/films/{slug}.md` (Portuguese sibling: `{slug}.pt.md`). |
| `series.json` | unique `slug`, `tvdbId`; unique `tmdbId` when set | `status`: `watchlist` \| `watching` \| `up-to-date` \| `paused` \| `completed` \| `abandoned`. `watchedEpisodes[].season` / `episode` integers ≥ 1. `startedAt` ≤ `finishedAt` when both set. Optional `reviewSlug` matches `src/content/reviews/series/{slug}.md`. |
| `books.json` | unique `slug`, `googleBooksId` | `status`: `want-to-read` \| `reading` \| `paused` \| `finished` \| `abandoned`. Optional `format`: `physical` \| `ebook` \| `audiobook`. `currentPage` / history / quote pages cannot exceed `customPageCount` when that total is set. Optional `reviewSlug` matches `src/content/reviews/books/{slug}.md`. |
| `goals.json` | single object | Integer `year` (1900–2100) and non-negative integer targets: `movies`, `books`, `series`, `pages`. |

Shared rules: ratings are whole stars `1`–`5`; never use negative runtimes, page counts, or goal targets; do not invent progress percentages when page totals are unknown.

### Routing

- App Router under `src/app/`.
- Thin `page.tsx` + template for every screen.
- Route segments: kebab-case (`/all-entries`, `/films/[slug]`, `/pt/films/[slug]`).
- Prefer `prefetch={false}` on dense internal link lists unless there is a reason to prefetch.

### Naming

| Kind | Convention |
|---|---|
| Components / folders | PascalCase (`StatsCollage`) |
| Props | `{Name}Props` |
| Copy modules | `{area}Copy` |
| Entities | `{Thing}Entry` where applicable |
| Repositories | `*-repository.ts` / `File*Repository` |
| Use-case files | plural domain noun (`entries.ts`, `stats.ts`) |
| Data JSON | plural (`movies.json`) |
| Slugs | kebab-case via `src/lib/slug.ts` |

### Imports

- Alias `@/*` → `src/*` (`tsconfig.json`).
- Cross-module imports use `@/…`; co-located styles use `./styles` only.
- Use-cases import ports from `@/composition/repositories`, never `File*Repository` classes.

### Testing & tooling

- Unit and component tests live next to the code (`*.test.ts` / `*.test.tsx`) and run with Vitest.
- Local commands:
  - `npm test` — watch mode
  - `npm run test:run` — single CI-friendly run (no live external API calls; `fetch` is blocked in the test setup)
  - `npm run test:coverage` — unit tests plus v8 coverage (fails if high-value layers drop below the thresholds in `vitest.config.mts`)
  - `npm run lint` — ESLint
  - `npm run typecheck` — `tsc --noEmit`
  - `npm run build` — production build
- CI (GitHub Actions, `.github/workflows/ci.yml`) is the required quality gate: lint → typecheck → coverage tests → production `build` on every pull request and every push to `main` / `master`. The check name is **`CI / quality`**.
- `server-only` is stubbed in `vitest.config.mts` / `src/test/server-only-stub.ts` for Node/jsdom tests.
- Prefer fixing root causes over disabling lint rules.
- **Lighthouse after major changes:** whenever you ship a meaningful change (layout, styling, data fetching, images, fonts, client JS, routing, etc.), run Lighthouse on the affected page(s) (Chrome DevTools → Lighthouse, or CI if configured) and check that scores did not regress — especially **Performance**. Also glance at Accessibility, Best Practices, and SEO. Prefer measuring a production build (`npm run build && npm start`) over `next dev`. If a category drops, investigate before merging.

### Accessibility & motion

- Skip link in root layout (`SkipLink` → `#main-content`).
- Meaningful `aria-label` / headings from copy where sections need them.
- Respect `@motionReduce` in interactive hover/transform styles.
- Decorative images: empty `alt=""`; informative images: real alt text in copy.

### What not to commit

- Secrets (`.env.local`, API tokens).
- Personal GDPR zip (`src/data/gdpr-data.zip` is gitignored).

## Imported data (TV Time)

The TV Time GDPR export was converted into:

| File | Contents |
|---|---|
| `src/data/series.json` | 322 series + watched episodes (`tvdbId`, enriched `tmdbId` / `posterPath`) |
| `src/data/movies.json` | 496 movies (`tvtimeUuid`, enriched `tmdbId` / `posterPath`) |
| `src/data/books.json` | personal book entries (`googleBooksId`; optional `coverUrl`) |
| `src/data/goals.json` | yearly goals |

Re-run TMDB enrichment after re-importing:

```bash
cp .env.example .env.local
# set TMDB_ACCESS_TOKEN
npm run enrich:tmdb
```

The enrich script writes `tmdbId` and `posterPath` into the JSON so listing pages build poster URLs without calling TMDB per request.

Re-import the GDPR zip (default: `src/data/gdpr-data.zip`):

```bash
npm run import:tvtime
```

`src/data/gdpr-data.zip` is gitignored (personal data).

## Scripts

```bash
npm run dev            # next dev --webpack
npm run build          # next build --webpack
npm start              # serve production build
npm run lint
npm run typecheck      # tsc --noEmit
npm test               # vitest watch
npm run test:run       # vitest run (CI-friendly; no live APIs)
npm run test:coverage  # unit tests + coverage thresholds
npm run import:tvtime  # regenerate movies.json / series.json
npm run add:movie            # interactive: search TMDB and add a watched film
npm run enrich:tmdb          # fill tmdbId + posterPath (requires token)
npm run enrich:google-books  # fill coverUrl (+ title) from Google Books
npm run storybook            # Storybook dev server (:6006)
npm run build-storybook      # static Storybook → storybook-static/
```

GitHub Actions:

- `.github/workflows/ci.yml` — required check **`CI / quality`**: `npm ci`, lint, typecheck, `test:coverage`, and Next `build` (empty provider tokens) on every push/PR to `main` / `master`. Superseded runs cancel in progress.
- `.github/workflows/storybook.yml` — check **`Storybook / build`**: `build-storybook` (catches broken stories before deploy)

```bash
npm run storybook        # local Storybook (port 6006)
npm run build-storybook  # static export → storybook-static/
```

## Deploy

### CI/CD flow

```text
push / pull request
        │
        ├─ GitHub Actions  CI / quality     (lint, types, coverage, build)
        ├─ GitHub Actions  Storybook / build
        │
        └─ Vercel Git integration
              ├─ Preview  → every pull request
              └─ Production → default branch (master / main) after merge
```

1. **CI is the merge gate.** Mark **`CI / quality`** as a required status check on the default branch (GitHub **Settings → Rules → Rulesets**, or classic branch protection). Do not merge or treat a commit as production-ready without a green run. Optionally also require **`Storybook / build`**.
2. **Vercel is the CD surface.** With Git integration enabled, Preview Deployments build each PR and Production builds the default branch. Leave **Ignored Build Step** unset — skipping docs-only paths is not worth hiding app risk at launch.
3. **Env vars on both Preview and Production** (available at **Build** time): `TMDB_ACCESS_TOKEN`, optional `TMDB_LANGUAGE`, optional `GOOGLE_BOOKS_API_KEY`. Never `NEXT_PUBLIC_*` for secrets. CI itself uses empty tokens so the pipeline does not call live APIs or print credentials.
4. **Broken commits stay off production.** A failed `CI / quality` run blocks merge when the check is required. A failed Vercel Production build does not promote that commit. Do not deploy Production from a branch that skipped CI.

### App (production site)

1. Import this repository into a Vercel project (Framework: Next.js).
2. Set env vars for **Production** and **Preview**, available at **Build** time: `TMDB_ACCESS_TOKEN` (required for live TMDB metadata / hero backdrops), optional `TMDB_LANGUAGE`, `GOOGLE_BOOKS_API_KEY`. Never use `NEXT_PUBLIC_*` for secrets. Confirm both environments have the same keys (values may differ).
3. Deploy the default branch. Attach the apex / `www` domain in **Settings → Domains**. Node version comes from `.nvmrc` (`22`).
4. Optional: set `SITE_URL` (e.g. `https://clamari.com.br`) for Production so canonicals and the sitemap use the public domain. If unset, the build uses `VERCEL_PROJECT_PRODUCTION_URL`.

Detail pages are statically generated at build time; without `TMDB_ACCESS_TOKEN` during the build, posters from `posterPath` still work but synopsis / credits / backdrop stay empty.

### SEO and analytics

- **Canonicals:** `metadataBase` comes from `SITE_URL` (or Vercel’s production host). List and detail pages set `alternates.canonical` to the clean path (filter query strings are not canonical).
- **Indexing:** Production allows crawlers (`src/app/robots.ts` + `robots` metadata). Vercel Preview sets `VERCEL_ENV=preview` and is `noindex`.
- **Sitemap:** `src/app/sitemap.ts` lists home, catalogs, stats, feeds (`/all-entries`, `/favorites`, `/reviews`), every film/series/book detail slug, and Portuguese review siblings (`/pt/...`) when a `.pt.md` file exists. Reciprocal `hreflang` is set on both URLs.
- **Open Graph / Twitter:** site defaults in the root layout; film/series/book detail pages prefer poster or cover images. A published review switches the detail Open Graph type to `article` and uses `{title} review` (or `Resenha de {title}` on `pt-BR`) plus a spoiler-free excerpt. Portuguese pages set `og:locale` to `pt_BR`.
- **JSON-LD:** detail pages emit `Movie` / `TVSeries` / `Book` structured data. When review markdown exists, the page is a personal `Review` of that work (`reviewRating` only if the journal has stars). Never `AggregateRating`. Portuguese reviews set `inLanguage` to `pt-BR`.
- **Analytics:** `@vercel/analytics` and `@vercel/speed-insights` load in the root layout. They need **no env vars and no tokens**. In the Vercel project: **Analytics** and **Speed Insights** → enable for Production (and Preview if you want Web Vitals there).
- Provider secrets (`TMDB_ACCESS_TOKEN`, `GOOGLE_BOOKS_API_KEY`) stay server-only (`import "server-only"`). Never prefix them with `NEXT_PUBLIC_`.

### Storybook (`storybook.<your-domain>`)

Use a **second** Vercel project on the **same** GitHub repo so the Next app and Storybook do not share one `vercel.json`.

1. [vercel.com/new](https://vercel.com/new) → import `clara-ribeiro/clamari-journal` again → name it e.g. `clamari-journal-storybook`.
2. **Settings → General → Build & Development Settings** (override):
   - Framework Preset: **Other**
   - Build Command: `npm run build-storybook`
   - Output Directory: `storybook-static`
   - Install Command: `npm ci`
3. Optional: paste the contents of `vercel.storybook.json` into that project’s **Settings → JSON**, or keep overrides only in the dashboard (do **not** rename it to `vercel.json` on `master` — that would break the Next app project).
4. **Settings → Domains** → add `storybook.<your-domain>` (e.g. `storybook.clamari.com.br`) and create the DNS record Vercel shows (usually a CNAME).
5. Each push to the default branch rebuilds Storybook on that project (same as the app project).

Local check: `npm run build-storybook` then serve `storybook-static/` with any static server.

## Environment variables

| Variable | Usage |
|---|---|
| `TMDB_ACCESS_TOKEN` | Movies and series (server only) |
| `TMDB_LANGUAGE` | Optional TMDB metadata language (default `en-US`), e.g. `pt-BR` |
| `GOOGLE_BOOKS_API_KEY` | Optional Google Books key (server only; low-volume public queries work without it) |
| `SITE_URL` | Optional canonical origin for `metadataBase`, sitemap, and robots (e.g. `https://clamari.com.br`). Not a secret. On Vercel, omit to use `VERCEL_PROJECT_PRODUCTION_URL`. |

Never expose provider tokens to the client. Never prefix them with `NEXT_PUBLIC_`. Vercel Analytics and Speed Insights do not use project env vars.

### TMDB metadata adapter

Server-only module: `src/infrastructure/tmdb/`. Use cases should consume normalized DTOs from `@/application/dto` (`TmdbMovieMetadata`, `TmdbSeriesMetadata`, …), not raw TMDB JSON.

| Concern | Behavior |
|---|---|
| Language | `TMDB_LANGUAGE` or default `en-US` |
| Timeouts | 10s abort per request (`TmdbError` code `timeout`) |
| Errors | `TmdbError` codes: `not_configured`, `not_found`, `rate_limited`, `timeout`, `network`, `bad_response`, `upstream` — messages never include provider payloads |
| Cache | Search revalidates hourly; detail/season/find daily (`next.revalidate` + tag `tmdb:search` / `tmdb:detail`) |
| Images | Absolute URLs via `tmdbImageUrl` (`posterUrl`, `backdropUrl`, stills, profiles) |
| Fixtures | Deterministic samples under `src/infrastructure/tmdb/fixtures/` for normalizer tests |

### Google Books metadata adapter

Server-only module: `src/infrastructure/google-books/`. Use cases should consume normalized DTOs (`GoogleBooksMetadata`, `GoogleBooksSearchPage`, …), not raw volume payloads.

| Concern | Behavior |
|---|---|
| Search modes | `searchBooks` (free text), `searchBooksByTitle`, `searchBooksByAuthor`, `searchBooksByIsbn` |
| Timeouts | 10s abort per request (`GoogleBooksError` code `timeout`) |
| Errors | `GoogleBooksError` codes: `not_found`, `rate_limited`, `timeout`, `network`, `bad_response`, `upstream`, `invalid_query` |
| Cache | Search hourly; volume detail daily (`google-books:search` / `google-books:detail`) |
| Covers | Prefer largest `imageLinks` size; upgrade `http` → `https`; bump common `zoom=1` thumbnails to `zoom=2` |
| Page count | `getBookById(id, { customPageCount })` / `withPersonalPageCount` apply journal overrides without inventing totals |
| API key | Optional `GOOGLE_BOOKS_API_KEY` appended server-side only |
| Fixtures | `src/infrastructure/google-books/fixtures/` |
