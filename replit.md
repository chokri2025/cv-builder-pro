# CV Builder Pro

A full-featured, multilingual CV/Resume Builder web application built with React + Vite in a pnpm monorepo. Supports 6 languages with RTL, localized SEO landing pages, and programmatic page generation.

## Project Structure

```
artifacts/
  cv-builder/         - Main React + Vite SPA (previewPath: /)
  api-server/         - Express API server (sitemap.xml, robots.txt)
  mockup-sandbox/     - Vite component preview server for canvas mockups
lib/
  api-spec/           - OpenAPI spec
  api-client-react/   - Generated React Query hooks
  api-zod/            - Generated Zod schemas
  db/                 - Drizzle ORM + PostgreSQL schema
```

## CV Builder Features

- **All CV sections**: Personal info (with photo upload), Professional Summary, Work Experience, Education, Skills (tag input), Languages, Projects
- **Live preview**: Edits reflect instantly in the CV preview panel
- **3 Templates**:
  - **Minimal**: Clean horizontal layout, border-bottom dividers
  - **Modern**: Dark sidebar with main content area (two-column)
  - **Creative**: Gradient header with two-column body
- **PDF Download**: Uses html2pdf.js with A4 format
- **Print**: Opens print window with full CV styles inlined
- **Auto-save**: localStorage persistence (`cv-builder-data`, `cv-builder-template` keys)
- **Save button**: Manual save with `✓ Saved` confirmation feedback

## Internationalization (i18n)

- **Library**: react-i18next + i18next-browser-languagedetector
- **Languages**: English (en), French (fr), Spanish (es), Arabic (ar), Turkish (tr), Portuguese (pt)
- **Language switcher**: Flag+code dropdown in the form panel header
- **Auto-detection**: Browser language → localStorage → fallback to English
- **Persistence**: Stored in localStorage key `cv-builder-lang`
- **RTL support**: Arabic uses `document.dir = 'rtl'` + CSS mirroring rules
- **CV output localization**: All section titles, month names, "Present" label translated in templates
- **Translation files**: `src/locales/{lang}/translation.json`
- **i18n config**: `src/i18n.ts`

## SEO System

- **useSEO hook**: Manages title, meta description, og tags, canonical, hreflang, JSON-LD
- **Hreflang tags**: Auto-generated for all 6 languages + x-default on SEO landing pages
- **Structured data**: JSON-LD WebPage + BreadcrumbList schema on landing pages
- **Sitemap**: `/sitemap.xml` served by API server; `/sitemap` HTML visual page

## Programmatic SEO Pages (pSEO)

- **Route pattern**: `/resume/:slug` (English) and `/:lang/resume/:slug` (localized)
- **Examples**: `/en/resume/nurse-london`, `/fr/resume/nurse-paris`, `/es/resume/ingeniero-madrid`
- **20 skills × 15 cities** = 300+ unique landing pages per language
- **Each page has**: Unique H1, localized intro, skill-specific tips, FAQ, internal links, CTA
- **Localized content functions**: `buildLocalizedSeoPageData()` in `src/data/localized-seo-data.ts`

## Routing

```
/                         - CV Builder (main app)
/resume/:slug             - English SEO landing page
/sitemap                  - HTML sitemap
/:lang                    - CV Builder (language-prefixed, e.g. /fr, /es)
/:lang/resume/:slug       - Localized SEO landing page
/:lang/sitemap            - Localized sitemap
```

## Design System

- **Builder UI**: Dark mechanical blue (#0b1d2e, #0f2540, #06111e) + sky blue accents (#38bdf8, #0ea5e9)
- **CV Output**: White/light professional backgrounds, suitable for printing
- **Fonts**: Inter (body), Merriweather (available for serif templates)
- **RTL**: CSS `[dir="rtl"]` selectors handle layout mirroring for Arabic

## Key Files

```
artifacts/cv-builder/src/
  App.tsx                           - Root component + i18n-aware routing
  main.tsx                          - Entry point (imports i18n.ts)
  i18n.ts                           - i18next configuration + SUPPORTED_LANGUAGES
  index.css                         - Global styles + template CSS + RTL + language switcher
  locales/                          - Translation JSON files
    en/translation.json             - English
    fr/translation.json             - French
    es/translation.json             - Spanish
    ar/translation.json             - Arabic
    tr/translation.json             - Turkish
    pt/translation.json             - Portuguese
  types/cv.ts                       - TypeScript types (CVData, TemplateType, etc.)
  hooks/
    useCV.ts                        - CV state + localStorage persistence hook
    useLanguage.ts                  - Language switching + RTL effect hook
    useSEO.ts                       - SEO meta tags + hreflang + JSON-LD hook
  pages/
    CVBuilderPage.tsx               - Main layout (form left, preview right)
    LandingPage.tsx                 - Localized SEO landing page
    SitemapPage.tsx                 - HTML sitemap
  components/
    FormPanel.tsx                   - Left panel: all form sections (fully translated)
    CVPreview.tsx                   - Right panel: template switcher + PDF/print (translated)
    LanguageSwitcher.tsx            - Flag+name dropdown language switcher
    templates/
      MinimalTemplate.tsx           - Minimal clean template (localized section titles + dates)
      ModernTemplate.tsx            - Modern sidebar template (localized)
      CreativeTemplate.tsx          - Creative gradient template (localized)
  data/
    seo-data.ts                     - SEO skills, cities, English page builder
    localized-seo-data.ts           - Multi-language SEO page builders (fr, es, ar, tr, pt)
```

## Dependencies

- `react`, `react-dom`, `typescript`, `vite`
- `html2pdf.js` - PDF generation from HTML
- `react-router-dom` - Routing
- `i18next`, `react-i18next`, `i18next-browser-languagedetector` - i18n
- `react-query` (via api-client-react) - API hooks
- No auth required — purely client-side with localStorage

## Ports

- CV Builder: 22723 (dev), served at path `/`
- API Server: 8080, served at path `/api`
- Mockup Sandbox: 8081, served at path `/__mockup`
