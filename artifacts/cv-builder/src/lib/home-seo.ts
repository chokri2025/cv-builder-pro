import type { TFunction } from 'i18next';

export interface HomeFaq {
  q: string;
  a: string;
}

/** The homepage FAQ, read from the active locale. Shared by the page and its JSON-LD. */
export function getHomeFaqs(t: TFunction): HomeFaq[] {
  const faqs = t('home.faqs', { returnObjects: true });
  return Array.isArray(faqs) ? (faqs as HomeFaq[]) : [];
}

/** FAQPage schema mirroring the questions rendered by HomeSeoContent. */
export function buildHomeFaqJsonLd(
  faqs: HomeFaq[],
  canonical: string,
): Record<string, unknown> | undefined {
  if (faqs.length === 0) return undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${canonical}#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}
