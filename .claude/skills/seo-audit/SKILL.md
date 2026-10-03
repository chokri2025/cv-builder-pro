---
name: seo-audit
description: >
  Full-spectrum SEO audit, site scan, and optimization skill. Use this skill whenever the user mentions SEO, wants to audit a website, scan a page, optimize content, fix meta tags, check technical SEO, review schema markup, analyze site structure, improve search rankings, or boost AI search visibility (GEO). Trigger this skill for any request involving: "audit my site", "check my SEO", "optimize this page", "fix my meta", "scan this URL", "improve my rankings", "schema markup", "Core Web Vitals", "robots.txt", "sitemap", "keyword optimization", "GEO", "Arabic SEO", "RTL site", "WordPress SEO", "WooCommerce SEO", or any variation. Also trigger when the user pastes HTML, provides a URL, or uploads files and mentions performance, visibility, or search. Always use this skill — do not attempt SEO audits without it.
---

# SEO Audit & Optimization Skill

A comprehensive SEO analysis and optimization workflow covering on-page, technical, content, and structural SEO — with output as a polished Markdown report and auto-fixed assets where possible.

---

## Supported Input Types

Claude should detect and handle these input formats:

| Input | How to handle |
|---|---|
| **Live URL** | Fetch raw HTML — see **Page Acquisition** below |
| **Uploaded HTML file** | Read from `/mnt/user-data/uploads/` |
| **Pasted HTML / content** | Use directly from conversation |
| **Google Search Console / Analytics data** | Parse CSV/JSON exports or pasted tables |

If a URL is provided, always fetch it first before starting the audit.

---

## Page Acquisition

**This audit needs raw, unprocessed HTML.** Most fetch tools return cleaned,
readability-extracted text — which strips the `<head>` entirely and discards
exactly what this skill scores: `<title>`, meta tags, canonical and hreflang
links, Open Graph tags, JSON-LD blocks, `loading`/`width`/`height` attributes,
and raw `href` values. An audit run against extracted text will silently
invent findings. Never do it.

### Preferred: Firecrawl MCP

If Firecrawl MCP tools are available in the session (tool names prefixed
`mcp__firecrawl__`), use them for all URL fetching.

Do not assume exact tool names — check what is actually exposed in the session
and match by capability. Firecrawl surfaces roughly these capabilities:

| Need | Capability to look for | Notes |
|---|---|---|
| Single page HTML | *scrape* | **Must request a raw-HTML output format**, not just markdown |
| Site URL inventory | *map* | Fast URL discovery — feeds Module 4 |
| Multi-page audit | *crawl* | Respect a page limit; see budget below |
| Field extraction across pages | *extract* | Schema-driven; useful for bulk meta-tag pulls |

**Always request raw HTML** from the scrape capability. If the tool offers a
formats option, include the raw-HTML format. Markdown-only output is not
sufficient for Modules 1 and 2 — if raw HTML cannot be obtained, say so in the
report rather than guessing at head-section contents.

### Fallback: WebFetch

If no Firecrawl tools are present, fall back to `WebFetch`, and add this line
to the report's Executive Summary:

> ⚠️ Audited via WebFetch (processed text). Head-section elements — meta tags,
> canonical, hreflang, Open Graph, JSON-LD — could not be verified directly and
> are reported as **Unknown**, not as failures.

Score **Unknown** elements as omitted from the denominator. Do not score them
as missing — a tag that could not be observed is not a tag that is absent.
This is a direct application of the No score inflation rule, in both
directions.

### Crawl budget

A crawl consumes Firecrawl credits per page. Default to a **single page**
unless the user asked for a site-wide audit. When crawling:

- Default limit: **25 pages**. State the limit in the report.
- Ask before exceeding 100 pages.
- Prefer *map* over *crawl* when only the URL inventory is needed (Module 4
  structure checks) — it is far cheaper than fetching every page.

### Supporting fetches

Modules 2 and 4 need files beyond the page itself. Fetch these as plain
documents (they are not HTML, so raw-HTML formatting does not apply):

- `/robots.txt`
- `/sitemap.xml`, and for WordPress `/sitemap_index.xml`
- Any sitemap URLs discovered inside those files

If a supporting file 404s, that is itself a finding — record it and continue.
A missing `robots.txt` or sitemap never aborts the audit.

