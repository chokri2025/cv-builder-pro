/**
 * Build-time prerender for the SEO landing pages.
 *
 * The app is a client-rendered SPA, so per-page <title>/meta/canonical/hreflang/
 * JSON-LD (set via useSEO's useEffect) are invisible to crawlers and social-preview
 * bots that don't execute JS. This script renders each landing-page route to real
 * HTML — head tags and body content both — using the same React components, SEO
 * prop builders, and route enumeration as the live app, so there's no separate
 * content path to drift out of sync.
 *
 * Run after `vite build`: reads dist/public/index.html as the shell template and
 * writes one dist/public/resume/<slug>/index.html (and dist/public/<lang>/resume/
 * <slug>/index.html for non-English locales) per route.
 */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import i18n from '../src/i18n';
import LandingPage from '../src/pages/LandingPage';
import { parseSlug } from '../src/data/seo-data';
import { buildLocalizedSeoPageData } from '../src/data/localized-seo-data';
import { buildLandingSeoProps } from '../src/lib/landing-seo';
import { buildHeadTags, type HeadTags } from '../src/hooks/useSEO';
import { LANGUAGES, NON_EN_LANGS, getAllSeoSlugs } from './seo-routes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist/public');
const templatePath = path.join(distDir, 'index.html');

const siteUrl = (
  process.env.VITE_APP_URL ||
  process.env.APP_URL ||
  'https://cv-builderpro.vercel.app'
).replace(/\/$/, '');

type LangCode = (typeof LANGUAGES)[number];

function renderHeadTagsHtml(head: HeadTags): string {
  const lines: string[] = [`<title>${escapeHtml(head.title)}</title>`];
  head.metas.forEach(({ attrName, attrValue, content }) => {
    lines.push(`<meta ${attrName}="${escapeAttr(attrValue)}" content="${escapeAttr(content)}">`);
  });
  head.links.forEach(({ rel, href, hreflang }) => {
    const hreflangAttr = hreflang ? ` hreflang="${escapeAttr(hreflang)}"` : '';
    lines.push(`<link rel="${escapeAttr(rel)}"${hreflangAttr} href="${escapeAttr(href)}">`);
  });
  if (head.jsonLd) {
    lines.push(`<script type="application/ld+json">${JSON.stringify(head.jsonLd)}</script>`);
  }
  return lines.join('\n    ');
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/** Removes the static, generic SEO tags from the shell template's <head> so the
 * per-route tags we inject are the only ones a crawler sees (no duplicate/conflicting
 * <title>, canonical, or og:* tags left over from the generic index.html shell). */
function stripGenericSeoTags(headHtml: string): string {
  return headHtml
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta\s+name="description"[^>]*>/, '')
    .replace(/<meta\s+name="keywords"[^>]*>/, '')
    .replace(/<link\s+rel="canonical"[^>]*>/, '')
    .replace(/<meta\s+property="og:[^"]*"[^>]*>\s*/g, '')
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>\s*/g, '')
    .replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/, '');
}

async function renderRoute(slug: string, lang: LangCode, urlLang: string | undefined) {
  await i18n.changeLanguage(lang);

  const { skill, city } = parseSlug(slug);
  const page = buildLocalizedSeoPageData(skill, city, lang);
  const seoProps = buildLandingSeoProps(page, slug, urlLang, lang, siteUrl);
  const headTags = buildHeadTags(seoProps);

  const routePath = urlLang ? `/${urlLang}/resume/${slug}` : `/resume/${slug}`;
  const bodyHtml = renderToStaticMarkup(
    <StaticRouter location={routePath}>
      <I18nextProvider i18n={i18n}>
        <Routes>
          <Route path="/resume/:slug" element={<LandingPage />} />
          <Route path="/:lang/resume/:slug" element={<LandingPage />} />
        </Routes>
      </I18nextProvider>
    </StaticRouter>,
  );

  return { headTags, bodyHtml, routePath };
}

async function main() {
  if (!fs.existsSync(templatePath)) {
    console.error(`[prerender] dist/public/index.html not found — run "vite build" first.`);
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf8');
  const slugs = getAllSeoSlugs();

  const routes: { slug: string; lang: LangCode; urlLang: string | undefined }[] = [
    ...slugs.map((slug: string) => ({ slug, lang: 'en' as LangCode, urlLang: undefined })),
    ...NON_EN_LANGS.flatMap((lang: string) =>
      slugs.map((slug: string) => ({ slug, lang: lang as LangCode, urlLang: lang })),
    ),
  ];

  let written = 0;
  for (const { slug, lang, urlLang } of routes) {
    const { headTags, bodyHtml, routePath } = await renderRoute(slug, lang, urlLang);

    const html = template
      .replace(/<head>([\s\S]*?)<\/head>/, (_m, headInner) => {
        const cleaned = stripGenericSeoTags(headInner);
        return `<head>${cleaned}\n    ${renderHeadTagsHtml(headTags)}\n  </head>`;
      })
      .replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`)
      .replace('<html lang="en">', `<html lang="${lang}"${lang === 'ar' ? ' dir="rtl"' : ''}>`);

    const outDir = path.join(distDir, routePath.replace(/^\//, ''));
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
    written += 1;
  }

  console.log(`[prerender] ✓ Prerendered ${written} SEO landing pages`);
}

main().catch((err) => {
  console.error('[prerender] Failed:', err);
  process.exit(1);
});
