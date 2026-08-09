# clamari journal

Personal diary for movies, series, and books. Read-only site: personal records live in repository files, and metadata comes from external APIs.

## Stack

- Next.js 16 (App Router) + TypeScript — see `AGENTS.md` / `node_modules/next/dist/docs/` before assuming APIs (this Next version may differ from training data)
- React 19
- Stitches (`@stitches/react`) + `StitchesRegistry` in the root layout
- Lucide React (icons)
- Vitest
- Deploy planned on Vercel

Fonts (via `next/font` in `src/app/layout.tsx`): Anton (`$display`), Monsieur La Doulaise (`$script`), Instrument Serif (`$section`). Prefer font tokens over raw `var(--font-…)` stacks.

## Getting started

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
│   └── reviews/              # Reserved for MD/MDX reviews (not wired yet)
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

Flow: `app` → `use-cases` → ports via `composition/repositories` → `infrastructure/persistence` → `data/*.json`.

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
- `src/content/reviews/{films,series,books}/` is reserved for future MD/MDX reviews; nothing reads it yet.

### Personal JSON conventions

Edit files under `src/data/` carefully; malformed entries fail at repository load with a path like `movies.json[12].rating`.

| File | Identity | Notes |
|---|---|---|
| `movies.json` | unique `slug`; unique `tvtimeUuid` / `tmdbId` when set | `status`: `watchlist` \| `watched` \| `rewatch`. Dates `YYYY-MM-DD`. `tmdbId` / `posterPath` optional until enrichment. |
| `series.json` | unique `slug`, `tvdbId`; unique `tmdbId` when set | `status`: `watchlist` \| `watching` \| `up-to-date` \| `paused` \| `completed` \| `abandoned`. `watchedEpisodes[].season` / `episode` integers ≥ 1. `startedAt` ≤ `finishedAt` when both set. |
| `books.json` | unique `slug`, `googleBooksId` | `status`: `want-to-read` \| `reading` \| `paused` \| `finished` \| `abandoned`. Optional `format`: `physical` \| `ebook` \| `audiobook`. `currentPage` / history / quote pages cannot exceed `customPageCount` when that total is set. |
| `goals.json` | single object | Integer `year` (1900–2100) and non-negative integer targets: `movies`, `books`, `series`, `pages`. |

Shared rules: ratings are half-stars `0.5`–`5`; never use negative runtimes, page counts, or goal targets; do not invent progress percentages when page totals are unknown.

### Routing

- App Router under `src/app/`.
- Thin `page.tsx` + template for every screen.
- Route segments: kebab-case (`/all-entries`, `/films/[slug]`).
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
  - `npm run lint` — ESLint
  - `npm run typecheck` — `tsc --noEmit`
  - `npm run build` — production build
- CI (GitHub Actions, `.github/workflows/ci.yml`) runs lint → typecheck → tests → build on pushes and pull requests to `main` / `master`.
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
npm run import:tvtime  # regenerate movies.json / series.json
npm run enrich:tmdb          # fill tmdbId + posterPath (requires token)
npm run enrich:google-books  # fill coverUrl (+ title) from Google Books
```

GitHub Actions (`.github/workflows/ci.yml`) runs `lint`, `typecheck`, `test:run`, and `build` on every push/PR to `main` or `master`.
## Environment variables

| Variable | Usage |
|---|---|
| `TMDB_ACCESS_TOKEN` | Movies and series (server only) |
| `TMDB_LANGUAGE` | Optional TMDB metadata language (default `en-US`), e.g. `pt-BR` |
| `GOOGLE_BOOKS_API_KEY` | Optional Google Books key (server only; low-volume public queries work without it) |

Never expose these tokens to the client. Never prefix them with `NEXT_PUBLIC_`.

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
