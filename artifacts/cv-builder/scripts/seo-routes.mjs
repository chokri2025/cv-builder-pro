/**
 * Shared enumeration of the SEO landing-page route space.
 * Used by both the sitemap generator and (in the future) a prerender step,
 * so the two can never drift apart.
 */
export const SEO_SKILL_SLUGS = [
  'software-engineer',
  'web-developer',
  'data-analyst',
  'project-manager',
  'graphic-designer',
  'marketing-manager',
  'accountant',
  'nurse',
  'teacher',
  'sales-manager',
  'ux-designer',
  'product-manager',
  'devops-engineer',
  'business-analyst',
  'hr-manager',
  'financial-analyst',
  'content-writer',
  'customer-service',
  'electrician',
  'civil-engineer',
];

export const SEO_CITY_SLUGS = [
  'new-york',
  'london',
  'paris',
  'toronto',
  'sydney',
  'berlin',
  'dubai',
  'singapore',
  'chicago',
  'san-francisco',
  'los-angeles',
  'amsterdam',
  'madrid',
  'melbourne',
  'montreal',
];

export const LANGUAGES = ['en', 'fr', 'es', 'ar', 'tr', 'pt'];
export const NON_EN_LANGS = LANGUAGES.filter((l) => l !== 'en');

export function getAllSeoSlugs() {
  const slugs = [];
  for (const skill of SEO_SKILL_SLUGS) {
    slugs.push(skill);
    for (const city of SEO_CITY_SLUGS) {
      slugs.push(`${skill}-${city}`);
    }
  }
  for (const city of SEO_CITY_SLUGS) {
    slugs.push(city);
  }
  return slugs;
}
