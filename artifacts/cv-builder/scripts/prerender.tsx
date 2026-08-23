/**
 * Build-time prerender for the homepage and the SEO landing pages.
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
 * <slug>/index.html for non-English locales) per route, plus the homepage itself —
 * dist/public/index.html and dist/public/<lang>/index.html — so the page carrying
 * the most authority is not the one page a crawler sees empty.
 *
 * Routes come from getPrerenderRoutes(), the same enumeration the sitemap is built
 * from. Anything advertised in the sitemap without a file here would fall through
 * to the SPA rewrite and be served the homepage HTML, canonical tag included.
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
import SitemapPage from '../src/pages/SitemapPage';
import EuropassPage from '../src/pages/EuropassPage';
import CVBuilderPage from '../src/pages/CVBuilderPage';
import { buildHomeFaqJsonLd, getHomeFaqs } from '../src/lib/home-seo';
import { buildSitemapSeoProps } from '../src/lib/sitemap-seo';
import { buildEuropassSeoProps } from '../src/lib/europass-seo';
import { parseSlug } from '../src/data/seo-data';
import { buildLocalizedSeoPageData } from '../src/data/localized-seo-data';
import { buildLandingSeoProps } from '../src/lib/landing-seo';
import { buildHeadTags, type HeadTags } from '../src/hooks/useSEO';
import { LANGUAGES, getPrerenderRoutes } from './seo-routes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist/public');
const templatePath = path.join(distDir, 'index.html');

const siteUrl = (
  process.env.VITE_APP_URL ||
  process.env.APP_URL ||
  'https://www.cvbuilder-pro.online'
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
function stripGenericSeoTags(headHtml: string, { keepJsonLd = false } = {}): string {
  const stripped = headHtml
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta\s+name="description"[^>]*>/, '')
    .replace(/<meta\s+name="keywords"[^>]*>/, '')
    .replace(/<link\s+rel="canonical"[^>]*>/, '')
    .replace(/<link\s+rel="alternate"[^>]*>\s*/g, '')
    .replace(/<meta\s+property="og:[^"]*"[^>]*>\s*/g, '')
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>\s*/g, '');

  // The homepage keeps the shell's Organization/WebSite/WebApplication graph;
  // landing pages replace it with their own per-page graph.
  return keepJsonLd
    ? stripped
    : stripped.replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/, '');
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

async function renderHomeRoute(lang: LangCode, urlLang: string | undefined) {
  await i18n.changeLanguage(lang);

  // /en is a duplicate of the root homepage, so it canonicalizes to "/".
  const canonical = urlLang && urlLang !== 'en' ? `${siteUrl}/${urlLang}` : `${siteUrl}/`;
  const headTags = buildHeadTags({
    title: i18n.t('seo.homeTitle'),
    description: i18n.t('seo.homeDescription'),
    canonical,
    lang,
    alternateLangs: LANGUAGES.map((l: string) => ({
      lang: l,
      href: l === 'en' ? `${siteUrl}/` : `${siteUrl}/${l}`,
    })),
    image: `${siteUrl}/opengraph.jpg`,
    siteName: 'CV Builder Pro',
    jsonLd: buildHomeFaqJsonLd(getHomeFaqs(i18n.t.bind(i18n)), canonical),
  });

  const bodyHtml = renderToStaticMarkup(
    <StaticRouter location={urlLang ? `/${urlLang}` : '/'}>
      <I18nextProvider i18n={i18n}>
        <Routes>
          <Route path="/" element={<CVBuilderPage />} />
          <Route path="/:lang" element={<CVBuilderPage />} />
        </Routes>
      </I18nextProvider>
    </StaticRouter>,
  );

  return { headTags, bodyHtml };
}

