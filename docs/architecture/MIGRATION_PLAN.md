# Migration Plan

Sequenced to evolve `CURRENT_ARCHITECTURE.md` toward `TARGET_ARCHITECTURE.md` with each phase
independently shippable, low-risk, and reversible. No phase requires the phases after it — the
plan can stop after any phase and the system is left in a strictly better state than before it.
**No implementation happens as part of producing this document** — this is the plan only.

## Phase 0 — Safety net (do this before anything else)

| Step | Change | Risk | Reverts `TECH_DEBT.md` item |
|---|---|---|---|
| 0.1 | Add `.github/workflows/ci.yml`: install, typecheck, lint, test on PR/push | None (additive) | M1 |
| 0.2 | Add the route-manifest parity test (App.tsx routes vs. `seo-routes.mjs`) — even before unifying the source, just assert they currently agree | None (test-only) | M3 (detection) |
| 0.3 | Add locale-key-parity test across the 6 `translation.json` files | None (test-only) | T3 |
| 0.4 | Add a prerender output smoke test (`assembleHtml`/`stripGenericSeoTags` against a fixture) | None (test-only) | T2 |

**Exit criteria**: CI is green on `main`, and the three new tests currently pass (documenting
today's actual — currently correct — state, so future drift is caught immediately).

## Phase 1 — Low-risk cleanup (independent, parallelizable, no behavior change)

| Step | Change | Risk |
|---|---|---|
| 1.1 | Remove unused `@workspace/db`/`cookie-parser` deps from `artifacts/api-server/package.json` (P2) | None |
| 1.2 | Delete vestigial `components.json` and `scripts/src/hello.ts` if still unreferenced (M8) | None |
| 1.3 | Collapse duplicate `document.dir`/`lang` effect (keep `useLanguage.ts`'s, remove `App.tsx`'s) (M7) | Low — verify RTL still applies on direct-load of `/ar` route |
| 1.4 | Have `market-copy/index.ts` import `SupportedLang` from `i18n.ts` instead of redeclaring `LangCode` (M6) | None (type-only) |
| 1.5 | Explicit CORS origin allowlist on `api-server` (SEC1), header allowlist validation for sitemap/robots (SEC2) | None |
| 1.6 | Defensive try/catch around `localStorage` CVData parse, fallback to `DEFAULT_CV_DATA` (SEC3) | None |
| 1.7 | One-line "Replit-only, not in Vercel production" comment in `api-server/src/app.ts` + matching note in `replit.md` (B1, M5) | None (docs) |
| 1.8 | Doc-only fix: remove or caveat the false "react-query (via api-client-react)" claim in `replit.md` (M5) | None |

Each of 1.1–1.8 can land as its own small PR, in any order, reviewed against the CI gate from
Phase 0.

## Phase 2 — Performance & SEO correctness

| Step | Change | Risk | Validation |
|---|---|---|---|
| 2.1 | Guard `:lang` route param against `SUPPORTED_LANGUAGES`; fall back to the existing catch-all redirect for unrecognized values (PF2) | Low | Manual check: `/xx` now redirects instead of rendering; `/fr`, `/ar` etc. still work |
| 2.2 | Lazy-load per-locale translation bundles via dynamic `import()` (PF1) | Medium — must confirm SSR/prerender path (which runs in Node via `tsx`, not a browser) still resolves the dynamic imports correctly | Run `pnpm --filter cv-builder build` and diff prerendered output byte-for-byte against pre-change output for a sample of routes across all 6 locales |

Phase 2.2 is flagged medium-risk specifically because `scripts/prerender.tsx` reuses the same
`i18n` instance used at runtime — confirm the lazy-loading mechanism works identically under
`tsx`/Node during prerender and in the browser bundle before merging. Recommended validation:
build locally, diff `dist/public/fr/index.html` (and one non-English SEO landing page) against
the current committed prerender output for content equality, and manually confirm bundle-size
reduction in the build output.

## Phase 3 — Route-source unification

| Step | Change | Risk |
|---|---|---|
| 3.1 | Introduce `scripts/route-manifest.ts` (or `.mjs`) as the single source `App.tsx`, `seo-routes.mjs`, and `prerender.tsx` all derive from | Medium — touches three files simultaneously |
| 3.2 | Update the Phase 0.2 parity test to assert against the unified source directly rather than comparing two independent lists | Low |

**Rollback plan**: this phase changes only route *declaration*, not route *behavior* — if
something breaks, `App.tsx`'s `<Routes>` JSX can be reverted independently of the manifest file
since React Router doesn't require the manifest to function (worst case, revert 3.1 and keep the
Phase 0.2 detection test running against the old 3-way structure).

