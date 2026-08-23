import { SEO_CITIES, SEO_SKILLS, buildSlug, type SeoCity, type SeoSkill } from '../data/seo-data';
import { SKILL_CATEGORIES } from '../data/job-market-data';

export interface RelatedLink {
  /** Slug of the target landing page, e.g. "nurse-london". */
  slug: string;
  /** Which translated label pattern to render. */
  kind: 'skillCity' | 'skill' | 'city';
  skill?: string;
  city?: string;
}

const MAX_LINKS = 7;

/** Cities used when a page has no city of its own to branch out from. */
const HUB_CITY_SLUGS = ['new-york', 'london', 'toronto', 'sydney'];

function link(skill: SeoSkill | null, city: SeoCity | null): RelatedLink {
  return {
    slug: buildSlug(skill, city),
    kind: skill && city ? 'skillCity' : skill ? 'skill' : 'city',
    skill: skill?.label,
    city: city?.label,
  };
}

/**
 * Contextual internal links for a landing page.
 *
 * Every page previously linked to the same four hub pages, which left most of the
 * job × city combinations reachable only from the sitemap. These links branch along
 * both axes instead — the same role in other cities, other roles in the same city,
 * and the two parent pages — so each page sits in a connected cluster.
 */
export function buildRelatedLinks(skill: SeoSkill | null, city: SeoCity | null): RelatedLink[] {
  const links: RelatedLink[] = [];

  if (skill && city) {
    // Same role, other cities — start from the page's own position so neighbouring
    // pages point at different siblings rather than all at the first few cities.
    const start = SEO_CITIES.findIndex((c) => c.slug === city.slug);
    for (let i = 1; i <= 3; i += 1) {
      links.push(link(skill, SEO_CITIES[(start + i) % SEO_CITIES.length]));
    }

    // Other roles in the same city, preferring the same job family.
    const sameFamily = SEO_SKILLS.filter(
      (s) => s.slug !== skill.slug && SKILL_CATEGORIES[s.slug] === SKILL_CATEGORIES[skill.slug],
    );
    const otherSkills =
      sameFamily.length > 0 ? sameFamily : SEO_SKILLS.filter((s) => s.slug !== skill.slug);
    const skillStart = SEO_SKILLS.findIndex((s) => s.slug === skill.slug);
    for (let i = 0; i < 2 && i < otherSkills.length; i += 1) {
      links.push(link(otherSkills[(skillStart + i) % otherSkills.length], city));
    }

    // The two parent pages this combination belongs to.
    links.push(link(skill, null), link(null, city));
  } else if (skill) {
    for (const slug of HUB_CITY_SLUGS) {
      const hub = SEO_CITIES.find((c) => c.slug === slug);
      if (hub) links.push(link(skill, hub));
    }
    const sameFamily = SEO_SKILLS.filter(
      (s) => s.slug !== skill.slug && SKILL_CATEGORIES[s.slug] === SKILL_CATEGORIES[skill.slug],
    ).slice(0, 2);
    sameFamily.forEach((s) => links.push(link(s, null)));
  } else if (city) {
    const cityStart = SEO_CITIES.findIndex((c) => c.slug === city.slug);
    for (let i = 0; i < 5; i += 1) {
      links.push(link(SEO_SKILLS[(cityStart * 3 + i) % SEO_SKILLS.length], city));
    }
    for (let i = 1; i <= 2; i += 1) {
      links.push(link(null, SEO_CITIES[(cityStart + i) % SEO_CITIES.length]));
    }
  }

  return links.slice(0, MAX_LINKS);
}