---

## Audit Workflow

Run all four modules. Each produces a scored section in the final report.

---

### Module 1: On-Page SEO

Check and score each element. Flag issues as 🔴 Critical / 🟡 Warning / 🟢 Pass.

**Elements to audit:**
- `<title>` tag: presence, length (50–60 chars ideal), keyword inclusion, uniqueness
- `<meta name="description">`: presence, length (120–158 chars), CTA, keyword match
- `<meta name="robots">`: correct indexing directives
- Heading hierarchy: H1 (single, keyword-rich), H2–H6 (logical structure, no skips)
- Image `alt` attributes: presence, descriptiveness, keyword relevance
- Open Graph / Twitter Card tags: presence and completeness
- Canonical tag: correct `<link rel="canonical">` pointing to self or correct URL
- Keyword density: primary keyword appears naturally in title, H1, first 100 words
- Internal links: anchor text quality, broken links
- Page language: `<html lang="">` attribute present and correct

**Arabic / RTL check (trigger if lang="ar" or RTL content detected):**
- `dir="rtl"` on `<html>` or `<body>`
- Arabic meta tags / hreflang (`hreflang="ar"`, `hreflang="ar-TN"`, etc.)
- Font rendering and text direction consistency
- Arabic keyword targeting in meta title and description

---

### Module 2: Technical SEO

**Elements to check:**
- `robots.txt`: accessible, not blocking important resources, correct syntax
- XML Sitemap: referenced in robots.txt, valid structure, includes all key pages
- HTTPS: site served over HTTPS, no mixed content
- Canonical issues: self-referencing canonicals, duplicate content signals
- Structured Data / Schema Markup:
  - Detect existing schema (JSON-LD, Microdata)
  - Check for `WebPage`, `Article`, `Product`, `BreadcrumbList`, `FAQPage`, `LocalBusiness`, `Organization`
  - Validate against schema.org requirements
  - Flag missing schema for page type
- Core Web Vitals signals (infer from HTML patterns):
  - LCP: large above-fold images without `loading="eager"` or preload
  - CLS: images/embeds without explicit width/height
  - FID/INP: excessive inline scripts blocking render
- Mobile: `<meta name="viewport">` present and correct
- Hreflang: for multilingual sites, correct language/region tagging
- Page speed signals: render-blocking CSS/JS, image optimization, lazy loading

**WordPress-specific checks (trigger if WordPress detected via meta generator, body classes, `/wp-content/` paths):**
- Yoast / RankMath / SEOPress meta tag conflicts
- Duplicate title tags from theme + plugin
- Unnecessary `?ver=` query strings on assets (cache busting issues)
- Missing XML sitemap at `/sitemap_index.xml` or `/sitemap.xml`
- wp-admin blocked in robots.txt

**WooCommerce-specific checks (trigger if WooCommerce detected):**
- Product schema: `Product`, `Offer`, `AggregateRating`
- Breadcrumb schema on product/category pages
- Canonical on paginated category pages (`?page=2` etc.)
- `noindex` on cart, checkout, account pages
- Product image alt tags

---

### Module 3: Content Optimization & GEO

**Standard content checks:**
- Readability: sentence length, paragraph length, passive voice density, Flesch score estimate
- Keyword gaps: identify 3–5 related keywords/phrases missing from the content
- Content length: flag pages under 300 words (thin content)
- Duplicate content signals: boilerplate overuse, repeated paragraphs
- Structured content: presence of lists, tables, FAQs — content scannable by humans and AI

**GEO (Generative Engine Optimization) checks:**
- Is the content written in a direct, authoritative, question-answering style?
- Does the page include clear definitions of its main topic?
- Are there FAQ sections or structured Q&A blocks that AI models can extract?
- Is the brand/entity clearly identified (name, location, expertise)?
- Is structured data (FAQ, HowTo, Article) present to aid AI parsing?
- Is content formatted to be "snippet-worthy" (short, precise, factual paragraphs)?
- GEO Score: rate 1–10 with improvement suggestions

---

### Module 4: Link & Site Structure

