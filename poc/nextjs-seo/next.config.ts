import path from 'node:path';
import type { NextConfig } from 'next';

// Imports SEO data directly from artifacts/cv-builder during the migration PoC.
const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(process.cwd(), '../..') },
};

export default nextConfig;
