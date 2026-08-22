declare module '*seo-routes.mjs' {
  export const SEO_SKILL_SLUGS: string[];
  export const SEO_CITY_SLUGS: string[];
  export const LANGUAGES: readonly ['en', 'fr', 'es', 'ar', 'tr', 'pt'];
  export const NON_EN_LANGS: string[];
  export function getAllSeoSlugs(): string[];

  export interface SitemapEntry {
    path: string;
    priority: string;
    changefreq: string;
    lastmod: boolean;
    /** Language-neutral path used to build the hreflang cluster. */
    altSuffix: string;
  }

  export interface PrerenderRoute {
    kind: 'home' | 'sitemap' | 'landing';
    path: string;
    lang: 'en' | 'fr' | 'es' | 'ar' | 'tr' | 'pt';
    urlLang: string | undefined;
    slug?: string;
  }

  export function getSitemapEntries(): SitemapEntry[];
  export function getPrerenderRoutes(): PrerenderRoute[];
}
