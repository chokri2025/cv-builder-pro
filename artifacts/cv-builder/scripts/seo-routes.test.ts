import { describe, it, expect } from 'vitest';
import { SEO_SKILL_SLUGS, SEO_CITY_SLUGS, getAllSeoSlugs } from './seo-routes.mjs';

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
