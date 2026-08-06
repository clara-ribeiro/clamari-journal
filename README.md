# clamari journal

Personal diary for movies, series, and books. Read-only site: personal records live in repository files, and metadata comes from external APIs.

## Stack

Aligned with [devxperience](https://github.com/):

- Next.js 16 (App Router) + TypeScript
- React 19
- Stitches (`@stitches/react`)
- Lucide React
- Vitest
- Deploy planned on Vercel

## Architecture

```text
src/
├── app/                      # Thin routes (presentation)
├── components/               # Atomic design (atoms → templates)
├── content/
│   ├── copy/                 # UI strings (site, pages)
│   └── reviews/              # Reviews in MD/MDX
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
└── styles/                   # Stitches tokens
```

Flow: `app` → `use-cases` → ports via `composition/repositories` → `infrastructure/persistence` → `data/*.json`.

APIs (TMDB / Google Books) live under `infrastructure`, marked `server-only`, and must not be imported from client components.

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
3. Prefer flex for section layouts unless an existing polished surface already uses another approach. `HomeStatsCollage` must stay flex-only (no CSS grid).
4. Reuse shared content width via `$containerWide` and consistent horizontal padding with the home sections.

### Atomic design

```text
atoms/       → single-purpose UI (BrandTitle, StarRating, SkipLink, …)
molecules/   → small compositions (EntryCard, HeroNav, …)
organisms/   → sections (HomeHero, EntriesCarousel, HomeStatsCollage, …)
templates/   → page shells (HomeTemplate, MediumCatalogTemplate, StatsTemplate, …)
```

- Default-export the component; export a `{Name}Props` type.
- Accept optional `className?: string` when composition needs it.
- Name styled wrappers clearly (`Root`, `Section`, `List`, …).

### Content / copy

- Page and section strings live under `src/content/copy/` (`siteCopy`, `homeCopy`, …), exported from `content/copy/index.ts`.
- Use `as const` objects and `type XCopy = typeof xCopy`.
- Image `src` / `alt` for marketing surfaces (e.g. stats collage, hero lettering) live in copy; styles may import those paths for `background-image`.

### Data & application layer

- Personal records: `src/data/*.json`, validated at load in `infrastructure/persistence/parse-json.ts`.
- Use-cases return **ready-to-render DTOs** from `application/dto` (e.g. `JournalEntry`, `CatalogListItem`). UI must not build `href` / `posterUrl` / summary strings.
- Movie/series art: offline `npm run enrich:tmdb` writes `tmdbId` + `posterPath`.
- Book covers: store `coverUrl` on the book entry (no per-request Google Books calls in listings).
- Repository interfaces in `application/repositories`; wire implementations only in `composition/repositories.ts`.
- External API clients (`tmdb`, `google-books`) import `server-only`.

### Routing

- App Router under `src/app/`.
- Thin `page.tsx` + template for every screen.
- Route segments: kebab-case (`/all-entries`, `/movies/[slug]`).
- Prefer `prefetch={false}` on dense internal link lists unless there is a reason to prefetch.

### Naming

| Kind | Convention |
|---|---|
| Components / folders | PascalCase (`HomeStatsCollage`) |
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

- Unit tests next to pure logic (`*.test.ts`) with Vitest.
- `server-only` is stubbed in `vitest.config.mts` for Node tests.
- Lint: `npm run lint`. Prefer fixing root causes over disabling rules.
- This Next.js version may differ from training data — check `node_modules/next/dist/docs/` and `AGENTS.md` before assuming APIs.

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
npm run dev            # development
npm run build          # production
npm run lint
npm test
npm run import:tvtime  # regenerate movies.json / series.json
npm run enrich:tmdb    # fill tmdbId + posterPath (requires token)
```

## Environment variables

| Variable | Usage |
|---|---|
| `TMDB_ACCESS_TOKEN` | Movies and series (server only) |
| `GOOGLE_BOOKS_API_KEY` | Books (optional; enrich scripts / low volume) |

Never expose these tokens to the client. Never prefix them with `NEXT_PUBLIC_`.
