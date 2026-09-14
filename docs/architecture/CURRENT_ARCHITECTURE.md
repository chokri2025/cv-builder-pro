# Current Architecture

_Audit date: 2026-09-14. Scope: `chokri2025/cv-builder-pro` at commit `32633e1`._

## 1. What this system actually is

Despite the workspace containing a full typed-API pipeline (`lib/api-spec` → `lib/api-zod` /
`lib/api-client-react`) and a database package (`lib/db`), **the shipped product is a
100%-client-side, localStorage-backed single-page app.** There is no network call anywhere in
`artifacts/cv-builder/src` (`grep -rn "fetch(" src` is empty), no auth, and no CV data ever
leaves the browser. `replit.md` says this explicitly: *"No auth required — purely client-side
with localStorage."*

The rest of the workspace (`artifacts/api-server`, `lib/db`, `lib/api-*`) is **forward-looking
infrastructure that the product does not yet consume.** This is the single most important fact
about the codebase and it should be read first before any other finding in this audit.

## 2. Workspace layout

```
pnpm-workspace.yaml → packages: artifacts/*, lib/*, lib/integrations/*, scripts

artifacts/
  cv-builder/     ← THE PRODUCT. React 19 + Vite SPA. Deployed to Vercel.
  api-server/     ← 169-line Express stub. NOT deployed to Vercel. Replit-only.
  mockup-sandbox/ ← Replit's built-in "design canvas" tool. Unrelated to the CV product.
lib/
  api-spec/           ← hand-authored openapi.yaml (1 endpoint: /healthz). Codegen source.
  api-zod/             ← generated (orval) from api-spec. Consumed only by api-server's health route.
  api-client-react/    ← generated (orval) react-query client. Consumed by NOTHING currently.
  db/                  ← Drizzle scaffold. Zero tables defined (`schema/index.ts` is `export {}`).
  integrations/        ← declared in workspace glob, does not exist on disk yet.
scripts/                ← @workspace/scripts; a single placeholder file (src/hello.ts), unused.
```

Dependency direction is clean: `artifacts/* → lib/*`, never the reverse (verified — no `lib/*`
package references any `artifacts/*` path). `artifacts/cv-builder` declares **zero**
`@workspace/*` dependencies in its `package.json`; only `artifacts/api-server` depends on
`@workspace/api-zod` and `@workspace/db` (and the `db` dependency is unused dead weight — grep
finds no `@workspace/db` import anywhere in `api-server/src`).

## 3. Deployment reality (two conflicting targets)

- **`vercel.json`** (production): `buildCommand: pnpm --filter @workspace/cv-builder run build`,
  `outputDirectory: artifacts/cv-builder/dist/public`. Only `cv-builder` is built and deployed.
  SPA rewrite (`/(.*) → /index.html`) plus static `sitemap.xml`/`robots.txt` headers, implying
  Vercel expects the **build-time-generated** sitemap/robots files, not a live server.
- **`.replit`**: declares `artifacts/api-server` and `artifacts/mockup-sandbox` as Replit
  "artifacts" under `deploymentTarget = "autoscale"`, with `userenv.production` pointing
  `VITE_APP_URL`/`APP_URL` at `https://cvbuilderpromax.replit.app` — a **different domain**
  than the Vercel production domain (`www.cvbuilder-pro.online`).

**Net effect: `api-server` is not part of the live production system today.** Its
`/sitemap.xml`, `/robots.txt`, and `/healthz` routes exist only on Replit's infrastructure,
which the `vercel.json` build does not invoke. This is evidence of a Replit → Vercel migration
that is incomplete — see `TECH_DEBT.md` and `MIGRATION_PLAN.md`.

## 4. `artifacts/cv-builder` — the actual application

### 4.1 CV state management
- No Redux/Zustand/Context. A single hook, `src/hooks/useCV.ts` (209 lines), holds `CVData`
  (`src/types/cv.ts:49-57`: `{ personal, summary, experience[], education[], skills[],
  languages[], projects[] }`) in `useState`, called exactly once in
  `src/pages/CVBuilderPage.tsx:19`.
