import type { MetadataRoute } from 'next';

// The PoC must NEVER be indexed. Production robots logic is a later milestone.
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', disallow: '/' }] };
}
