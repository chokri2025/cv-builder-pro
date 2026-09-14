# Target Architecture

This is an **evolution** of the current system, not a rewrite. The current architecture (a
client-side, privacy-preserving SPA with build-time SEO prerendering) is fundamentally sound for
what the product is today. Nothing here proposes a new framework, a new state-management
library, or a new backend stack — it proposes closing gaps that already exist inside the chosen
architecture, and making one explicit decision about the currently-unused `lib/api-*`/`lib/db`
infrastructure.

## 1. Explicitly preserve (do not change these)

1. **Client-side-only CV data, by default.** No CV content or job-ad text should be sent to a
   server without an explicit, opt-in action from the user (e.g., a future "save to account"
   button). This is a real, currently-true privacy property and a product differentiator — any
   future backend feature must be additive/opt-in, never a silent default.
2. **Print-based PDF export**, not image rasterization. `print-pdf.ts`'s own code comment
   documents exactly why (selectable text for ATS parsers) — this is a strong, deliberate
   decision already made once and should not be "simplified" back to html2canvas.
3. **Offline, deterministic ATS matching.** No LLM call, no network dependency, instant feedback,
   fully testable. This should remain true even if a backend is added for other features.
4. **The shared route-enumeration pattern.** `seo-routes.mjs` being the single source that both
   the sitemap generator and the prerender script consume is exactly the right pattern — the gap
   (§M3 in `TECH_DEBT.md`) is that `App.tsx` isn't part of that same source yet, not that the
   pattern itself is wrong. Extend it; don't replace it with something else.
5. **The `artifacts/` vs `lib/` workspace boundary**, and the `artifacts/* → lib/*`-only
   dependency direction. This is clean today and should stay clean.
6. **Hand-rolled DOCX/ZIP for the export path**, as a deliberate size/dependency trade-off — see
   `TECH_DEBT.md` P3. Don't replace with a heavy library without a concrete reason.

## 2. Near-term target (no new infrastructure, closes existing gaps)

```
artifacts/cv-builder/
  src/
    hooks/useCV.ts                 (unchanged public shape)
    components/
      FormPanel.tsx                (thin composition shell)
      form-sections/                (NEW — extracted from FormPanel)
        PersonalSection.tsx
        SummarySection.tsx
        ExperienceSection.tsx
        EducationSection.tsx
        SkillsSection.tsx
        LanguagesSection.tsx
        ProjectsSection.tsx
    i18n.ts                        (lazy-loaded per-locale bundles)
    data/market-copy/index.ts      (imports SupportedLang from i18n.ts, no 2nd union)
  scripts/
    route-manifest.ts              (NEW — single source consumed by App.tsx, seo-routes.mjs,
                                     and prerender.tsx; replaces the current 3-way duplication)
.github/workflows/ci.yml           (NEW — lint + typecheck + test on every PR)
```

Key moves, each independently shippable and each mapping to a specific `TECH_DEBT.md` item:

- **CI first** (M1). Everything else benefits from a safety net before it starts.
- **Decompose `FormPanel`** (M2) into per-section components, incrementally, with tests added per
  section as it's extracted (T1). `useCV`'s public interface does not need to change — this is a
  presentation-layer refactor, not a state-management rewrite. A lightweight `CVSectionProps<T>`
  generic can replace the current 20-field flat interface if it reduces duplication, but
  introducing Context/Redux/Zustand is **not warranted** at this app's scale (one page consumes
  the state; prop-passing through 2 levels is not the problem — one 573-line component is).
- **Unify route declaration** (M3): a small `route-manifest.ts` that both `App.tsx`'s
  `<Routes>` and `seo-routes.mjs` derive from, with a test asserting the two stay in sync. This
  is the same pattern already used between the sitemap and prerender lists — extending it to
  cover the third (and last) place routes are declared.
- **Lazy-load locale bundles** (PF1) and **guard the `:lang` route segment** (PF2) — both small,
  self-contained changes to `i18n.ts` and `App.tsx` respectively.
