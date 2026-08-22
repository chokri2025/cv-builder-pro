/**
 * Sitemap generator for CV Builder Pro.
 * Writes sitemap.xml to public/ (dev) and dist/public/ (build).
 * Run: node artifacts/cv-builder/scripts/generate-sitemap.mjs
 *
 * Every URL that has translated equivalents also carries xhtml:link alternates,
 * so the hreflang cluster is declared in the sitemap as well as in each page's
 * <head> — the two must agree, and both are generated from this same route list.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LANGUAGES, NON_EN_LANGS, getAllSeoSlugs } from './seo-routes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const appUrl =
  process.env.VITE_APP_URL || process.env.APP_URL || 'https://www.cvbuilder-pro.online';
const base = appUrl.replace(/\/$/, '');
const slugs = getAllSeoSlugs();
const today = new Date().toISOString().split('T')[0];

/** English lives at the unprefixed path; other locales are prefixed with /<lang>. */
function localizedPath(lang, suffix) {
  return lang === 'en' ? suffix || '/' : `/${lang}${suffix}`;
}

/** hreflang cluster for a path that exists in every supported language. */
function alternatesFor(suffix) {
  const links = LANGUAGES.map((lang) => ({ lang, href: `${base}${localizedPath(lang, suffix)}` }));
  return [...links, { lang: 'x-default', href: `${base}${suffix || '/'}` }];
}

function entry(loc, priority, changefreq = 'monthly', includeLastmod = true, alternates = []) {
  const lastmod = includeLastmod ? `\n    <lastmod>${today}</lastmod>` : '';
  const links = alternates
    .map((a) => `\n    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.href}" />`)
    .join('');
  return `  <url>\n    <loc>${base}${loc}</loc>${lastmod}\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>${links}\n  </url>`;
}

const urls = [
  // ── Core ───────────────────────────────────────────────────────────────────
  entry('/', '1.0', 'weekly', true, alternatesFor('')),
  entry('/sitemap', '0.5', 'monthly', false, alternatesFor('/sitemap')),

  // ── Language homepages (/fr, /es, /ar, /tr, /pt) ──────────────────────────
  //    English is the root "/" above; /en canonicalizes to it, so it is not listed.
  ...NON_EN_LANGS.map((lang) => entry(`/${lang}`, '0.9', 'weekly', true, alternatesFor(''))),

  // ── Language sitemap pages ────────────────────────────────────────────────
  ...NON_EN_LANGS.map((lang) =>
    entry(`/${lang}/sitemap`, '0.5', 'monthly', false, alternatesFor('/sitemap')),
  ),

  // ── English SEO landing pages ─────────────────────────────────────────────
  ...slugs.map((slug) =>
    entry(`/resume/${slug}`, '0.8', 'monthly', true, alternatesFor(`/resume/${slug}`)),
  ),

  // ── Localized SEO landing pages (fr, es, ar, tr, pt) ─────────────────────
  ...NON_EN_LANGS.flatMap((lang) =>
    slugs.map((slug) =>
      entry(`/${lang}/resume/${slug}`, '0.7', 'monthly', true, alternatesFor(`/resume/${slug}`)),
    ),
  ),
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...urls,
  '</urlset>',
].join('\n');

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`;

// Write to public/ (served during dev & deployed as static asset)
const publicDir = path.resolve(__dirname, '../public');
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf8');

// Write to dist/public/ if a build already exists
const distDir = path.resolve(__dirname, '../dist/public');
if (fs.existsSync(path.resolve(__dirname, '../dist'))) {
  fs.mkdirSync(distDir, { recursive: true });
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robots, 'utf8');
}

const total = urls.length;
console.log(`[sitemap] ✓ Generated sitemap.xml with ${total} URLs (base: ${base})`);
console.log(`  Core pages:                   2`);
console.log(`  Language homepages:           ${NON_EN_LANGS.length}`);
console.log(`  Language sitemap pages:       ${NON_EN_LANGS.length}`);
console.log(`  English SEO landing pages:    ${slugs.length}`);
console.log(
  `  Localized SEO pages (×${NON_EN_LANGS.length}):   ${NON_EN_LANGS.length * slugs.length}`,
);
