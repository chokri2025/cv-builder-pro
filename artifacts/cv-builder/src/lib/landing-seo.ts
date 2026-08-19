import type { SeoPageData } from '../data/seo-data';
import type { SEOProps } from '../hooks/useSEO';

const SUPPORTED_LANG_CODES = ['en', 'fr', 'es', 'ar', 'tr', 'pt'];

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
  const canonical = urlLang
    ? `${canonicalBase}/${effectiveLang}/resume/${slug}`
    : `${canonicalBase}/resume/${slug}`;

  return {
    title: page.pageTitle,
    description: page.metaDescription,
    canonical,
    lang: effectiveLang,
    alternateLangs: SUPPORTED_LANG_CODES.map((l) => ({
      lang: l,
      href: `${canonicalBase}/${l}/resume/${slug}`,
    })),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.pageTitle,
      description: page.metaDescription,
      url: canonical,
      inLanguage: effectiveLang,
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'CV Builder Pro', item: canonicalBase },
          { '@type': 'ListItem', position: 2, name: page.h1, item: canonical },
        ],
      },
    },
  };
}
