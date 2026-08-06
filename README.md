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
├── app/                      # Routes (presentation layer)
├── components/               # Atomic design (atoms → templates)
├── content/
│   ├── copy/                 # UI strings (site, pages)
│   └── reviews/              # Reviews in MD/MDX
├── domain/                   # Entities and pure rules
│   ├── entities/
│   └── value-objects/
├── application/              # Use cases + repository contracts
│   ├── repositories/
│   └── use-cases/
├── infrastructure/           # External adapters
│   ├── persistence/          # Reads files under data/
│   ├── tmdb/
│   └── google-books/
├── data/                     # Personal journal records (JSON)
├── lib/                      # Shared utilities
└── styles/                   # Stitches tokens
```

Flow: `app` → `use-cases` → `repositories` (interface) → `infrastructure/persistence` → `data/*.json`.

APIs (TMDB / Google Books) live under `infrastructure` and run on the server only.

## Conventions

Rules and patterns for keeping the codebase coherent. Follow these when adding or changing code.

### Responsibilities

| Concern | Lives in | Must not |
|---|---|---|
| Routes / data fetching for a page | `src/app/**/page.tsx` | Own presentation styles or assemble list DTOs |
| UI composition | `src/components/**` | Call repositories or read JSON directly |
| Visual styles | Co-located `styles.ts` | Inline `style={}`, `styled()` in `index.tsx` / `page.tsx` |
| UI strings, image paths, aria labels | `src/content/copy/` | Hardcoded copy in components (except trivial a11y wiring) |
| Domain types & pure rules | `src/domain/` | Know about React, Next, or file paths |
| Use cases / ready-to-render DTOs | `src/application/use-cases/` | Import from `components/` |
| Persistence & external APIs | `src/infrastructure/` | Leak into client bundles |
| Design tokens | `src/styles/stitches.config.ts` | One-off colors/spacing scattered in components when a token fits |

### Style isolation (mandatory)

1. Every UI component is a folder: `ComponentName/index.tsx` + `ComponentName/styles.ts`.
2. All Stitches `styled()` definitions live in `styles.ts` only.
3. `index.tsx` imports styled primitives from `./styles` and only composes structure, props, and content.
4. **No** inline `style={{ ... }}` in components or pages.
5. **No** `styled(...)` inside `index.tsx`, templates, or route `page.tsx` files.
6. Route pages stay thin: fetch via use-cases → pass data into a template/organism. Put page chrome in a template’s `styles.ts` (see `HomeTemplate`, `AllEntriesTemplate`).
7. Variants and visual treatments (backgrounds, opacity overlays, hover, breakpoints) belong in `styles.ts`, even when driven by copy paths imported from `@/content/copy`.
8. Global tokens and `globalStyles` stay in `src/styles/stitches.config.ts`. Prefer tokens (`$colors`, `$space`, `$fonts`, media queries) over raw values.

**Audit (current):** polished home / all-entries / favorites follow this. Scaffold routes under `app/movies`, `app/series`, `app/books`, and `app/stats` still declare `styled()` in the page file — migrate them to templates + `styles.ts` when those screens are built out.

### Layout & CSS constraints

1. **Do not use `position: absolute` or `position: relative` anywhere** in app/UI styles. Prefer flex, aspect-ratio, overflow clipping, margins, and background-image.
2. Do not use Next.js `Image` with the `fill` prop (it injects absolute positioning). Use explicit `width` / `height` plus CSS sizing (`width/height: 100%`, `object-fit`).
3. Prefer flex for section layouts unless an existing polished surface already uses another approach. `HomeStatsCollage` must stay flex-only (no CSS grid).
4. Reuse shared content width via `$containerWide` and consistent horizontal padding with the home sections.

### Atomic design

```text
atoms/       → single-purpose UI (BrandTitle, StarRating, …)
molecules/   → small compositions (EntryCard, HeroNav, …)
organisms/   → sections (HomeHero, EntriesCarousel, HomeStatsCollage, …)
templates/   → page shells that wire organisms (HomeTemplate, AllEntriesTemplate, …)
```

- Default-export the component; export a `{Name}Props` type.
- Accept optional `className?: string` when composition needs it.
- Name styled wrappers clearly (`Root`, `Section`, `List`, …).

### Content / copy

- Page and section strings live under `src/content/copy/` (`siteCopy`, `homeCopy`, …), exported from `content/copy/index.ts`.
- Use `as const` objects and `type XCopy = typeof xCopy`.
- Image `src` / `alt` for marketing surfaces (e.g. stats collage) live in copy; styles may import those paths for `background-image`, but JSX must not invent visual effects.

### Data & application layer

- Personal records: `src/data/*.json` via file repositories.
- Use-cases return **ready-to-render DTOs** (e.g. `JournalEntry` with `posterUrl`, `href`). UI must not build those fields.
- Enrichment (TMDB ids / `posterPath`) is offline (`npm run enrich:tmdb`), not per-request for full catalogs.
- Repository interfaces in `application/repositories`; implementations in `infrastructure/persistence`.
- External API clients (`tmdb`, `google-books`) are server-only.

### Routing

- App Router under `src/app/`.
- Polished pages: thin `page.tsx` + template.
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

### Testing & tooling

- Unit tests next to pure logic (`*.test.ts`) with Vitest.
- Lint: `npm run lint`. Prefer fixing root causes over disabling rules.
- This Next.js version may differ from training data — check `node_modules/next/dist/docs/` and `AGENTS.md` before assuming APIs.

### Accessibility & motion

- Meaningful `aria-label` / headings from copy where sections need them.
- Respect `@motionReduce` in interactive hover/transform styles (already used on cards and stats cells).
- Decorative images: empty `alt=""`; informative images: real alt text in copy.

### What not to commit

- Secrets (`.env.local`, API tokens).
- Personal GDPR zip (`src/data/gdpr-data.zip` is gitignored).

## Imported data (TV Time)

The TV Time GDPR export was converted into:

| File | Contents |
|---|---|
| `src/data/series.json` | ~325 series + watched episodes (`tvdbId`) |
| `src/data/movies.json` | ~496 movies (`tvtimeUuid`, title, dates) |
| `src/data/books.json` | empty (no source yet) |
| `src/data/goals.json` | yearly goals |

TMDB ids are not filled yet. After configuring the token:

```bash
cp .env.example .env.local
# set TMDB_ACCESS_TOKEN
npx tsx scripts/enrich-tmdb.ts
```

The enrich script writes `tmdbId` and `posterPath` into the JSON so listing pages can build poster URLs without calling TMDB per request.
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
| `GOOGLE_BOOKS_API_KEY` | Books (optional for low volume) |

Never expose these tokens to the client.
