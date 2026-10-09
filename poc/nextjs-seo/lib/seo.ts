import type { Metadata } from 'next';
import { parseSlug } from '../../../artifacts/cv-builder/src/data/seo-data';
import { buildLocalizedSeoPageData } from '../../../artifacts/cv-builder/src/data/localized-seo-data';
import { buildLandingJsonLd } from '../../../artifacts/cv-builder/src/lib/landing-seo';

// Same locale set and URL scheme as production (scripts/seo-routes.mjs):
// English is unprefixed, every other locale is served under /<lang>.
export const LANGUAGES = ['en', 'fr', 'es', 'ar', 'tr', 'pt'] as const;
export type Language = (typeof LANGUAGES)[number];
export const NON_EN_LANGUAGES = LANGUAGES.filter((l): l is Exclude<Language, 'en'> => l !== 'en');
export const SITE_URL = 'https://www.cvbuilder-pro.online';
export const POC_SLUGS = ['teacher'] as const;

export function isLanguage(value: string): value is Language {
  return (LANGUAGES as readonly string[]).includes(value);
}

export function getDirection(lang: Language) {
  return lang === 'ar' ? 'rtl' : 'ltr';
}

export function getSeoPage(slug: string, lang: Language) {
  if (!POC_SLUGS.some((allowed) => allowed === slug)) return null;
  const { skill, city } = parseSlug(slug);
  if (!skill && !city) return null;
  return buildLocalizedSeoPageData(skill, city, lang);
}

export function getCanonicalPath(slug: string, lang: Language) {
  return lang === 'en' ? `/resume/${slug}` : `/${lang}/resume/${slug}`;
}

/** The single hreflang cluster for a slug, shared by page metadata and the sitemap so
 * the two can never disagree. Every member lists every locale, plus x-default → en. */
export function getAlternateLanguages(slug: string): Record<Language | 'x-default', string> {
  const entries = LANGUAGES.map((l) => [l, `${SITE_URL}${getCanonicalPath(slug, l)}`] as const);
  const languages = Object.fromEntries(entries) as Record<Language, string>;
  return { ...languages, 'x-default': languages.en };
}

export function getSeoMetadata(slug: string, lang: Language): Metadata {
  const data = getSeoPage(slug, lang);
  if (!data) return { robots: { index: false, follow: false } };
  const url = `${SITE_URL}${getCanonicalPath(slug, lang)}`;
  return {
    title: data.pageTitle,
    description: data.metaDescription,
    alternates: {
      canonical: url,
      languages: getAlternateLanguages(slug),
    },
    openGraph: { title: data.pageTitle, description: data.metaDescription, url, type: 'website' },
    // Preview-only; remove ONLY during approved production cutover.
    robots: { index: false, follow: false },
  };
}

export function getStructuredData(slug: string, lang: Language) {
  const data = getSeoPage(slug, lang);
  if (!data) return null;
  return buildLandingJsonLd(data, `${SITE_URL}${getCanonicalPath(slug, lang)}`, SITE_URL, lang);
}
