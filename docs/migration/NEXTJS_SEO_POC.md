# Next.js SEO PoC / Migration Plan (2026-10-09)

## Evidence / why this exists

Google Search Console screenshots provided by the site owner:
- 498 indexed URLs, 177 non-indexed (Oct 4, 2026 snapshot);
- 116 impressions, zero clicks, average position 22.8 over 28 days;
- 51 impressions, zero clicks, average position 20.8 over 7 days;
- 1 click / 396 impressions over 3 months.

An indexed legacy page `/resume/customer-service-los-angeles` returned HTTP 200 with page-specific HTML and self-canonical on live inspection. Its *rendered* HTML included duplicate conflicting `hreflang` groups (home URLs and page equivalents), and editorial copy was insufficiently specific to the Customer Service profession. The HTML in the conversation is evidence, but it is not a bulk crawl.

The current `scripts/seo-routes.mjs` is intentionally smaller than the historical job×city matrix: 20 professions + 15 cities, translated into six locales, plus core and Europass pages. Legacy URLs may remain indexed even though no longer in the advertised sitemap. This is not by itself an error.

## Scope decision

**Now:** isolated Next.js App Router SEO proof of concept.
**Later:** editor/ATS/PDF-DOCX migration after equivalence tests.
**Deferred:** CV backend, persistence, database, OpenRouter/Jev, billing.

Production Vite/Vercel project and public domain must stay untouched.

## Architecture

- Separate PoC at `poc/nextjs-seo`, using an isolated pnpm workspace.
- Root layouts for EN and FR to set document language.
- Three routes only: `/`, `/resume/teacher`, `/fr/resume/teacher`.
- Server-rendered page content and server-defined metadata.
- Reuse existing deterministic localized SEO data (no invented SEO copy).
- One controlled metadata source: canonical + alternates; no DOM-mutating useSEO hook.
- Static whitelist (`generateStaticParams` + `dynamicParams = false`).
- Preview `noindex` and `robots` disallow all indexing.
- No production redirects/404 policy changes yet.

## Migration gates

1. **PoC gate:** install, typecheck, build and HTML snapshot checks.
2. **Parity gate:** editor, PDF, DOCX, localStorage data retention, ATS, tracking, accessibility.
3. **SEO gate:** classify all valuable and legacy URLs Keep / Redirect / Remove, based on GSC and equivalence. Never blanket-redirect old SEO pages to homepage.
4. **Cutover gate:** same production domain/URL architecture, 301 only for true equivalents, no conflicting hreflang, sitemap only indexable pages, rollback plan on Vercel.
5. **Observation gate:** track query/page-level impressions, ranking, clicks, indexing and crawl errors weekly; do not promise rankings from framework change.

## PoC gate results (2026-10-09)

Environment: Node 22.22, pnpm 10.26.1, Next.js 16.4.0 (pinned), React 19.1.0. `pnpm audit`: no known vulnerabilities.

| Check | Result |
| --- | --- |
| `pnpm install --frozen-lockfile` (nested lockfile, `minimumReleaseAge: 1440` kept) | pass |
| `pnpm typecheck` | pass (after `react` type path fix, see PoC README) |
| `pnpm build` | pass; `/`, `/resume/teacher`, `/fr/resume/teacher` prerendered as static HTML |
| `pnpm test` (28 SEO regression tests against `next start`) | 28/28 pass |
| Legacy `/resume/customer-service-los-angeles` (EN + FR) inside PoC | 404 + `noindex` |
| `robots.txt` / `sitemap.xml` | `Disallow: /`; 3 URLs, reciprocal alternates |
| Root workspace: typecheck, lint, test, `@workspace/cv-builder` build | pass (lint: 0 errors, 5 pre-existing warnings; 202/202 tests; 231 pages prerendered) |

Raw HTML parity with the current Vite prerender for `/resume/teacher` and `/fr/resume/teacher`: identical `<html lang>`, title, canonical and JSON-LD graph types (WebPage, BreadcrumbList, FAQPage, WebApplication). Intentional differences: PoC is `noindex, nofollow` (production `index, follow`) and advertises only `en`/`fr`/`x-default` alternates (production: 6 languages + `x-default`).

## Known repo risk outside PoC

Existing `src/lib/related-links.ts` can link to job×city combinations absent from the current sitemap/prerender route list. Audit/repair separately, with tests. French metadata uses untranslated profession labels in some pages. These are content/SEO tasks, not solved by Next.js automatically.

## Definition of Done

- Working independent preview of three routes with validated raw HTML.
- No live-site regression.
- Reviewed migration inventory and acceptance tests.
- Explicit go/no-go on full migration; **not automatic** after PoC.
