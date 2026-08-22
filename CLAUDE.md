# CLAUDE.md

Guidance for AI assistants working in this repository.

## What this is

**CV Builder Pro** — a free, client-side CV/resume builder. React + Vite SPA, no
authentication, no backend persistence: all user data lives in `localStorage`.
Supports 6 languages (including RTL Arabic) and ships ~2,010 prerendered
programmatic-SEO landing pages.

The repo is a **pnpm workspace** scaffolded from a Replit template. Only one
workspace package is actually the product; the rest is unused scaffolding (see
below). Deployment targets are Vercel (`vercel.json`) and Replit (`.replit`).

## Repository layout

```
artifacts/
  cv-builder/       ← THE APP. Nearly all work happens here.
  api-server/       ← Express server (sitemap.xml, robots.txt, /api/healthz). Scaffolding.
  mockup-sandbox/   ← Vite + shadcn/ui component preview sandbox. Scaffolding.
lib/
  api-spec/         ← OpenAPI spec + orval codegen config. Scaffolding.
  api-client-react/ ← Generated React Query hooks. Scaffolding.
  api-zod/          ← Generated Zod schemas. Scaffolding.
  db/               ← Drizzle ORM + Postgres schema (schema is empty). Scaffolding.
scripts/            ← Workspace scripts package (hello-world placeholder).
```

### The scaffolding is genuinely unused

`artifacts/cv-builder` does **not** import `@workspace/db`, `@workspace/api-zod`,
or `@workspace/api-client-react`. The deployed Vercel build only builds
`@workspace/cv-builder` and serves it as a static SPA — the Express API server is
not part of that deployment. `.prettierignore` explicitly lists these packages as
"unused/experimental workspace scaffolding, intentionally left untouched".

**Do not** add features to the API server, database, or mockup sandbox unless
explicitly asked. Do not "wire up" the scaffolding on your own initiative.

## Commands

Run from the repo root. **pnpm only** — a `preinstall` hook deletes
`package-lock.json`/`yarn.lock` and hard-fails if you use npm or yarn.

| Command                                         | What it does                                                   |
| ----------------------------------------------- | -------------------------------------------------------------- |
| `pnpm install`                                  | Install workspace deps (`--frozen-lockfile` in CI/post-merge)  |
| `pnpm typecheck`                                | `tsc --build` for libs, then `--noEmit` per artifact + scripts |
| `pnpm test`                                     | Vitest across the workspace (only cv-builder has tests)        |
| `pnpm lint`                                     | ESLint (only cv-builder has a lint script)                     |
| `pnpm format` / `pnpm format:check`             | Prettier write / check                                         |
| `pnpm build`                                    | `typecheck` then recursive build                               |
| `pnpm --filter @workspace/cv-builder run dev`   | Dev server on `PORT` (default 5173; Replit sets 22723)         |
| `pnpm --filter @workspace/cv-builder run build` | vite build → generate sitemap → prerender                      |

### Baseline state (verified)

- `pnpm typecheck` — clean.
- `pnpm test` — 3 files, 8 tests, all passing.
- `pnpm lint` — **0 errors, 5 pre-existing warnings** (`react-hooks/exhaustive-deps`
  in `useSEO.ts` and `CVBuilderPage.tsx`). These are known; don't treat them as
  regressions you introduced, and don't "fix" them by adding deps to those arrays
  without checking the effects still behave (the SEO effect intentionally reruns
  narrowly).
- `pnpm format:check` — **currently fails** on 4 pre-existing files
  (`CVBuilderPage.tsx`, `pnpm-workspace.yaml`, `scripts/src/hello.ts`,
  `vercel.json`). Don't run a blanket `pnpm format`, which would sweep unrelated
  files into your diff. Format only what you touched.

Before pushing: run `pnpm typecheck`, `pnpm test`, and `pnpm lint` at minimum.

## The build pipeline (important)

`artifacts/cv-builder`'s `build` script is three sequential steps:

```
vite build  →  node scripts/generate-sitemap.mjs  →  tsx scripts/prerender.tsx
```

1. **`vite build`** — outputs to `dist/public`. Routes are code-split via
   `React.lazy`; `html2pdf.js` is dynamically imported so it stays out of the
   main chunk.
2. **`generate-sitemap.mjs`** — writes `sitemap.xml` + `robots.txt` to **both**
   `public/` and `dist/public/`. It emits ~2,024 URLs.
3. **`prerender.tsx`** — the SPA is client-rendered, so `useSEO`'s `useEffect`
   tags are invisible to crawlers. This step renders each landing route to real
   static HTML at `dist/public/resume/<slug>/index.html` (and
   `dist/public/<lang>/resume/<slug>/index.html`), injecting the per-route head
   tags and stripping the shell's generic ones. Writes 2,010 files.

