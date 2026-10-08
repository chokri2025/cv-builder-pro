import type { Metadata } from 'next';
import { parseSlug } from '../../../artifacts/cv-builder/src/data/seo-data';
import { buildLocalizedSeoPageData } from '../../../artifacts/cv-builder/src/data/localized-seo-data';
import { buildLandingJsonLd } from '../../../artifacts/cv-builder/src/lib/landing-seo';

export type Language = 'en' | 'fr';
export const SITE_URL = 'https://www.cvbuilder-pro.online';
export const POC_SLUGS = ['teacher'] as const;

export function getSeoPage(slug: string, lang: Language) {
  if (!POC_SLUGS.some((allowed) => allowed === slug)) return null;
  const { skill, city } = parseSlug(slug);
  if (!skill && !city) return null;
  return buildLocalizedSeoPageData(skill, city, lang);
}

export function getCanonicalPath(slug: string, lang: Language) {
  return lang === 'en' ? `/resume/${slug}` : `/fr/resume/${slug}`;
}

export function getSeoMetadata(slug: string, lang: Language): Metadata {
  const data = getSeoPage(slug, lang);
  if (!data) return { robots: { index: false, follow: false } };
  const en = `${SITE_URL}${getCanonicalPath(slug, 'en')}`;
  const fr = `${SITE_URL}${getCanonicalPath(slug, 'fr')}`;
  const url = lang === 'en' ? en : fr;
  return {
    title: data.pageTitle,
    description: data.metaDescription,
    alternates: {
      canonical: url,
      languages: { en, fr, 'x-default': en },
    },
    openGraph: { title: data.pageTitle, description: data.metaDescription, url, type: 'website' },
    // Preview-only; remove ONLY during approved production cutover.
    robots: { index: false, follow: false },
  };
}

export function getStructuredData(slug: string, lang: Language) {
  const data = getSeoPage(slug, lang);
  if (!data) return null;
  return buildLandingJsonLd(
    data,
    `${SITE_URL}${getCanonicalPath(slug, lang)}`,
    SITE_URL,
    lang,
  );
}
