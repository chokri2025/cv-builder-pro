import { SEO_CITIES, SEO_SKILLS, type SeoCity, type SeoSkill } from '../data/seo-data';
import { SKILL_CATEGORIES } from '../data/job-market-data';

export interface RelatedLink {
  slug: string;
  kind: 'skill' | 'city';
  skill?: string;
  city?: string;
}

/** Link only to retained standalone guides, never retired role × city pages. */
export function buildRelatedLinks(skill: SeoSkill | null, city: SeoCity | null): RelatedLink[] {
  const skills = SEO_SKILLS.filter((item) => item.slug !== skill?.slug);
  if (skill) {
    skills.sort(
      (a, b) =>
        Number(SKILL_CATEGORIES[b.slug] === SKILL_CATEGORIES[skill.slug]) -
        Number(SKILL_CATEGORIES[a.slug] === SKILL_CATEGORIES[skill.slug]),
    );
  }
  const cities = SEO_CITIES.filter((item) => item.slug !== city?.slug);
  return [
    ...(skill && city ? [{ slug: skill.slug, kind: 'skill' as const, skill: skill.label }] : []),
    ...skills
      .slice(0, 4)
      .map((item) => ({ slug: item.slug, kind: 'skill' as const, skill: item.label })),
    ...(city && skill ? [{ slug: city.slug, kind: 'city' as const, city: city.label }] : []),
    ...cities
      .slice(0, 2)
      .map((item) => ({ slug: item.slug, kind: 'city' as const, city: item.label })),
  ].slice(0, 7);
}
