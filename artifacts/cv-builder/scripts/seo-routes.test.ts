import { describe, it, expect } from 'vitest';
import {
  SEO_SKILL_SLUGS,
  SEO_CITY_SLUGS,
  getAllSeoSlugs,
  getSitemapEntries,
  getPrerenderRoutes,
} from './seo-routes.mjs';

describe('getAllSeoSlugs', () => {
  it('produces the expected combination count', () => {
    const slugs = getAllSeoSlugs();
    const expected =
      SEO_SKILL_SLUGS.length * SEO_CITY_SLUGS.length +
      SEO_SKILL_SLUGS.length +
      SEO_CITY_SLUGS.length;
    expect(slugs).toHaveLength(expected);
  });

  it('contains no duplicate slugs', () => {
    const slugs = getAllSeoSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('sitemap and prerender route parity', () => {
  it('prerenders every URL the sitemap advertises', () => {
    const prerendered = new Set(getPrerenderRoutes().map((r) => r.path));
    const missing = getSitemapEntries()
      .map((e) => e.path)
      .filter((p) => !prerendered.has(p));

    // A sitemap URL without a prerendered file falls through to the SPA rewrite,
    // which serves the homepage HTML — homepage canonical included — so the URL
    // reads to a crawler as a duplicate of the homepage.
    expect(missing).toEqual([]);
  });

  it('advertises no duplicate URLs', () => {
    const paths = getSitemapEntries().map((e) => e.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('writes no duplicate prerender targets', () => {
    const paths = getPrerenderRoutes().map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('covers the hub pages in every locale', () => {
    const sitemapRoutes = getPrerenderRoutes().filter((r) => r.kind === 'sitemap');
    expect(sitemapRoutes.map((r) => r.path)).toEqual(
      expect.arrayContaining([
        '/sitemap',
        '/en/sitemap',
        '/fr/sitemap',
        '/es/sitemap',
        '/ar/sitemap',
        '/tr/sitemap',
        '/pt/sitemap',
      ]),
    );
  });

  it('gives every sitemap entry an hreflang cluster suffix', () => {
    for (const entry of getSitemapEntries()) {
      expect(typeof entry.altSuffix).toBe('string');
      expect(entry.priority).toMatch(/^[01](\.\d)?$/);
    }
  });
});
