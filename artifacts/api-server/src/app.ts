import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

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

function getAllSeoSlugs(): string[] {
  const slugs: string[] = [];
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

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/sitemap.xml", (req: Request, res: Response) => {
  const host = req.get("x-forwarded-host") || req.get("host") || "localhost";
  const proto = req.get("x-forwarded-proto") || "https";
  const base = `${proto}://${host}`;

  const slugs = getAllSeoSlugs();
  const today = new Date().toISOString().split("T")[0];

  const urls = [
    `  <url>\n    <loc>${base}/</loc>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n    <lastmod>${today}</lastmod>\n  </url>`,
    `  <url>\n    <loc>${base}/sitemap</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.3</priority>\n  </url>`,
    ...slugs.map(
      (slug) =>
        `  <url>\n    <loc>${base}/resume/${slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n    <lastmod>${today}</lastmod>\n  </url>`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(xml);
});

app.get("/robots.txt", (req: Request, res: Response) => {
  const host = req.get("x-forwarded-host") || req.get("host") || "localhost";
  const proto = req.get("x-forwarded-proto") || "https";
  const base = `${proto}://${host}`;

  res.setHeader("Content-Type", "text/plain");
  res.send(`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
});

app.use("/api", router);

export default app;
