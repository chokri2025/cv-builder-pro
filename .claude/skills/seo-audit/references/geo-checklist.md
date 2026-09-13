# GEO Scoring Rubric — Generative Engine Optimization

GEO refers to optimizing content for visibility in AI-generated search responses (ChatGPT, Perplexity, Google AI Overviews, Claude, Bing Copilot, etc.).

Score each criterion 0–2. Total score = sum / (criteria count × 2) × 10.

---

## Scoring Criteria

### 1. Direct Answer Structure (0–2)
- 0: Content is vague, narrative-only, no direct answers
- 1: Some direct answers but buried in paragraphs
- 2: Key facts and answers appear in the first 100 words of the page and in clearly scannable sections

### 2. Entity Clarity (0–2)
- 0: Brand/author/entity not clearly identified
- 1: Name present but no supporting context (location, expertise, founding date)
- 2: Entity fully defined: who, what they do, where, why trustworthy

### 3. FAQ / Q&A Blocks (0–2)
- 0: No FAQ-style content
- 1: FAQ present but answers are too long or vague
- 2: FAQ with concise, factual answers under 60 words each, marked up with FAQPage schema

### 4. Structured Data Coverage (0–2)
- 0: No schema markup
- 1: Basic schema (WebPage/Article only)
- 2: Rich schema appropriate to page type (Product, FAQ, HowTo, LocalBusiness, etc.)

### 5. Snippet-Worthy Paragraphs (0–2)
- 0: All paragraphs are 150+ words with no clear topic sentence
- 1: Some short paragraphs but inconsistent
- 2: Paragraphs start with a clear claim/fact, are 40–80 words, and can stand alone as answers

### 6. Authoritative Signals (0–2)
- 0: No author, no citations, no trust signals
- 1: Author name present or some citations
- 2: Author with credentials, outbound links to authoritative sources, publication date visible

### 7. Keyword Alignment with Natural Queries (0–2)
- 0: Content targets short head keywords only ("shoes", "SEO")
- 1: Mix of head and long-tail but not question-format
- 2: Content includes natural-language question phrases ("how to", "what is", "best way to", "difference between")

### 8. Content Freshness Signals (0–2)
- 0: No date visible, content appears stale
- 1: Date present but content not updated recently
- 2: Recent publication/modification date visible, content references current year or recent events

### 9. Multilingual / Localization (0–2 — only scored if applicable)
- 0: Site serves multiple regions/languages but no hreflang
- 1: hreflang present but missing some regions
- 2: Correct hreflang for all served languages/regions, including Arabic variants (ar, ar-TN, ar-SA, etc.)

### 10. Accessibility & Readability (0–2)
- 0: Dense text, no subheadings, no lists
- 1: Some structure but still difficult to scan
- 2: Clear H2/H3 subheadings every 300 words, bullet lists used for enumerations, tables for comparisons

---

## GEO Score Interpretation

| Score | Label | Meaning |
|---|---|---|
| 8–10 | 🟢 GEO-Ready | Content is well-positioned for AI extraction |
| 5–7 | 🟡 Partially Optimized | Good foundation, needs targeted improvements |
| 0–4 | 🔴 GEO-Invisible | Content unlikely to be cited by AI models |

---

## Quick GEO Fixes (always include in report)

1. **Add a TL;DR block** at the top: 2–3 sentences summarizing the page for AI skimming
2. **Add FAQ schema** with 3–5 questions users actually search for
3. **Add author bio** with name, title, and a 1-sentence credential summary
4. **Break up paragraphs** — target 50–80 words max per paragraph
5. **Add a "Key Takeaways" section** with bullet points at the top or bottom
6. **Use question-format H2s** where natural ("What is X?" / "How does Y work?")