**Gotcha:** the build mutates the tracked file `artifacts/cv-builder/public/sitemap.xml`
(its `<lastmod>` becomes today's date). After running a build locally, expect a
dirty working tree. Revert it unless the date change is intentional:
`git checkout -- artifacts/cv-builder/public/sitemap.xml`.

## Key conventions

### The SEO route space is duplicated in three places — keep them in sync

Adding or removing a skill/city slug means editing **all** of these:

1. `artifacts/cv-builder/scripts/seo-routes.mjs` — `SEO_SKILL_SLUGS`, `SEO_CITY_SLUGS`.
   Consumed by the sitemap generator and the prerenderer.
2. `artifacts/cv-builder/src/data/seo-data.ts` — `SEO_SKILLS`, `SEO_CITIES` (the
   runtime versions, with display labels and countries).
3. `artifacts/api-server/src/app.ts` — its own inlined copy of both lists.
   (Scaffolding, but it drifts silently if ignored.)

`scripts/seo-routes.test.ts` guards slug-count and uniqueness, but **nothing
enforces cross-file consistency**. Check all three by hand.

Slug math: 20 skills + (20 × 15 cities) + 15 cities = **335 slugs**;
× 6 languages = **2,010 landing pages**.

### Shared client/build-time SEO logic

Two modules exist specifically so the browser and the prerenderer can never
compute different tags for the same route. Put shared logic here, not in
components:

- `src/lib/landing-seo.ts` → `buildLandingSeoProps()` — canonical, hreflang,
  JSON-LD for a `(page, slug, lang)` input.
- `src/hooks/useSEO.ts` → `buildHeadTags()` — the **pure** head-tag computation.
  `useSEO()` is a thin `useEffect` wrapper around it; `prerender.tsx` calls
  `buildHeadTags` directly and serializes the result.

If you change SEO output, change it in these shared functions — otherwise the
prerendered HTML and the client-rendered DOM diverge.

### i18n

- Config: `src/i18n.ts` — exports `SUPPORTED_LANGUAGES`, `SupportedLang`, `isRTL`.
- Languages: `en`, `fr`, `es`, `ar` (RTL), `tr`, `pt`.
- Translations: `src/locales/<lang>/translation.json`. **Adding a key means adding
  it to all 6 files.**
- Detection order: `localStorage` → `navigator` → `htmlTag`; persisted under
  `cv-builder-lang`.
- RTL: `useLanguage()` sets `document.documentElement.dir/lang` and toggles an
  `rtl`/`ltr` class on `<body>`. CSS mirroring lives under `[dir="rtl"]` selectors
  near the bottom of `index.css`.
- **CV output must be localized too** — section titles, month names, and the
  "Present" label are translated inside the template components, not hardcoded.

Localized landing-page copy is generated by per-language builder functions in
`src/data/localized-seo-data.ts` (`buildEnSeoPageData`, `buildFrSeoPageData`, …),
dispatched through `buildLocalizedSeoPageData(skill, city, lang)`.

### Styling

One hand-written stylesheet: `src/index.css` (~2,000 lines), organized into
`/* ======== SECTION ======== */` blocks (LAYOUT, FORM FIELDS, MINIMAL TEMPLATE,
SEO LANDING PAGES, RTL Support, …). **No Tailwind in cv-builder** — Tailwind and
shadcn/ui exist only in `mockup-sandbox`. Add styles to the matching section
rather than appending to the end of the file.

Two distinct visual systems:

- **Builder chrome**: dark mechanical blue (`#0b1d2e`, `#0f2540`, `#06111e`) with
  sky-blue accents (`#38bdf8`, `#0ea5e9`).
- **CV output**: white/light, print-safe. There's a `@media print` block that
  hides the form panel and toolbar.

Fonts: Inter (body) and Merriweather, loaded from Google Fonts in `index.html`.

### TypeScript / code style

- Prettier: single quotes, semicolons, trailing commas `all`, print width 100.
- Import alias `@/*` → `src/*` (configured in both `vite.config.ts` and
  `vitest.config.ts`); existing code mostly uses relative imports.
- `tsconfig.base.json` is moderately strict: `strictNullChecks`, `noImplicitAny`,
  `noImplicitReturns` on; `noUnusedLocals` and `strictFunctionTypes` off.
- Unused args are allowed when prefixed `_`.

## Architecture of the app

```
src/
  main.tsx              Entry — imports ./i18n and ./index.css
  App.tsx               BrowserRouter + lazy routes + dir/lang effect
  i18n.ts               i18next init, SUPPORTED_LANGUAGES, isRTL
  index.css             All styles
  types/cv.ts           CVData, TemplateType, DEFAULT_CV_DATA
  hooks/
    useCV.ts            CV state + debounced localStorage autosave  (tested)
    useLanguage.ts      Language switching + RTL side effects
    useSEO.ts           buildHeadTags() + useSEO() effect            (tested)
  lib/
    site.ts             SITE_URL from VITE_APP_URL
    landing-seo.ts      buildLandingSeoProps() — shared client/prerender
    image.ts            compressImageFile() — downscale to 400px JPEG q0.8
  pages/
    CVBuilderPage.tsx   Form (left) + live preview (right)
    LandingPage.tsx     pSEO landing page
    SitemapPage.tsx     Human-readable HTML sitemap
  components/
    FormPanel.tsx       All CV form sections
    CVPreview.tsx       Template switcher, PDF download, print
    LanguageSwitcher.tsx
    templates/          MinimalTemplate, ModernTemplate, CreativeTemplate
  data/
    seo-data.ts             Skills, cities, buildSeoPageData, parseSlug, buildSlug
    localized-seo-data.ts   Per-language page-copy builders
```

### Routes

```
/                      CV builder
/resume/:slug          English landing page
/sitemap               HTML sitemap
/:lang                 CV builder, language-prefixed  (/fr, /es, /ar, /tr, /pt)
/:lang/resume/:slug    Localized landing page
/:lang/sitemap         Localized sitemap
*                      → redirect to /
```

Note `/:lang` is an unconstrained param, so any unmatched single segment hits
`CVBuilderPage`; the deeper `*` fallback redirects to `/`.

### State & persistence

`useCV()` owns everything. No Redux, no context, no server. `localStorage` keys:

| Key                   | Contents                              |
| --------------------- | ------------------------------------- |
| `cv-builder-data`     | Serialized `CVData`                   |
| `cv-builder-template` | `'minimal' \| 'modern' \| 'creative'` |
| `cv-builder-lang`     | Active language code                  |

Autosave is debounced 1,500 ms; the Save button flushes immediately and shows a
2-second confirmation. Profile photos are compressed to a ≤400px JPEG data URI
before storage — raw camera images would blow the localStorage quota.

### PDF & print

`CVPreview.tsx` dynamically imports `html2pdf.js` (A4) on demand, and implements
print by opening a new window with the CV styles inlined.

## Testing

Vitest + jsdom + Testing Library. Setup file: `src/setupTests.ts`
(`@testing-library/jest-dom/vitest`). Globals are enabled but existing tests
import `describe`/`it`/`expect` explicitly — follow that.

Existing tests: `src/hooks/useCV.test.ts`, `src/hooks/useSEO.test.tsx`,
`scripts/seo-routes.test.ts`. Note `tsconfig.json` **excludes** `*.test.ts(x)`
from typechecking — a type error in a test won't fail `pnpm typecheck`.

Run a single file: `pnpm --filter @workspace/cv-builder exec vitest run src/hooks/useCV.test.ts`

## Deployment & environment

- **Vercel** (`vercel.json`): builds only `@workspace/cv-builder`, serves
  `artifacts/cv-builder/dist/public`, rewrites `/(.*)` → `/index.html`, with
  immutable caching on `/assets/*`.
  ⚠️ That catch-all rewrite runs **after** static files are matched, so the
  prerendered `/resume/<slug>/index.html` files are still served directly.
- **Replit** (`.replit`): three services — cv-builder on 22723 (`/`), api-server
  on 8080 (`/api`, `/sitemap.xml`, `/robots.txt`), mockup-sandbox on 8081
  (`/__mockup`). `scripts/post-merge.sh` runs `pnpm install --frozen-lockfile`
  and `pnpm --filter db push` after merges.
- **Canonical domain**: `https://www.cvbuilder-pro.online` — the default in
  `src/lib/site.ts`, `generate-sitemap.mjs`, `prerender.tsx`, and hardcoded in
  `index.html`'s meta tags. Overridable via `VITE_APP_URL` / `APP_URL` (Replit's
  `userenv.production` still points at `cvbuilderpromax.replit.app`). Changing
  domains means touching all of these.
- No CI workflows (`.github/` does not exist). Checks are local only.

## Supply-chain policy — do not weaken

`pnpm-workspace.yaml` sets `minimumReleaseAge: 1440` (packages must be ≥1 day old
before install). The file carries an explicit warning that disabling it is
dangerous. **Do not remove or lower it.** If a package must land sooner, add it to
`minimumReleaseAgeExclude` and remove the exclusion once the window passes.

`package.json` also pins `pnpm.overrides` for `path-to-regexp`, `picomatch` —
security patches. Leave them.

## Gotchas checklist

- Use pnpm; npm/yarn are blocked by `preinstall`.
- Adding an SEO slug → update all three slug lists.
- Adding a translation key → update all 6 locale files.
- Changing SEO tag output → change `buildHeadTags` / `buildLandingSeoProps`, not
  the component, or prerendered HTML drifts from client DOM.
- Building dirties `public/sitemap.xml`; revert it.
- `pnpm format:check` and `pnpm lint` are not clean at baseline — 4 files and 5
  warnings respectively. Don't blanket-format.
- Test files aren't typechecked.
- `replit.md` is an older overview of this project; where it disagrees with this
  file, this file was verified against the code more recently.