- **Make `api-server`'s production status explicit** (B1): either (a) formally retire it if
  Vercel-only is the permanent deployment plan, moving its `/healthz` concept into a Vercel
  serverless function if health-checking is still needed, or (b) give it a real job (see §3
  below) and update `vercel.json` to actually build/deploy it. Either decision is fine; the
  current silent middle state (present in the repo, absent from production, implied to be live
  by `replit.md`) is what needs to end.

None of this requires touching `lib/db` or `lib/api-*` — they stay exactly as they are, unused,
until the product decision in §3 is made.

## 3. The one real architectural decision this audit surfaces

`lib/api-spec` → `lib/api-zod`/`lib/api-client-react` → (implicitly) `lib/db` represent a
complete, well-built pipeline for a typed client/server API that **nothing in the product
currently needs**. This audit does not recommend building the backend feature that would justify
them (that's a product decision, not an architecture one) — but it recommends the team make the
decision explicit rather than leaving the infrastructure in limbo:

**Option A — Commit to a "cloud save" feature.** If account-based CV sync/backup is on the
near-term roadmap, this is the correct foundation to build it on:
- `lib/db/src/schema/index.ts` gains a `cvs` table (one row per saved CV, keyed by a user/account
  id — auth design is out of scope for this doc but would be the next piece needed).
- `lib/api-spec/openapi.yaml` gains `GET/PUT /api/cvs/:id` endpoints; `orval` regenerates the
  zod schemas and react-query hooks.
- `artifacts/cv-builder` becomes the **first real consumer** of `lib/api-client-react` — a
  `useCVSync()` hook that wraps the existing `useCV()` hook, calling the generated mutation only
  when the user opts in (e.g., clicks "Save to account"), with `localStorage` remaining the
  default/offline store. This preserves invariant #1 in §1.
- `artifacts/api-server` becomes the real backend for these routes, and `vercel.json` is updated
  to deploy it (as a Vercel serverless function or a separate Vercel project) alongside
  `cv-builder`.

**Option B — Park it explicitly.** If no backend feature is planned in the near term, leave the
packages in place (they're cheap to keep and well-built) but add the one-line "why this exists,
unwired for now" notes proposed in `TECH_DEBT.md` P1, and stop referencing `api-client-react` in
`replit.md` as if it were already integrated (M5).

Either is a legitimate target state. What's not legitimate is the current third state — spec,
generated client, and DB scaffold all present, half-documented as active, actually unused — which
is what makes every new contributor re-ask "is this dead code?"

## 4. Target CI/quality gate

```
on: [pull_request, push to main]
  1. pnpm install --frozen-lockfile
  2. pnpm typecheck          (already covers both tsc --build for lib/* and per-package tsc --noEmit)
  3. pnpm lint
  4. pnpm test
  5. (once M4 lands) pnpm --filter api-spec run codegen && git diff --exit-code
  6. artifacts/cv-builder build (vite build && generate-sitemap && prerender) — catches
     prerender/route drift (M3's test) as part of the same gate
```

This is a direct translation of scripts that already exist in the repo (`package.json`'s root
`typecheck`/`lint`/`test` scripts, `cv-builder`'s `build` script) into an automated gate — no new
tooling is introduced, only automation of what a developer would already run by hand.

## 5. What this target explicitly does NOT include

- No migration off React/Vite/react-router.
- No introduction of Redux/Zustand/MobX/Recoil — `useCV()` + prop-passing is adequate at this
  app's size once `FormPanel` is decomposed.
- No server-side rendering (SSR) framework (Next.js/Remix) — the existing build-time prerender
  approach already solves the crawler-visibility problem the SEO pages need solved, without the
  operational cost of a Node SSR server. Revisit only if the product adds content that must be
  personalized-and-crawlable simultaneously (not true of anything in the current domain model).
- No mandatory backend/auth — building it is conditional on the product decision in §3, not a
  foregone conclusion of this audit.
