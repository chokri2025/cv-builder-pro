import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { getAllSlugs, parseSlug } from './seo-data';
import {
  buildLocalizedSeoPageData,
  clampMetaDescription,
  clampTitle,
  MAX_META_DESCRIPTION,
  MAX_TITLE,
} from './localized-seo-data';
import { buildLandingSeoProps } from '../lib/landing-seo';
import { buildHomeFaqJsonLd } from '../lib/home-seo';
import { buildRelatedLinks } from '../lib/related-links';
import { buildSitemapSeoProps } from '../lib/sitemap-seo';

const LANGS = ['en', 'fr', 'es', 'ar', 'tr', 'pt'] as const;
const SITE = 'https://www.cvbuilder-pro.online';

function pagesFor(lang: (typeof LANGS)[number]) {
  return getAllSlugs().map((slug) => {
    const { skill, city } = parseSlug(slug);
    return { slug, page: buildLocalizedSeoPageData(skill, city, lang) };
  });
}

describe('landing page copy', () => {
  it.each(LANGS)('has a unique intro on every %s page', (lang) => {
    const intros = pagesFor(lang).map(({ page }) => page.intro);
    expect(new Set(intros).size).toBe(intros.length);
  });

  it.each(LANGS)('has a unique body on every %s page', (lang) => {
    const bodies = pagesFor(lang).map(({ page }) =>
      [page.intro, ...page.tips, ...page.localLines, ...page.faqs.map((f) => f.q + f.a)].join('|'),
    );
    expect(new Set(bodies).size).toBe(bodies.length);
  });

  it.each(LANGS)('keeps every %s meta description within the snippet limit', (lang) => {
    for (const { slug, page } of pagesFor(lang)) {
      expect(page.metaDescription.length, `${lang}/${slug}`).toBeLessThanOrEqual(
        MAX_META_DESCRIPTION,
      );
      expect(page.metaDescription.length).toBeGreaterThan(50);
    }
  });

  it('varies tips by job category rather than repeating one generic list', () => {
    const nurse = buildLocalizedSeoPageData(...withSlug('nurse-sydney'), 'en').tips;
    const dev = buildLocalizedSeoPageData(...withSlug('software-engineer-sydney'), 'en').tips;
    // Same city, different category: only the shared city-conventions tip may match.
    expect(nurse.filter((t) => dev.includes(t))).toHaveLength(1);
  });

  it('varies local requirements by city for the same job', () => {
    const sydney = buildLocalizedSeoPageData(...withSlug('nurse-sydney'), 'en').localLines;
    const london = buildLocalizedSeoPageData(...withSlug('nurse-london'), 'en').localLines;
    expect(sydney.some((l) => l.includes('AHPRA'))).toBe(true);
    expect(london.some((l) => l.includes('NMC'))).toBe(true);
    expect(sydney).not.toEqual(london);
  });

  it('gives every page a local-requirements block and page-specific FAQs', () => {
    for (const { slug, page } of pagesFor('en')) {
      expect(page.localLines.length, slug).toBeGreaterThanOrEqual(3);
      expect(page.localTitle.length, slug).toBeGreaterThan(0);
      expect(page.faqs.length, slug).toBe(4);
    }
  });
});

describe('page titles', () => {
  it.each(LANGS)('keeps %s titles within the width search results render', (lang) => {
    const lengths = pagesFor(lang).map(({ page }) => page.pageTitle.length);
    // A handful of the longest role × city combinations still run a few characters
    // over; nothing may exceed the hard cap, and the bulk must fit outright.
    expect(Math.max(...lengths)).toBeLessThanOrEqual(MAX_TITLE + 5);
    const fitting = lengths.filter((l) => l <= MAX_TITLE).length;
    expect(fitting / lengths.length).toBeGreaterThan(0.9);
  });

  it('keeps the brand suffix when the title still fits', () => {
    const page = buildLocalizedSeoPageData(...withSlug('nurse'), 'en');
    expect(page.pageTitle).toContain('| CV Builder Pro');
    expect(page.pageTitle.length).toBeLessThanOrEqual(MAX_TITLE);
  });

  it('drops the brand suffix rather than overflowing', () => {
    const page = buildLocalizedSeoPageData(...withSlug('marketing-manager-san-francisco'), 'en');
    expect(page.pageTitle).not.toContain('| CV Builder Pro');
  });

  it.each(LANGS)('gives every %s page a unique title', (lang) => {
    const titles = pagesFor(lang).map(({ page }) => page.pageTitle);
    expect(new Set(titles).size).toBe(titles.length);
  });
});

describe('clampTitle', () => {
  it('appends the brand when the result fits', () => {
    expect(clampTitle('Free Nurse CV Builder')).toBe('Free Nurse CV Builder | CV Builder Pro');
  });

  it('returns the bare title when the brand would overflow', () => {
    const core = 'A'.repeat(50);
    expect(clampTitle(core)).toBe(core);
  });

  it('honours a custom limit', () => {
    expect(clampTitle('Short', 100)).toBe('Short | CV Builder Pro');
    expect(clampTitle('Short', 10)).toBe('Short');
  });
});

