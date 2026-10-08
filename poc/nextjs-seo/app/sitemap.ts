import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/seo';

// Test fixture only. Robots disallows all preview crawling; do not submit to GSC.
export default function sitemap(): MetadataRoute.Sitemap {
  const en = `${SITE_URL}/resume/teacher`;
  const fr = `${SITE_URL}/fr/resume/teacher`;
  return [
    { url: `${SITE_URL}/` },
    { url: en, alternates: { languages: { en, fr, 'x-default': en } } },
    { url: fr, alternates: { languages: { en, fr, 'x-default': en } } },
  ];
}
