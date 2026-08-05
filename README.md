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
