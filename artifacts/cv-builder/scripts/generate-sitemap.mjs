import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SEO_SKILL_SLUGS = [
  'software-engineer','web-developer','data-analyst','project-manager',
  'graphic-designer','marketing-manager','accountant','nurse','teacher',
  'sales-manager','ux-designer','product-manager','devops-engineer',
  'business-analyst','hr-manager','financial-analyst','content-writer',
  'customer-service','electrician','civil-engineer',
];

const SEO_CITY_SLUGS = [
  'new-york','london','paris','toronto','sydney','berlin','dubai',
  'singapore','chicago','san-francisco','los-angeles','amsterdam',
  'madrid','melbourne','montreal',
];

function getAllSeoSlugs() {
  const slugs = [];
  for (const skill of SEO_SKILL_SLUGS) {
    slugs.push(skill);
    for (const city of SEO_CITY_SLUGS) {
      slugs.push(`${skill}-${city}`);
    }
  }
  for (const city of SEO_CITY_SLUGS) {
    slugs.push(city);
  }
  return slugs;
}

const appUrl = process.env.VITE_APP_URL || process.env.APP_URL || '';
if (!appUrl) {
  console.warn('[sitemap] WARNING: VITE_APP_URL not set — sitemap URLs will be relative.');
}

const base = appUrl.replace(/\/$/, '');
const slugs = getAllSeoSlugs();
const today = new Date().toISOString().split('T')[0];

const urls = [
  `  <url>\n    <loc>${base}/</loc>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n    <lastmod>${today}</lastmod>\n  </url>`,
  `  <url>\n    <loc>${base}/sitemap</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.3</priority>\n  </url>`,
  ...slugs.map(slug =>
    `  <url>\n    <loc>${base}/resume/${slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n    <lastmod>${today}</lastmod>\n  </url>`
  ),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

const outDir = path.resolve(__dirname, '../dist/public');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml, 'utf8');

const robots = `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`;
fs.writeFileSync(path.join(outDir, 'robots.txt'), robots, 'utf8');

console.log(`[sitemap] Generated sitemap.xml with ${slugs.length + 2} URLs (base: ${base || '(empty)'})`);