describe('sitemap hub pages', () => {
  const title = 'Sitemap – CV Builder Pro';
  const description = 'Browse every guide.';

  it('canonicalizes /en/sitemap to the unprefixed hub', () => {
    const bare = buildSitemapSeoProps(undefined, 'en', SITE, title, description);
    const prefixed = buildSitemapSeoProps('en', 'en', SITE, title, description);

    expect(bare.canonical).toBe(`${SITE}/sitemap`);
    expect(prefixed.canonical).toBe(bare.canonical);
  });

  it('canonicalizes localized hubs to their own path', () => {
    const fr = buildSitemapSeoProps('fr', 'fr', SITE, title, description);
    expect(fr.canonical).toBe(`${SITE}/fr/sitemap`);
  });

  it('declares the full hreflang cluster with English unprefixed', () => {
    const props = buildSitemapSeoProps('fr', 'fr', SITE, title, description);
    expect(props.alternateLangs?.map((a) => a.lang).sort()).toEqual([
      'ar',
      'en',
      'es',
      'fr',
      'pt',
      'tr',
    ]);
    expect(props.alternateLangs?.find((a) => a.lang === 'en')?.href).toBe(`${SITE}/sitemap`);
  });

  it('ships CollectionPage structured data tied to the site graph', () => {
    const props = buildSitemapSeoProps(undefined, 'en', SITE, title, description);
    const jsonLd = props.jsonLd as { '@type': string; isPartOf: { '@id': string } };
    expect(jsonLd['@type']).toBe('CollectionPage');
    expect(jsonLd.isPartOf['@id']).toBe(`${SITE}/#website`);
  });
});

describe('clampMetaDescription', () => {
  it('leaves short descriptions untouched', () => {
    expect(clampMetaDescription('Short and sweet.')).toBe('Short and sweet.');
  });

  it('drops whole trailing sentences rather than cutting mid-word', () => {
    const text = `${'a'.repeat(120)}. ${'b'.repeat(120)}.`;
    const clamped = clampMetaDescription(text);
    expect(clamped.length).toBeLessThanOrEqual(MAX_META_DESCRIPTION);
    expect(clamped.endsWith('.')).toBe(true);
  });

  it('falls back to a word-boundary cut when a single sentence is too long', () => {
    const clamped = clampMetaDescription(`${'word '.repeat(60)}end`);
    expect(clamped.length).toBeLessThanOrEqual(MAX_META_DESCRIPTION);
    expect(clamped.endsWith('…')).toBe(true);
  });
});

describe('landing page SEO props', () => {
  const { skill, city } = parseSlug('nurse-sydney');
  const page = buildLocalizedSeoPageData(skill, city, 'en');

  it('serves English from the unprefixed path in canonical and hreflang', () => {
    const en = buildLandingSeoProps(page, 'nurse-sydney', undefined, 'en', SITE);
    const enPrefixed = buildLandingSeoProps(page, 'nurse-sydney', 'en', 'en', SITE);

    expect(en.canonical).toBe(`${SITE}/resume/nurse-sydney`);
    expect(enPrefixed.canonical).toBe(en.canonical);
    expect(en.alternateLangs?.find((a) => a.lang === 'en')?.href).toBe(
      `${SITE}/resume/nurse-sydney`,
    );
    expect(en.alternateLangs?.find((a) => a.lang === 'fr')?.href).toBe(
      `${SITE}/fr/resume/nurse-sydney`,
    );
  });

  it('canonicalizes localized routes to their own language path', () => {
    const fr = buildLandingSeoProps(page, 'nurse-sydney', 'fr', 'fr', SITE);
    expect(fr.canonical).toBe(`${SITE}/fr/resume/nurse-sydney`);
  });

  it('emits a JSON-LD graph with FAQPage answers taken from the page', () => {
    const props = buildLandingSeoProps(page, 'nurse-sydney', undefined, 'en', SITE);
    const graph = (props.jsonLd as { '@graph': Array<Record<string, unknown>> })['@graph'];
    const types = graph.map((node) => node['@type']);

    expect(types).toEqual(
      expect.arrayContaining(['WebPage', 'BreadcrumbList', 'FAQPage', 'WebApplication']),
    );

    const faq = graph.find((node) => node['@type'] === 'FAQPage') as {
      mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>;
    };
    expect(faq.mainEntity).toHaveLength(page.faqs.length);
    expect(faq.mainEntity[0].name).toBe(page.faqs[0].q);
    expect(faq.mainEntity[0].acceptedAnswer.text).toBe(page.faqs[0].a);
  });

  it('carries a social image on every page, since the prerender strips the shell tags', () => {
    const props = buildLandingSeoProps(page, 'nurse-sydney', undefined, 'en', SITE);
    expect(props.image).toBe(`${SITE}/opengraph.jpg`);
    expect(props.siteName).toBe('CV Builder Pro');
  });
});