Orphan-page and sitemap-mismatch checks need a site-wide URL inventory, not a
single page. With Firecrawl, get one via the *map* capability (cheap) before
running this module. Without it, run only the single-page checks and mark the
site-wide ones **Not assessed — single-page audit**; do not extrapolate site
structure from one page.

- Internal linking: pages with 0 internal links pointing to them (orphan pages)
- Anchor text diversity: over-optimized exact-match anchors flagged
- Broken links: check `href` values for obvious issues (empty, `#`, `javascript:void`)
- Sitemap vs. crawlable links: mismatch signals
- URL structure: clean, hyphenated, keyword-containing slugs; avoid query strings in URLs
- Pagination: `rel="next"` / `rel="prev"` or correct canonical on paginated pages
- Redirect chains: flag multiple redirects (if detectable from fetched headers)

---

## Auto-Fix Output

After the audit, generate corrected versions of fixable elements. Include in the report as ready-to-use code blocks:

- ✅ Rewritten `<title>` tag
- ✅ Rewritten `<meta name="description">`
- ✅ Fixed / added `<link rel="canonical">`
- ✅ Corrected heading hierarchy (rewritten H1–H3 as needed)
- ✅ New or corrected JSON-LD schema block (appropriate to page type)
- ✅ Fixed Open Graph / Twitter Card tags
- ✅ Corrected `hreflang` tags (if multilingual)
- ✅ Image alt text suggestions (list all images with missing/weak alts)
- ✅ GEO-optimized FAQ block (2–4 Q&As based on page content)

---

## Scoring System

Each module is scored 0–100. Final SEO Score = weighted average:

| Module | Weight |
|---|---|
| On-Page SEO | 30% |
| Technical SEO | 30% |
| Content & GEO | 25% |
| Link & Structure | 15% |

Score ranges:
- 80–100: 🟢 Healthy
- 60–79: 🟡 Needs attention
- 0–59: 🔴 Critical issues

---

## Report Format

Output a single Markdown file using this structure:

```
# SEO Audit Report — [Page Title or URL]
**Date:** [today's date]
**URL:** [audited URL or "Provided HTML"]
**Overall SEO Score:** XX/100 [emoji]

---

## Executive Summary
[3–5 sentence summary of the biggest issues and quick wins]

---

## 📋 On-Page SEO — Score: XX/100
[findings table + flagged issues]

### 🔧 Auto-Fixes
[code blocks for corrected tags]

---

## ⚙️ Technical SEO — Score: XX/100
[findings + schema fixes]

### 🔧 Auto-Fixes
[JSON-LD schema block, robots.txt suggestion if needed]

---

## ✍️ Content & GEO — Score: XX/100
[content analysis + GEO score]

### 🔧 Auto-Fixes
[rewritten intro paragraph, FAQ block]

---

## 🔗 Link & Structure — Score: XX/100
[link audit findings]

---

## 🎯 Priority Action Plan
| Priority | Issue | Fix | Effort |
|---|---|---|---|
| 🔴 Critical | ... | ... | Low/Med/High |
| 🟡 Medium | ... | ... | ... |
| 🟢 Quick Win | ... | ... | ... |

---

## 📁 Fixed Assets
[All auto-fixed code blocks consolidated here for easy copy-paste]
```

Save the report as `/mnt/user-data/outputs/seo-audit-report.md` and present it to the user with `present_files`.

---

## Behavior Notes

- **Always fetch first**: if a URL is given, fetch it before starting analysis — via Firecrawl when available, requesting raw HTML (see Page Acquisition)
- **Never audit processed text as if it were HTML**: if only extracted/markdown content is available, mark head-section elements Unknown rather than reporting them as missing
- **Respect the crawl budget**: single page by default; state any crawl limit used in the report
- **Be specific**: never give vague advice like "improve your content" — always cite the exact element, its current value, and the improved version
- **Context-aware**: detect WordPress, WooCommerce, Arabic/RTL automatically from the HTML — don't ask the user
- **GEO always included**: run the GEO module on every audit, even if not explicitly requested
- **No score inflation**: give honest scores; a site with missing schema and no meta description should score below 50
- **Multilingual**: if Arabic content is detected, write Arabic-specific fixes in Arabic

---

## References

See `references/schema-templates.md` for ready-to-use JSON-LD templates by page type.
See `references/geo-checklist.md` for the full GEO scoring rubric.