async function renderSitemapRoute(lang: LangCode, urlLang: string | undefined) {
  await i18n.changeLanguage(lang);

  const seoProps = buildSitemapSeoProps(
    urlLang,
    lang,
    siteUrl,
    `${i18n.t('seo.sitemap')} – CV Builder Pro`,
    i18n.t('seo.sitemapDescription'),
  );
  const headTags = buildHeadTags(seoProps);

  const bodyHtml = renderToStaticMarkup(
    <StaticRouter location={urlLang ? `/${urlLang}/sitemap` : '/sitemap'}>
      <I18nextProvider i18n={i18n}>
        <Routes>
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/:lang/sitemap" element={<SitemapPage />} />
        </Routes>
      </I18nextProvider>
    </StaticRouter>,
  );

  return { headTags, bodyHtml };
}

async function renderEuropassRoute(lang: LangCode, urlLang: string | undefined) {
  await i18n.changeLanguage(lang);

  const seoProps = buildEuropassSeoProps(urlLang, lang, siteUrl, {
    title: i18n.t('europass.title'),
    description: i18n.t('europass.description'),
    h1: i18n.t('europass.h1'),
    intro: i18n.t('europass.intro'),
    stepsTitle: i18n.t('europass.stepsTitle'),
    steps: i18n.t('europass.steps', { returnObjects: true }) as unknown as string[],
    faqs: i18n.t('europass.faqs', { returnObjects: true }) as unknown as {
      q: string;
      a: string;
    }[],
  });
  const headTags = buildHeadTags(seoProps);

  const bodyHtml = renderToStaticMarkup(
    <StaticRouter location={urlLang ? `/${urlLang}/europass-cv` : '/europass-cv'}>
      <I18nextProvider i18n={i18n}>
        <Routes>
          <Route path="/europass-cv" element={<EuropassPage />} />
          <Route path="/:lang/europass-cv" element={<EuropassPage />} />
        </Routes>
      </I18nextProvider>
    </StaticRouter>,
  );

  return { headTags, bodyHtml };
}

function assembleHtml(
  template: string,
  headTags: HeadTags,
  bodyHtml: string,
  lang: LangCode,
  keepJsonLd: boolean,
): string {
  return template
    .replace(/<head>([\s\S]*?)<\/head>/, (_m, headInner) => {
      const cleaned = stripGenericSeoTags(headInner, { keepJsonLd });
      return `<head>${cleaned}\n    ${renderHeadTagsHtml(headTags)}\n  </head>`;
    })
    .replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`)
    .replace('<html lang="en">', `<html lang="${lang}"${lang === 'ar' ? ' dir="rtl"' : ''}>`);
}

async function main() {
  if (!fs.existsSync(templatePath)) {
    console.error(`[prerender] dist/public/index.html not found — run "vite build" first.`);
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf8');

  // One list, shared with the sitemap generator: every advertised URL gets a file.
  const routes = getPrerenderRoutes();

  const counts = { home: 0, sitemap: 0, europass: 0, landing: 0 };

  for (const route of routes) {
    const { kind, lang, urlLang } = route;

    const rendered =
      kind === 'landing'
        ? await renderRoute(route.slug!, lang, urlLang)
        : kind === 'sitemap'
          ? await renderSitemapRoute(lang, urlLang)
          : kind === 'europass'
            ? await renderEuropassRoute(lang, urlLang)
            : await renderHomeRoute(lang, urlLang);

    // Homepages keep the shell's Organization/WebSite graph; the other page types
    // ship their own, so the shell's is stripped for them.
    const html = assembleHtml(
      template,
      rendered.headTags,
      rendered.bodyHtml,
      lang,
      kind === 'home',
    );

    const outDir = path.join(distDir, route.path.replace(/^\//, ''));
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
    counts[kind] += 1;
  }

  const written = counts.home + counts.sitemap + counts.europass + counts.landing;

  console.log(
    `[prerender] ✓ Prerendered ${written} pages ` +
      `(${counts.home} homepage, ${counts.sitemap} sitemap, ${counts.europass} europass, ${counts.landing} landing)`,
  );
}

main().catch((err) => {
  console.error('[prerender] Failed:', err);
  process.exit(1);
});