- Persistence: debounced (1500ms) autosave to `localStorage['cv-builder-data']` /
  `['cv-builder-template']` (`useCV.ts:44-54`), guarded by a `canUseStorage` check because the
  same hook runs under `renderToStaticMarkup` during prerendering, where `localStorage` doesn't
  exist.
- `CVBuilderPage.tsx` spreads ~20 individual props from the `useCV()` return value into
  `<FormPanel>` (`CVBuilderPage.tsx:74-97`) and passes `cv.cvData`/`cv.template` straight through
  to `<CVPreview>` and `<AtsChecker>` as well — three sibling consumers wired through one page
  component (see `TECH_DEBT.md` §FormPanel).

### 4.2 Export pipeline — entirely client-side, no server round-trip
- **PDF**: `src/lib/print-pdf.ts` (147 lines). Renders the CV into a hidden same-origin
  `<iframe>`, inlines the app's own `<style>` rules and re-links Google Fonts stylesheets, waits
  on `doc.fonts.ready` (3s timeout), then calls the browser's native `window.print()`. A code
  comment (lines 1-18) documents that this **replaced** an earlier html2canvas/jsPDF approach
  that rasterized the CV to a JPEG — unreadable by ATS parsers. This is a deliberate, well-reasoned
  architectural decision (see `TARGET_ARCHITECTURE.md` §"what not to change").
- **DOCX**: `src/lib/docx.ts` (248 lines) hand-builds raw OOXML and packages it with a
  **hand-rolled ZIP writer**, `src/lib/zip.ts` (119 lines, implements CRC32 + local/central
  directory headers from scratch — "stored", uncompressed entries only). No `docx`/`jszip`
  package is used. Both PDF and DOCX exports intentionally ignore the selected visual template
  and render a single-column, parser-friendly document (`docx.ts:11-14`).
- Trigger: three buttons in `src/components/CVPreview.tsx` (print/PDF, DOCX).

### 4.3 ATS matching — pure client-side keyword algorithm, no LLM
`src/lib/ats-match.ts` (255 lines) + UI in `src/components/AtsChecker.tsx` (120 lines).
Normalizes text (including Arabic letter-form folding), extracts weighted uni/bi-gram keywords
from a pasted job ad (capped at 20, locale-aware stopword lists), matches against CV text with
exact/singular/prefix matching, and scores 0–100. A separate set of 7 structural checks
(email/phone/skills-count/etc.) run independently of any job ad. Computed synchronously via
`useMemo` on every keystroke; no network call, no job-ad text ever leaves the browser.

### 4.4 SEO / prerender pipeline
Three coordinated build-time scripts outside `src/`, deliberately sharing one route
enumeration to prevent drift:
- `scripts/seo-routes.mjs` (193 lines) — single source of truth for the 20-skill × 15-city slug
  matrix (335 slugs) plus sitemap/prerender route lists.
- `scripts/generate-sitemap.mjs` (76 lines) — writes `sitemap.xml`/`robots.txt` with per-URL
  hreflang alternates.
- `scripts/prerender.tsx` (279 lines) — runs after `vite build`; uses
  `renderToStaticMarkup`/`StaticRouter` to render real HTML files (head tags + body) per route
  under `dist/public/<path>/index.html`, reusing the exact same `buildHeadTags()` function
  (`src/hooks/useSEO.ts:42-95`) that the client uses at runtime, so build-time and client-time
  head tags cannot diverge.
- Build script: `vite build && node scripts/generate-sitemap.mjs && tsx scripts/prerender.tsx`
  (three sequential steps, `artifacts/cv-builder/package.json`).
- **Known gap**: the same 8 route shapes are independently re-declared a *third* time in
  `App.tsx`'s JSX `<Routes>`. Only `seo-routes.test.ts` checks agreement between the sitemap
  list and the prerender list — nothing checks agreement against `App.tsx` (see `TECH_DEBT.md`).

