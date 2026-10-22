import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { SEO_SKILL_SLUGS, SEO_CITY_SLUGS, LANGUAGES, getSitemapEntries } from './seo-routes.mjs';
import { SEO_SKILLS, SEO_CITIES } from '../src/data/seo-data';
import { buildRelatedLinks } from '../src/lib/related-links';

const config = JSON.parse(readFileSync(path.resolve(__dirname, '../../../vercel.json'), 'utf8'));
const rules = config.redirects.filter((rule: { source: string }) => rule.source.includes(':role('));

describe('retired role/city routes', () => {
  it('permanently redirects all 1,800 canonical combinations to a retained profession page', () => {
    const targets = new Set(getSitemapEntries().map((entry) => entry.path));
    let count = 0;
    for (const lang of LANGUAGES) {
      for (const role of SEO_SKILL_SLUGS) {
        for (const city of SEO_CITY_SLUGS) {
          const prefix = lang === 'en' ? '' : `/${lang}`;
          const path = `${prefix}/resume/${role}-${city}`;
          const rule = rules.find((rule: { source: string }) =>
            new RegExp(`^${rule.source.replace(/:(\w+)\(([^)]+)\)/g, '(?<$1>$2)')}$`).test(path),
          );
          expect(rule, path).toBeDefined();
          expect(rule.permanent).toBe(true);
          const target = rule.destination.replace(':lang', lang).replace(':role', role);
          expect(targets.has(target), target).toBe(true);
          expect(targets.has(path), path).toBe(false);
          count++;
        }
      }
    }
    expect(count).toBe(1800);
  });

  it('does not use a catch-all homepage rewrite for missing URLs', () => {
    expect(config.rewrites ?? []).toEqual([]);
  });

  it('links standalone guides directly to retained routes, without redirect hops', () => {
    const retained = new Set([...SEO_SKILL_SLUGS, ...SEO_CITY_SLUGS]);
    for (const [skill, city] of [
      ...SEO_SKILLS.map((skill) => [skill, null] as const),
      ...SEO_CITIES.map((city) => [null, city] as const),
    ]) {
      for (const link of buildRelatedLinks(skill, city))
        expect(retained.has(link.slug), link.slug).toBe(true);
    }
  });
});
