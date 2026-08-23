import type { SEOProps } from '../hooks/useSEO';

const SUPPORTED_LANG_CODES = ['en', 'fr', 'es', 'ar', 'tr', 'pt'];
const SITE_NAME = 'CV Builder Pro';

/** Path of the Europass guide for a locale; English serves it unprefixed. */
export function europassPath(lang: string): string {
  return lang === 'en' ? '/europass-cv' : `/${lang}/europass-cv`;
}

export interface EuropassSeoContent {
  title: string;
  description: string;
  h1: string;
  intro: string;
  faqs: Array<{ q: string; a: string }>;
  steps: string[];
  stepsTitle: string;
}

/**
 * SEO props for the Europass guide, shared between the page component and the
 * prerender so canonical, hreflang and JSON-LD cannot drift.
 *
 * The graph carries a `HowTo` as well as the usual `WebPage`/`FAQPage` pair: the
 * page genuinely describes a three-step procedure, and that is the shape an
 * answer engine can lift directly.
 */
export function buildEuropassSeoProps(
  urlLang: string | undefined,
  effectiveLang: string,
  siteUrl: string,
  content: EuropassSeoContent,
): SEOProps {
  const canonical =
    urlLang && effectiveLang !== 'en'
      ? `${siteUrl}${europassPath(effectiveLang)}`
      : `${siteUrl}/europass-cv`;

  return {
    title: content.title,
    description: content.description,
    canonical,
    lang: effectiveLang,
    alternateLangs: SUPPORTED_LANG_CODES.map((l) => ({
      lang: l,
      href: `${siteUrl}${europassPath(l)}`,
    })),
    image: `${siteUrl}/opengraph.jpg`,
    siteName: SITE_NAME,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${canonical}#webpage`,
          name: content.title,
          description: content.description,
          url: canonical,
          inLanguage: effectiveLang,
          isPartOf: { '@id': `${siteUrl}/#website` },
          about: { '@id': `${siteUrl}/#webapp` },
          breadcrumb: { '@id': `${canonical}#breadcrumb` },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonical}#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: SITE_NAME, item: siteUrl },
            { '@type': 'ListItem', position: 2, name: content.h1, item: canonical },
          ],
        },
        {
          '@type': 'HowTo',
          '@id': `${canonical}#howto`,
          name: content.stepsTitle,
          inLanguage: effectiveLang,
          totalTime: 'PT10M',
          step: content.steps.map((text, i) => ({
            '@type': 'HowToStep',
            position: i + 1,
            text,
          })),
        },
        {
          '@type': 'FAQPage',
          '@id': `${canonical}#faq`,
          inLanguage: effectiveLang,
          mainEntity: content.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
          })),
        },
      ],
    },
  };
}
