# Domain Model

_Describes the concepts the system actually implements today, not an aspirational model._

## 1. Core domains

### 1.1 CV Document (the primary entity)
Defined in `artifacts/cv-builder/src/types/cv.ts`. A single aggregate, `CVData`:

```
CVData
├─ personal: PersonalInfo        (name, contact, photo, job title, ...)
├─ summary: string
├─ experience: WorkExperience[]
├─ education: Education[]
├─ skills: Skill[]
├─ languages: Language[]
└─ projects: Project[]
```

Lifecycle: created with `DEFAULT_CV_DATA`, mutated in-memory via `useCV()`'s setter functions,
debounce-persisted to a single `localStorage` key (`cv-builder-data`). There is **no concept of
multiple saved CVs, versions, or a server-side identity** — one browser profile holds exactly
one CV. `template` (`TemplateType`: minimal / modern / creative) is a sibling piece of state,
persisted separately (`cv-builder-template`), that changes only how `CVData` is *rendered*, not
its content.

This is the whole domain's root; every other domain (export, ATS) is a **read-only projection**
of `CVData` — none of them mutate it or add new persisted state of their own.

### 1.2 Export (PDF / DOCX) — a projection, not a domain of its own
Takes `CVData` (+ locale) and produces a document. Two independent renderers exist
(`print-pdf.ts`, `docx.ts`) which **each reimplement their own text layout from `CVData`**,
deliberately ignoring `TemplateType` in favor of a single parser-friendly layout. There is no
shared "CV document model" intermediate representation between the three renderers (screen
preview via `templates/*.tsx`, print/PDF, DOCX) — each is a separate, hand-written mapping from
`CVData` straight to its output format. This triplication is a structural fact worth naming even
though (per `TECH_DEBT.md`) it isn't necessarily worth fixing yet.

### 1.3 ATS Match — an ephemeral, stateless domain
Inputs: `CVData` + a pasted job-ad string + current locale. Output: a `MatchResult` (score
0–100, per-keyword hits/misses, structural-check results). **Nothing here is persisted** — the
job ad text lives only in component state (`AtsChecker.tsx`) and is discarded on refresh. This
is a pure function domain (`analyseMatch()` in `ats-match.ts`) with no side effects, which is why
it is the best-tested part of the codebase.

### 1.4 Programmatic SEO content — a separate content domain, not CV-related
`skill × city` (20 × 15 = 300, plus 20 skill-only + 15 city-only = 335 slugs) generates landing
pages via `buildLocalizedSeoPageData()`. This domain has its own locale concept
(`market-copy/*.ts`'s `LangCode`) that is structurally identical to, but code-independent from,
the UI's `SupportedLang` (i18next). It does not reference `CVData` at all — it's marketing
content, not a projection of the user's CV.

### 1.5 Locale / Language — a cross-cutting concern, not a bounded domain
Two independent representations of "which of the 6 supported languages" exist:
`i18n.ts`'s `SupportedLang` (drives UI strings + `useLanguage.ts`) and
`market-copy/index.ts`'s `LangCode` (drives SEO copy generation). Both enumerate the same six
codes (`en, fr, es, ar, tr, pt`) independently.

## 2. Domains declared but not yet real

- **User / Account**: does not exist. No auth, no user identity, no multi-device concept.
- **Persisted API resource for a CV**: `lib/db`'s schema is empty (`export {}`) — there is no
  `cv` table, no server-side representation of `CVData` at all today.
- **Health**: the only concept `lib/api-spec`/`lib/api-zod`/`lib/api-client-react` currently
  model is `HealthStatus { status: string }` — infrastructure self-check, not a product domain.

## 3. Domain boundaries (bounded-context view)

```
┌─────────────────────────────────────────────────────────┐
│  artifacts/cv-builder  (the only bounded context that    │
│  currently matters)                                       │
│                                                             │
│   CV Document (root) ──┬──> Screen preview (templates/*)  │
│                         ├──> PDF export (print-pdf.ts)     │
│                         ├──> DOCX export (docx.ts)         │
│                         └──> ATS Match (ats-match.ts)      │
│                                                             │
│   Locale/i18n (cross-cutting)                              │
│   Programmatic SEO content (independent, no CVData link)   │
└─────────────────────────────────────────────────────────┘

┌───────────────────────┐   ┌─────────────────────────────┐
│ artifacts/api-server   │   │ lib/api-spec, api-zod,       │
│ Health domain only     │   │ api-client-react, db          │
│ (not in prod)          │   │ Health domain only, no CV     │
│                         │   │ resource modeled yet          │
└───────────────────────┘   └─────────────────────────────┘
```

There is currently **no bounded-context relationship** between `cv-builder`'s CV Document domain
and anything in `lib/db`/`api-server` — they don't share a schema, a type, or a runtime call.
If a "cloud save" feature is ever built, that is the seam where a real boundary needs to be
designed (see `TARGET_ARCHITECTURE.md`).

## 4. Invariants worth stating explicitly (mostly implicit today)

- A `CVData` object is always complete (all 7 top-level keys present) — enforced only by
  `DEFAULT_CV_DATA` as the initial value and TypeScript's structural typing; there is no runtime
  schema validation (no zod) on data read back from `localStorage`, so a hand-edited or
  corrupted `localStorage` value could crash the app on load.
- The `slug` space for SEO pages (`skill-city`) must stay in bijection across three independent
  lists (`App.tsx` routes, `seo-routes.mjs`, `prerender.tsx`'s per-kind renderers) — currently an
  implicit, partially-tested invariant (see `TECH_DEBT.md`).
- Export renderers (`print-pdf.ts`, `docx.ts`) must stay content-equivalent to each other and to
  the on-screen templates even though they're three separate implementations — no automated
  check enforces this beyond manual QA and unit tests on each renderer in isolation.
