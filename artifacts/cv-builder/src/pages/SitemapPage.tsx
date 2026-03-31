import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSEO } from '../hooks/useSEO';
import { SEO_SKILLS, SEO_CITIES } from '../data/seo-data';

export default function SitemapPage() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const langPrefix = lang ? `/${lang}` : '';

  useSEO({
    title: `${t('seo.sitemap')} – CV Builder Pro`,
    description: 'Browse all CV builder landing pages by skill and city.',
  });

  return (
    <div className="seo-page">
      <nav className="seo-nav">
        <Link to={langPrefix || '/'} className="seo-nav-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('nav.logo')} <span className="seo-nav-pro">{t('nav.pro')}</span>
        </Link>
      </nav>

      <div className="sitemap-page">
        <h1>{t('seo.sitemap')}</h1>
        <p className="sitemap-intro">All CV builder pages, organized by skill and city.</p>

        <section>
          <h2>CV Builder by Skill</h2>
          <div className="sitemap-grid">
            {SEO_SKILLS.map(skill => (
              <Link key={skill.slug} to={`${langPrefix}/resume/${skill.slug}`} className="sitemap-link">
                {skill.label} CV Builder
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2>CV Builder by City</h2>
          <div className="sitemap-grid">
            {SEO_CITIES.map(city => (
              <Link key={city.slug} to={`${langPrefix}/resume/${city.slug}`} className="sitemap-link">
                CV Builder – {city.label}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2>CV Builder by Skill &amp; City</h2>
          <div className="sitemap-grid">
            {SEO_SKILLS.slice(0, 8).map(skill =>
              SEO_CITIES.slice(0, 8).map(city => (
                <Link
                  key={`${skill.slug}-${city.slug}`}
                  to={`${langPrefix}/resume/${skill.slug}-${city.slug}`}
                  className="sitemap-link"
                >
                  {skill.label} CV – {city.label}
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
