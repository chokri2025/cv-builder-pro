// SEO regression tests for the isolated Next.js PoC.
//
// Runs against the real production build (`next start`), so it checks the raw HTML
// a crawler receives — not the client-rendered DOM. Run `pnpm build` first.
// Uses only Node built-ins (node:test), so no extra dependencies are installed.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createServer } from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = 'https://www.cvbuilder-pro.online';
// Same locale set and URL scheme as production (artifacts/cv-builder/scripts/seo-routes.mjs).
const LANGUAGES = ['en', 'fr', 'es', 'ar', 'tr', 'pt'];
const teacherUrl = (lang) =>
  lang === 'en' ? `${SITE_URL}/resume/teacher` : `${SITE_URL}/${lang}/resume/teacher`;
const EXPECTED_HREFLANG = {
  ...Object.fromEntries(LANGUAGES.map((l) => [l, teacherUrl(l)])),
  'x-default': teacherUrl('en'),
};

// Mirrors MAX_TITLE / MAX_META_DESCRIPTION in artifacts/cv-builder/src/data/localized-seo-data.ts.
const MAX_TITLE = 60;
const MAX_META_DESCRIPTION = 155;

const PAGES = [
  { path: '/', lang: 'en', dir: 'ltr', canonical: `${SITE_URL}/`, landing: false },
  ...LANGUAGES.map((lang) => ({
    path: new URL(teacherUrl(lang)).pathname,
    lang,
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    canonical: teacherUrl(lang),
    landing: true,
  })),
];
const LANDING_PAGES = PAGES.filter((p) => p.landing);

// URLs that must NOT resolve inside the PoC. The legacy production policy for these is
// undecided (see docs/migration/NEXTJS_SEO_POC.md); the PoC itself must 404, not soft-200.
const NOT_FOUND_PATHS = [
  '/resume/customer-service-los-angeles',
  '/fr/resume/customer-service-los-angeles',
  '/resume/nurse',
  '/en/resume/teacher',
  '/fr',
  '/es',
  '/de/resume/teacher',
  '/ar/resume/nurse',
  '/does-not-exist',
];

let server;
let baseUrl;