## Phase 4 — `FormPanel` decomposition

Do this section-by-section, not as one PR. Suggested order (lowest to highest coupling risk,
based on how many other components read that section's data):

1. `LanguagesSection` (simplest data shape)
2. `ProjectsSection`
3. `SkillsSection`
4. `EducationSection`
5. `SummarySection`
6. `ExperienceSection` (most complex — date handling, ordering)
7. `PersonalSection` (touches photo upload, most cross-cutting)

For each: extract the section's JSX + its slice of the 20-field prop interface into its own
component, add a test for it, confirm `FormPanel` still renders identically (visual/manual check
+ existing `useCV.test.ts` still passes unchanged since `useCV`'s public shape doesn't move).
**Each extraction is its own PR** so a regression is trivially bisectable.

**Exit criteria**: `FormPanel.tsx` is under ~100 lines (pure composition), each extracted section
has at least one test, no import of `useCV` outside `CVBuilderPage.tsx` changes.

## Phase 5 — Codegen sync enforcement

| Step | Change | Risk |
|---|---|---|
| 5.1 | Add a CI step: run `pnpm --filter api-spec run codegen`, fail if `git diff` is non-empty (M4) | None — currently a no-op since generated files should already match `openapi.yaml` |

This is deliberately sequenced late: it's cheap and low-risk, but there's no urgency while
`lib/api-client-react` has zero consumers. Pull it earlier if Phase 6 (below) is greenlit sooner.

## Phase 6 — Conditional: "cloud save" backend (only if the product decision in
`TARGET_ARCHITECTURE.md` §3 is Option A)

This phase is **gated on an explicit product decision**, not a default continuation of the
architecture work above. If greenlit:

1. Design the `cvs` table schema in `lib/db/src/schema/index.ts` (+ auth/account model — a
   prerequisite not currently designed anywhere in this repo, likely its own RFC).
2. Add `GET/PUT /api/cvs/:id` to `lib/api-spec/openapi.yaml`; regenerate `api-zod`/`api-client-react`.
3. Implement the routes in `artifacts/api-server` against `lib/db` (first real usage of a
   currently-unused dependency pair).
4. Update `vercel.json` to build and deploy `api-server` (as a Vercel Function or a second
   Vercel project) alongside `cv-builder`; decide the production API base URL and CORS policy
   accordingly (tightening SEC1's allowlist to the real frontend origin).
5. Add an **opt-in** `useCVSync()` wrapper around `useCV()` in `cv-builder` — `localStorage`
   remains the default path; server sync is an explicit user action. This is the point where
   `api-client-react`'s `custom-fetch.ts` gets its first real caller.
6. Add integration tests covering the new routes (closes the "api-server has zero tests"
   gap from `TECH_DEBT.md`, naturally, as part of building real functionality rather than as a
   speculative test-writing exercise).

If the product decision is Option B (park it), Phase 6 is replaced by the one-line documentation
notes described in `TECH_DEBT.md` P1 and `TARGET_ARCHITECTURE.md` §3 Option B — effectively a
zero-code "phase."

## Sequencing summary

```
Phase 0 (safety net)  →  must land first, everything else depends on its CI gate
Phase 1 (cleanup)     →  parallel, any order, any time after Phase 0
Phase 2 (perf/SEO)    →  after Phase 0; 2.1 and 2.2 independent of each other
Phase 3 (route unify) →  after Phase 0.2's detection test exists
Phase 4 (FormPanel)   →  independent of Phases 2/3; can run in parallel with them
Phase 5 (codegen CI)  →  low priority, land whenever convenient
Phase 6 (backend)     →  gated on a product decision; not scheduled by this plan
```
