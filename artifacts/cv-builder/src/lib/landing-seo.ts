import type { SeoPageData } from '../data/seo-data';
import type { SEOProps } from '../hooks/useSEO';

const SUPPORTED_LANG_CODES = ['en', 'fr', 'es', 'ar', 'tr', 'pt'];
const SITE_NAME = 'CV Builder Pro';

/** Builds the SEO props for a landing page route, shared between the LandingPage
 * component (client) and the prerender script (build-time), so canonical/hreflang/
 * JSON-LD are always computed identically for a given (page, slug, lang) input. */
export function buildLandingSeoProps(
  page: SeoPageData,
  slug: string,
  urlLang: string | undefined,
  effectiveLang: string,
  siteUrl: string,
): SEOProps {
  const canonicalBase = siteUrl;
  const canonical =
    urlLang && effectiveLang !== 'en'
      ? `${canonicalBase}/${effectiveLang}/resume/${slug}`
      : `${canonicalBase}/resume/${slug}`;

  return {
    title: page.pageTitle,
    description: page.metaDescription,
    canonical,
    lang: effectiveLang,
    alternateLangs: SUPPORTED_LANG_CODES.map((l) => ({
      lang: l,
      // English is served from the unprefixed path; only other locales are prefixed.
      href: l === 'en' ? `${canonicalBase}/resume/${slug}` : `${canonicalBase}/${l}/resume/${slug}`,
    })),
    image: `${canonicalBase}/opengraph.jpg`,
    siteName: SITE_NAME,
    jsonLd: buildLandingJsonLd(page, canonical, canonicalBase, effectiveLang),
  };
}

/**
 * One `@graph` per landing page covering the four things search engines and AI
 * answer engines look for here: the page itself, its place in the site, the
 * questions it answers (FAQPage — the answers are page-specific, so they are safe
 * to mark up), and the free tool the page is about.
 */
export function buildLandingJsonLd(
  page: SeoPageData,
  canonical: string,
  siteUrl: string,
  lang: string,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        name: page.pageTitle,
        description: page.metaDescription,
        url: canonical,
        inLanguage: lang,
        isPartOf: { '@id': `${siteUrl}/#website` },
        primaryImageOfPage: { '@id': `${siteUrl}/#logo` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        about: { '@id': `${siteUrl}/#webapp` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: siteUrl },
          { '@type': 'ListItem', position: 2, name: page.h1, item: canonical },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        inLanguage: lang,
        mainEntity: page.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      },
      {
        '@type': 'WebApplication',
        '@id': `${siteUrl}/#webapp`,
        name: SITE_NAME,
        url: `${siteUrl}/`,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
    ],
  };
}