function freePort() {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.unref();
    srv.on('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

before(async () => {
  if (!existsSync(join(ROOT, '.next', 'BUILD_ID'))) {
    throw new Error('No production build found. Run `pnpm build` before `pnpm test`.');
  }
  const port = await freePort();
  baseUrl = `http://127.0.0.1:${port}`;
  server = spawn(
    process.execPath,
    [join(ROOT, 'node_modules/next/dist/bin/next'), 'start', '-p', String(port), '-H', '127.0.0.1'],
    { cwd: ROOT, env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' }, stdio: 'ignore' },
  );
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      await fetch(`${baseUrl}/robots.txt`);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  throw new Error('next start did not become ready within 30s');
});

after(() => {
  server?.kill();
});

const get = (path) => fetch(`${baseUrl}${path}`, { redirect: 'manual' });

function decode(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function attrs(tag) {
  const out = {};
  for (const [, k, v] of tag.matchAll(/([\w:-]+)="([^"]*)"/g)) out[k.toLowerCase()] = decode(v);
  return out;
}

/** Parses the server-rendered HTML. RSC payload strings are ignored because they are not tags. */
function parse(html) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? '';
  const tags = (name) =>
    [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map((m) => attrs(m[0]));
  const meta = tags('meta');
  const links = tags('link');
  const metaContent = (key, attr = 'name') =>
    meta.filter((m) => m[attr] === key).map((m) => m.content);
  return {
    html,
    head,
    htmlLang: attrs(html.match(/<html\b[^>]*>/)?.[0] ?? '').lang,
    htmlDir: attrs(html.match(/<html\b[^>]*>/)?.[0] ?? '').dir,
    titles: [...html.matchAll(/<title>([\s\S]*?)<\/title>/g)].map((m) => decode(m[1])),
    descriptions: metaContent('description'),
    robots: metaContent('robots'),
    ogTitle: metaContent('og:title', 'property'),
    ogDescription: metaContent('og:description', 'property'),
    ogUrl: metaContent('og:url', 'property'),
    canonicals: links.filter((l) => l.rel === 'canonical').map((l) => l.href),
    hreflangs: links
      .filter((l) => l.rel === 'alternate' && l.hreflang)
      .map((l) => ({ lang: l.hreflang, href: l.href })),
    jsonLd: [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
      (m) => m[1],
    ),
    summaries: [...html.matchAll(/<summary>([\s\S]*?)<\/summary>/g)].map((m) => decode(m[1])),
  };
}

const pageCache = new Map();
async function page(path) {
  if (!pageCache.has(path)) {
    const res = await get(path);
    assert.equal(res.status, 200, `${path} should return 200`);
    assert.match(res.headers.get('content-type') ?? '', /text\/html/);
    pageCache.set(path, parse(await res.text()));
  }
  return pageCache.get(path);
}

for (const p of PAGES) {
  test(`${p.path}: html lang/dir, single title/description, noindex`, async () => {
    const doc = await page(p.path);
    assert.equal(doc.htmlLang, p.lang);
    assert.equal(doc.htmlDir, p.dir);
    assert.equal(doc.titles.length, 1, 'exactly one <title>');
    assert.equal(doc.descriptions.length, 1, 'exactly one meta description');
    assert.ok(doc.titles[0].trim().length > 0);
    assert.ok(doc.descriptions[0].trim().length > 0);
    assert.deepEqual(doc.robots, ['noindex, nofollow'], 'PoC must stay noindex until cutover');
  });

  test(`${p.path}: exactly one absolute canonical on the production host`, async () => {
    const doc = await page(p.path);
    assert.deepEqual(doc.canonicals, [p.canonical]);
    assert.ok(doc.head.includes('rel="canonical"'), 'canonical must be in <head>');
  });

  test(`${p.path}: no preview/localhost hosts leak into SEO URLs`, async () => {
    const doc = await page(p.path);
    const urls = [...doc.canonicals, ...doc.hreflangs.map((h) => h.href), ...doc.ogUrl];
    for (const u of urls) {
      assert.ok(u.startsWith(`${SITE_URL}/`), `${u} must use ${SITE_URL}`);
      assert.doesNotMatch(u, /vercel\.app|localhost|127\.0\.0\.1/);
    }
    for (const block of doc.jsonLd)
      assert.doesNotMatch(block, /vercel\.app|localhost|127\.0\.0\.1/);
  });
}

test('/: no hreflang or JSON-LD on the English-only PoC homepage', async () => {
  const doc = await page('/');
  assert.equal(doc.hreflangs.length, 0);
  assert.equal(doc.jsonLd.length, 0);
});

for (const p of LANDING_PAGES) {
  test(`${p.path}: title/description within SERP limits`, async () => {
    const doc = await page(p.path);
    assert.ok(doc.titles[0].length <= MAX_TITLE, `title too long: ${doc.titles[0].length}`);
    assert.ok(
      doc.descriptions[0].length <= MAX_META_DESCRIPTION,
      `description too long: ${doc.descriptions[0].length}`,
    );
  });

  test(`${p.path}: hreflang set is exact, unique and reciprocal`, async () => {
    const doc = await page(p.path);
    const langs = doc.hreflangs.map((h) => h.lang);
    assert.equal(new Set(langs).size, langs.length, `duplicate hreflang: ${langs.join(',')}`);
    assert.deepEqual(
      Object.fromEntries(doc.hreflangs.map((h) => [h.lang, h.href])),
      EXPECTED_HREFLANG,
    );
    // The page's own canonical must be one of its alternates (self-reference).
    assert.equal(doc.hreflangs.find((h) => h.lang === p.lang)?.href, p.canonical);
  });

  test(`${p.path}: Open Graph matches title, description and canonical`, async () => {
    const doc = await page(p.path);
    assert.deepEqual(doc.ogTitle, doc.titles);
    assert.deepEqual(doc.ogDescription, doc.descriptions);
    assert.deepEqual(doc.ogUrl, [p.canonical]);
  });

  test(`${p.path}: exactly one valid JSON-LD graph consistent with the page`, async () => {
    const doc = await page(p.path);
    assert.equal(doc.jsonLd.length, 1, 'exactly one JSON-LD block');
    assert.doesNotMatch(doc.jsonLd[0], /</, 'JSON-LD must escape "<"');
    const data = JSON.parse(doc.jsonLd[0]);
    assert.equal(data['@context'], 'https://schema.org');
    const graph = data['@graph'];
    assert.ok(Array.isArray(graph));
    const byType = (t) => graph.filter((n) => n['@type'] === t);
    for (const t of ['WebPage', 'BreadcrumbList', 'FAQPage', 'WebApplication']) {
      assert.equal(byType(t).length, 1, `exactly one ${t}`);
    }
    assert.ok(byType('Organization').length <= 1, 'no duplicate Organization');

    const [webPage] = byType('WebPage');
    assert.equal(webPage.url, p.canonical);
    assert.equal(webPage['@id'], `${p.canonical}#webpage`);
    assert.equal(webPage.inLanguage, p.lang);
    assert.equal(webPage.name, doc.titles[0]);
    assert.equal(webPage.description, doc.descriptions[0]);

    const [crumbs] = byType('BreadcrumbList');
    assert.equal(crumbs.itemListElement.at(-1).item, p.canonical);

    // FAQ rich results require the marked-up Q&A to be visible on the page.
    const [faq] = byType('FAQPage');
    assert.equal(faq.inLanguage, p.lang);
    assert.ok(faq.mainEntity.length > 0);
    assert.deepEqual(
      faq.mainEntity.map((q) => q.name),
      doc.summaries,
      'FAQ JSON-LD questions must match the visible FAQ',
    );
    const ids = graph.map((n) => n['@id']);
    assert.equal(new Set(ids).size, ids.length, 'duplicate @id in graph');
  });
}

test('every language in the cluster is a distinct, localized document', async () => {
  const docs = await Promise.all(LANDING_PAGES.map((p) => page(p.path)));
  for (const field of ['titles', 'descriptions']) {
    const values = docs.map((d) => d[field][0]);
    assert.equal(new Set(values).size, values.length, `duplicate ${field} across languages`);
  }
});

test('/: links to every page in the hreflang cluster', async () => {
  const doc = await page('/');
  for (const p of LANDING_PAGES) assert.ok(doc.html.includes(`href="${p.path}"`), p.path);
});

for (const path of NOT_FOUND_PATHS) {
  test(`${path}: returns a real 404 with noindex`, async () => {
    const res = await get(path);
    assert.equal(res.status, 404);
    const doc = parse(await res.text());
    assert.ok(
      doc.robots.some((r) => r.includes('noindex')),
      '404 must carry noindex',
    );
    assert.equal(doc.canonicals.length, 0, '404 must not declare a canonical');
  });
}

test('trailing-slash URLs permanently redirect to the canonical path', async () => {
  for (const p of LANDING_PAGES.map((x) => `${x.path}/`)) {
    const res = await get(p);
    assert.equal(res.status, 308, p);
    assert.equal(new URL(res.headers.get('location'), baseUrl).pathname, p.slice(0, -1));
  }
});

test('robots.txt blocks all crawling of the PoC', async () => {
  const res = await get('/robots.txt');
  assert.equal(res.status, 200);
  const body = await res.text();
  assert.match(body, /^User-Agent: \*$/im);
  assert.match(body, /^Disallow: \/$/m);
  assert.doesNotMatch(body, /^Allow:/im);
});

test('sitemap.xml lists only built PoC URLs with reciprocal alternates', async () => {
  const res = await get('/sitemap.xml');
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type') ?? '', /xml/);
  const xml = await res.text();
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
    loc: m[1].match(/<loc>([^<]+)<\/loc>/)[1],
    alternates: Object.fromEntries(
      [...m[1].matchAll(/<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(
        (a) => [a[1], a[2]],
      ),
    ),
  }));
  assert.deepEqual(
    entries.map((e) => e.loc),
    PAGES.map((p) => p.canonical),
  );
  for (const e of entries.filter((x) => x.loc !== `${SITE_URL}/`)) {
    assert.deepEqual(e.alternates, EXPECTED_HREFLANG, `alternates for ${e.loc}`);
  }
  // Every sitemap URL must be served by the PoC (no 404s in the sitemap).
  for (const e of entries) {
    const r = await get(new URL(e.loc).pathname);
    assert.equal(r.status, 200, e.loc);
  }
});