### 4.5 Localization
Two parallel systems:
1. **UI strings** — `react-i18next`, 6 locales (`en, fr, es, ar, tr, pt`), all translation JSON
   statically imported up front in `src/i18n.ts` (not lazy-loaded — all 1604 lines ship in the
   initial bundle regardless of the user's language). Detection order:
   localStorage → navigator → htmlTag, persisted to `localStorage['cv-builder-lang']`.
2. **Programmatic SEO copy** — a separate hand-rolled "phrasebook" system,
   `src/data/market-copy/{en,fr,es,ar,tr,pt}.ts` (~240-248 lines each), combined with
   locale-neutral facts in `src/data/job-market-data.ts` (389 lines) to generate deterministic,
   varied copy for the 335 SEO landing pages. This defines its own, second `LangCode` union,
   independent of i18next's `SupportedLang`.

Routing: English is unprefixed (`/`, `/resume/:slug`); the other 5 locales are
path-prefixed (`/:lang`, `/:lang/resume/:slug`). `vercel.json` 301-redirects legacy `/en/*` URLs
to the unprefixed path.

### 4.6 Routing
`react-router-dom` v7, `BrowserRouter`, lazy-loaded route components
(`App.tsx:22-31`): `/`, `/resume/:slug`, `/sitemap`, `/europass-cv`, and their `:lang`-prefixed
equivalents, plus a catch-all redirect to `/`. The `:lang` segment is **not validated** against
`SUPPORTED_LANGUAGES` at the router level — an arbitrary `/xx` renders `CVBuilderPage` in
English silently rather than 404ing or redirecting (validation happens later, inside the page,
`CVBuilderPage.tsx:48`).

## 5. `artifacts/api-server` — a stub, not a backend

169 total lines across 5 files. Endpoints: `GET /api/healthz`, `GET /sitemap.xml`,
`GET /robots.txt`. No CV CRUD, no export, no ATS, no auth. No `middlewares/` directory exists
despite `@workspace/db` and `cookie-parser` being declared as dependencies — both unused. CORS is
enabled with no options (`app.use(cors())`, wide open). No centralized error handler, no rate
limiting, no tests. Not part of the production deployment (§3).

## 6. `lib/*` packages — a typed-API skeleton with no consumer yet

- `lib/api-spec/openapi.yaml`: hand-authored, 36 lines, one endpoint (`/healthz`).
- `lib/api-zod` and `lib/api-client-react`: both generated from that spec via `orval`
  (`lib/api-spec/orval.config.ts`), regenerated only by manually running
  `pnpm --filter api-spec run codegen`. **Generated output is committed to git** (not
  gitignored), and there is no CI or pre-commit hook enforcing it stays in sync with
  `openapi.yaml`.
- `lib/api-client-react/src/custom-fetch.ts` (368 lines, hand-written) is a genuinely
  well-engineered fetch wrapper (error classes, bearer-token injection, Expo/React Native base-URL
  handling) — but it has no caller anywhere in the codebase today.
- `lib/db`: Drizzle + Postgres wiring exists (`src/index.ts`, `drizzle.config.ts`), but
  `src/schema/index.ts` defines **zero tables** — pure scaffold, `export {}`.

## 7. Build, test, and CI reality

- **TypeScript**: root `tsc --build` project references cover only `lib/db`,
  `lib/api-client-react`, `lib/api-zod` (3 composite packages). Every `artifacts/*` package and
  `scripts` are typechecked independently via their own `tsc --noEmit`, not through the
  project-reference graph.
- **Tests**: `vitest` only, configured only in `artifacts/cv-builder`. 9 test files, ~1165
  lines total. Reasonable coverage of `ats-match.ts`, `docx.ts`/`zip.ts`, and SEO copy
  generation; **no tests anywhere else in the monorepo** (`api-server`, `lib/*`, `scripts` all
  have zero test files).
- **CI**: **none exists.** No `.github/workflows`, no other CI config. `pnpm lint` / `typecheck`
  / `test` are local-only scripts; nothing enforces them on push or PR. The only automated hook
  is `.replit`'s `postMerge`, which runs `pnpm install --frozen-lockfile && pnpm --filter db push`
  (dependency install + Drizzle schema push) — not a quality gate.

## 8. Data and privacy posture (current)

No CV content, job-ad text, or personal data is transmitted to any server. `DATABASE_URL` is
confined to `lib/db` (server/build-time only) and never referenced from `cv-builder/src`. No
LLM/API keys, no payment integration, no client-exposed secrets were found anywhere in the
codebase. This is a genuine, currently-true privacy property of the system — see
`TARGET_ARCHITECTURE.md` for how to preserve it if a backend is eventually wired up.