describe('index.html shell', () => {
  const html = readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');

  it('keeps the homepage meta description inside the snippet limit', () => {
    const description = html.match(/name="description"\s+content="([^"]*)"/s)?.[1];
    expect(description).toBeDefined();
    expect(description!.length).toBeLessThanOrEqual(MAX_META_DESCRIPTION + 5);
  });

  it('declares an hreflang cluster with x-default', () => {
    for (const lang of LANGS) {
      expect(html).toContain(`hreflang="${lang}"`);
    }
    expect(html).toContain('hreflang="x-default"');
    expect(html).toContain(`<link rel="alternate" hreflang="en" href="${SITE}/" />`);
  });

  it('ships Organization, WebSite and WebApplication structured data', () => {
    const jsonLd = html.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    )?.[1] as string;
    const parsed = JSON.parse(jsonLd) as { '@graph': Array<{ '@type': string }> };
    expect(parsed['@graph'].map((n) => n['@type'])).toEqual([
      'Organization',
      'WebSite',
      'WebApplication',
    ]);
  });
});

interface LocaleFile {
  builder: { pageHeading?: string; pageTagline?: string };
  home?: { faqTitle?: string; guidesTitle?: string; faqs?: Array<{ q: string; a: string }> };
  seo: { homeDescription: string; related: Record<string, string> };
}

function readLocale(lang: string): LocaleFile {
  return JSON.parse(
    readFileSync(path.resolve(__dirname, `../locales/${lang}/translation.json`), 'utf8'),
  ) as LocaleFile;
}

describe('homepage content', () => {
  const locales = LANGS.map((lang) => ({ lang, json: readLocale(lang) }));

  it.each(locales)('gives $lang a page heading, tagline and FAQ block', ({ json }) => {
    expect(json.builder.pageHeading?.length).toBeGreaterThan(0);
    expect(json.builder.pageTagline?.length).toBeGreaterThan(0);
    expect(json.home?.faqTitle?.length).toBeGreaterThan(0);
    expect(json.home?.guidesTitle?.length).toBeGreaterThan(0);
    expect(json.home?.faqs).toHaveLength(3);
    for (const faq of json.home!.faqs!) {
      expect(faq.q.length).toBeGreaterThan(0);
      expect(faq.a.length).toBeGreaterThan(0);
    }
  });

  it.each(locales)('keeps the $lang homepage description within the snippet limit', ({ json }) => {
    expect(json.seo.homeDescription.length).toBeLessThanOrEqual(MAX_META_DESCRIPTION);
  });

  it.each(locales)('has $lang label patterns for the contextual related links', ({ json }) => {
    expect(Object.keys(json.seo.related).sort()).toEqual(['city', 'skill', 'skillCity']);
  });

  it.each(locales)('translates the $lang sitemap hub page', ({ json }) => {
    for (const key of [
      'sitemapIntro',
      'sitemapBySkill',
      'sitemapByCity',
      'sitemapBySkillCity',
      'sitemapDescription',
    ] as const) {
      expect(json.seo[key]?.length, key).toBeGreaterThan(0);
    }
    expect(json.seo.sitemapDescription!.length).toBeLessThanOrEqual(MAX_META_DESCRIPTION);
  });

  it('builds FAQPage schema from the rendered questions', () => {
    const faqs = [{ q: 'Q1', a: 'A1' }];
    const jsonLd = buildHomeFaqJsonLd(faqs, `${SITE}/`) as {
      '@type': string;
      mainEntity: Array<{ name: string }>;
    };
    expect(jsonLd['@type']).toBe('FAQPage');
    expect(jsonLd.mainEntity[0].name).toBe('Q1');
    expect(buildHomeFaqJsonLd([], `${SITE}/`)).toBeUndefined();
  });
});

describe('related links', () => {
  it('branches along both axes instead of linking one fixed set of hubs', () => {
    const sydney = buildRelatedLinks(...withSlug('nurse-sydney')).map((l) => l.slug);
    const london = buildRelatedLinks(...withSlug('nurse-london')).map((l) => l.slug);

    expect(sydney).not.toEqual(london);
    expect(sydney).toContain('nurse');
    expect(sydney).toContain('sydney');
    expect(sydney.some((s) => s.startsWith('nurse-') && s !== 'nurse-sydney')).toBe(true);
    expect(sydney).not.toContain('nurse-sydney');
  });

  it('links every page to at least four others', () => {
    for (const slug of getAllSlugs()) {
      const links = buildRelatedLinks(...withSlug(slug));
      expect(links.length, slug).toBeGreaterThanOrEqual(4);
      expect(
        links.map((l) => l.slug),
        slug,
      ).not.toContain(slug);
    }
  });
});

function withSlug(slug: string) {
  const { skill, city } = parseSlug(slug);
  return [skill, city] as const;
}
