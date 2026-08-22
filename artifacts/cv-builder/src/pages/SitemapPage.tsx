import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSEO } from '../hooks/useSEO';
import { useLanguage } from '../hooks/useLanguage';
import { SEO_SKILLS, SEO_CITIES } from '../data/seo-data';
import { buildSitemapSeoProps } from '../lib/sitemap-seo';
import { SITE_URL } from '../lib/site';
import type { SupportedLang } from '../i18n';

const SUPPORTED_LANG_CODES = ['en', 'fr', 'es', 'ar', 'tr', 'pt'];

export default function SitemapPage() {
  const { t } = useTranslation();
  const { lang: urlLang } = useParams<{ lang?: string }>();
  const { currentLang } = useLanguage();

  const effectiveLang: SupportedLang =
    urlLang && SUPPORTED_LANG_CODES.includes(urlLang) ? (urlLang as SupportedLang) : currentLang;
  const langPrefix = urlLang ? `/${urlLang}` : '';

  useSEO(
    buildSitemapSeoProps(
      urlLang,
      effectiveLang,
      SITE_URL,
      `${t('seo.sitemap')} – CV Builder Pro`,
      t('seo.sitemapDescription'),
    ),
  );

  return (
    <div className="seo-page">
      <nav className="seo-nav">
        <Link to={langPrefix || '/'} className="seo-nav-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              stroke="#0ea5e9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t('nav.logo')} <span className="seo-nav-pro">{t('nav.pro')}</span>
        </Link>
      </nav>

      <div className="sitemap-page">
        <h1>{t('seo.sitemap')}</h1>
        <p className="sitemap-intro">{t('seo.sitemapIntro')}</p>

        <section>
          <h2>{t('seo.sitemapBySkill')}</h2>
          <div className="sitemap-grid">
            {SEO_SKILLS.map((skill) => (
              <Link
                key={skill.slug}
                to={`${langPrefix}/resume/${skill.slug}`}
                className="sitemap-link"
              >
                {t('seo.related.skill', { skill: skill.label })}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2>{t('seo.sitemapByCity')}</h2>
          <div className="sitemap-grid">
            {SEO_CITIES.map((city) => (
              <Link
                key={city.slug}
                to={`${langPrefix}/resume/${city.slug}`}
                className="sitemap-link"
              >
                {t('seo.related.city', { city: city.label })}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2>{t('seo.sitemapBySkillCity')}</h2>
          {/* Every combination, not a sample: this page is the crawl path into the
              job × city cluster, so a partial list leaves pages discoverable only
              through the XML sitemap. */}
          <div className="sitemap-grid">
            {SEO_SKILLS.map((skill) =>
              SEO_CITIES.map((city) => (
                <Link
                  key={`${skill.slug}-${city.slug}`}
                  to={`${langPrefix}/resume/${skill.slug}-${city.slug}`}
                  className="sitemap-link"
                >
                  {t('seo.related.skillCity', { skill: skill.label, city: city.label })}
                </Link>
              )),
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
