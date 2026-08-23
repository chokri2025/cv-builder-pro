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

/**
 * Every URL the sitemap advertises, with its crawl metadata.
 *
 * `altSuffix` is the language-neutral path used to build the hreflang cluster:
 * English serves it unprefixed, other locales serve it under /<lang>.
 */
export function getSitemapEntries() {
  const slugs = getAllSeoSlugs();

  return [
    { path: '/', priority: '1.0', changefreq: 'weekly', lastmod: true, altSuffix: '' },
    {
      path: '/sitemap',
      priority: '0.5',
      changefreq: 'monthly',
      lastmod: false,
      altSuffix: '/sitemap',
    },

    // English homepage and sitemap are the unprefixed paths above; /en canonicalizes
    // to them, so only the other locales get their own entries.
    ...NON_EN_LANGS.map((lang) => ({
      path: `/${lang}`,
      priority: '0.9',
      changefreq: 'weekly',
      lastmod: true,
      altSuffix: '',
    })),
    ...NON_EN_LANGS.map((lang) => ({
      path: `/${lang}/sitemap`,
      priority: '0.5',
      changefreq: 'monthly',
      lastmod: false,
      altSuffix: '/sitemap',
    })),

    // Europass is asked for by name across EU public-sector and academic
    // recruitment, so the guide gets one page per locale.
    {
      path: '/europass-cv',
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: true,
      altSuffix: '/europass-cv',
    },
    ...NON_EN_LANGS.map((lang) => ({
      path: `/${lang}/europass-cv`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: true,
      altSuffix: '/europass-cv',
    })),

    ...slugs.map((slug) => ({
      path: `/resume/${slug}`,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: true,
      altSuffix: `/resume/${slug}`,
    })),
    ...NON_EN_LANGS.flatMap((lang) =>
      slugs.map((slug) => ({
        path: `/${lang}/resume/${slug}`,
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: true,
        altSuffix: `/resume/${slug}`,
      })),
    ),
  ];
}

/**
 * Every route the build prerenders to static HTML.
 *
 * This must cover every sitemap entry: anything advertised in the sitemap but not
 * prerendered falls through to the SPA rewrite, which serves the homepage HTML —
 * homepage canonical included — so the URL reads as a duplicate of the homepage.
 * `seo-routes.test.ts` asserts the two lists stay in agreement.
 */
export function getPrerenderRoutes() {
  const slugs = getAllSeoSlugs();

  const home = [
    { kind: 'home', path: '/', lang: 'en', urlLang: undefined },
    ...LANGUAGES.map((lang) => ({ kind: 'home', path: `/${lang}`, lang, urlLang: lang })),
  ];

  const sitemap = [
    { kind: 'sitemap', path: '/sitemap', lang: 'en', urlLang: undefined },
    ...LANGUAGES.map((lang) => ({
      kind: 'sitemap',
      path: `/${lang}/sitemap`,
      lang,
      urlLang: lang,
    })),
  ];

  const europass = [
    { kind: 'europass', path: '/europass-cv', lang: 'en', urlLang: undefined },
    ...LANGUAGES.map((lang) => ({
      kind: 'europass',
      path: `/${lang}/europass-cv`,
      lang,
      urlLang: lang,
    })),
  ];

  const landing = [
    ...slugs.map((slug) => ({
      kind: 'landing',
      path: `/resume/${slug}`,
      lang: 'en',
      urlLang: undefined,
      slug,
    })),
    ...NON_EN_LANGS.flatMap((lang) =>
      slugs.map((slug) => ({
        kind: 'landing',
        path: `/${lang}/resume/${slug}`,
        lang,
        urlLang: lang,
        slug,
      })),
    ),
  ];

  return [...home, ...sitemap, ...europass, ...landing];
}
