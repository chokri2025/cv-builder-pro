/**
 * Sitemap generator for CV Builder Pro.
 * Writes sitemap.xml to public/ (dev) and dist/public/ (build).
 * Run: node artifacts/cv-builder/scripts/generate-sitemap.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LANGUAGES, NON_EN_LANGS, getAllSeoSlugs } from './seo-routes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const appUrl =
  process.env.VITE_APP_URL || process.env.APP_URL || 'https://cv-builderpro.vercel.app';
const base = appUrl.replace(/\/$/, '');
const slugs = getAllSeoSlugs();
const today = new Date().toISOString().split('T')[0];

function entry(loc, priority, changefreq = 'monthly', includeLastmod = true) {
  const lastmod = includeLastmod ? `\n    <lastmod>${today}</lastmod>` : '';
  return `  <url>\n    <loc>${base}${loc}</loc>${lastmod}\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

const urls = [
  // ── Core ───────────────────────────────────────────────────────────────────
  entry('/', '1.0', 'weekly'),
  entry('/sitemap', '0.5', 'monthly', false),

  // ── Language homepages (/en, /fr, /es, /ar, /tr, /pt) ────────────────────
  ...LANGUAGES.map((lang) => entry(`/${lang}`, '0.9', 'weekly')),

  // ── Language sitemap pages ────────────────────────────────────────────────
  ...LANGUAGES.map((lang) => entry(`/${lang}/sitemap`, '0.5', 'monthly', false)),

  // ── English SEO landing pages ─────────────────────────────────────────────
  ...slugs.map((slug) => entry(`/resume/${slug}`, '0.8')),

  // ── Localized SEO landing pages (fr, es, ar, tr, pt) ─────────────────────
  ...NON_EN_LANGS.flatMap((lang) => slugs.map((slug) => entry(`/${lang}/resume/${slug}`, '0.7'))),
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
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
console.log(`  Language homepages:           ${LANGUAGES.length}`);
console.log(`  Language sitemap pages:       ${LANGUAGES.length}`);
console.log(`  English SEO landing pages:    ${slugs.length}`);
console.log(
  `  Localized SEO pages (×${NON_EN_LANGS.length}):   ${NON_EN_LANGS.length * slugs.length}`,
);
