import type { SEOProps } from '../hooks/useSEO';
import { SITE_URL } from './site';

// The search workspace starts empty and uses the visitor's locally stored CV.
// Keep it available without advertising an empty result page in search.
export function buildJobsSeoProps(urlLang?: string): SEOProps {
  return {
    title: 'Job Discovery – CV Builder Pro',
    description: 'Search job offers, compare them with your CV and track applications.',
    canonical: `${SITE_URL}${urlLang && urlLang !== 'en' ? `/${urlLang}` : ''}/jobs`,
    robots: 'noindex, follow',
  };
}
