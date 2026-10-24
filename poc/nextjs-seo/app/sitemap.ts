import type { MetadataRoute } from 'next';
import { LANGUAGES, POC_SLUGS, SITE_URL, getAlternateLanguages } from '../lib/seo';

// Test fixture only. Robots disallows all preview crawling; do not submit to GSC.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/` },
    ...POC_SLUGS.flatMap((slug) => {
      const languages = getAlternateLanguages(slug);
      return LANGUAGES.map((lang) => ({ url: languages[lang], alternates: { languages } }));
    }),
  ];
}
