import type { SEOProps } from '../hooks/useSEO';

const SUPPORTED_LANG_CODES = ['en', 'fr', 'es', 'ar', 'tr', 'pt'];
const SITE_NAME = 'CV Builder Pro';

/**
 * SEO props for the sitemap hub pages, shared between SitemapPage (client) and the
 * prerender script, so canonical/hreflang are computed identically for both.
 *
 * These pages list every landing page, which makes them the crawl path into the
 * cluster — they need real canonicals of their own rather than the homepage's.
 */
export function buildSitemapSeoProps(
  urlLang: string | undefined,
  effectiveLang: string,
  siteUrl: string,
  title: string,
  description: string,
): SEOProps {
  // /en/sitemap serves the same page as /sitemap, so it canonicalizes to it.
  const canonical =
    urlLang && effectiveLang !== 'en'
      ? `${siteUrl}/${effectiveLang}/sitemap`
      : `${siteUrl}/sitemap`;

  return {
    title,
    description,
    canonical,
    lang: effectiveLang,
    alternateLangs: SUPPORTED_LANG_CODES.map((l) => ({
      lang: l,
      href: l === 'en' ? `${siteUrl}/sitemap` : `${siteUrl}/${l}/sitemap`,
    })),
    image: `${siteUrl}/opengraph.jpg`,
    siteName: SITE_NAME,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${canonical}#webpage`,
      name: title,
      description,
      url: canonical,
      inLanguage: effectiveLang,
      isPartOf: { '@id': `${siteUrl}/#website` },
    },
  };
}
