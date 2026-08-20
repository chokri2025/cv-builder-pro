declare module '*seo-routes.mjs' {
  export const SEO_SKILL_SLUGS: string[];
  export const SEO_CITY_SLUGS: string[];
  export const LANGUAGES: readonly ['en', 'fr', 'es', 'ar', 'tr', 'pt'];
  export const NON_EN_LANGS: string[];
  export function getAllSeoSlugs(): string[];
}
