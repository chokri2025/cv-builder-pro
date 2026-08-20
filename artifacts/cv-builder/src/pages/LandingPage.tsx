import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSEO } from '../hooks/useSEO';
import { useLanguage } from '../hooks/useLanguage';
import { parseSlug } from '../data/seo-data';
import { buildLocalizedSeoPageData } from '../data/localized-seo-data';
import { buildLandingSeoProps } from '../lib/landing-seo';
import { SITE_URL } from '../lib/site';
import type { SupportedLang } from '../i18n';

const SUPPORTED_LANG_CODES = ['en', 'fr', 'es', 'ar', 'tr', 'pt'];

export default function LandingPage() {
  const { slug, lang: urlLang } = useParams<{ slug: string; lang?: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentLang } = useLanguage();

  const effectiveLang: SupportedLang =
    urlLang && SUPPORTED_LANG_CODES.includes(urlLang) ? (urlLang as SupportedLang) : currentLang;

  const { skill, city } = parseSlug(slug ?? '');
  const page = buildLocalizedSeoPageData(skill, city, effectiveLang);

  useSEO(buildLandingSeoProps(page, slug ?? '', urlLang, effectiveLang, SITE_URL));

  const handleStart = () => {
    const target = urlLang ? `/${urlLang}` : '/';
    navigate(target, { state: { prefilledJobTitle: page.prefilledJobTitle } });
  };

  if (!skill && !city) {
    return (
      <div className="seo-not-found">
        <div className="seo-not-found-inner">
          <h1>{t('seo.notFound')}</h1>
          <p>
            {t('seo.notFoundDesc')} <Link to="/">{t('seo.notFoundLink')}</Link>.
          </p>
        </div>
      </div>
    );
  }

  const langPrefix = urlLang ? `/${urlLang}` : '';

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
        <button className="seo-nav-cta" onClick={handleStart}>
          {t('nav.buildCta')}
        </button>
      </nav>

      <header className="seo-hero">
        <div className="seo-hero-inner">
          <div className="seo-badges">
            {skill && <span className="seo-badge">{skill.label}</span>}
            {city && <span className="seo-badge">{city.label}</span>}
            <span className="seo-badge seo-badge-free">{t('seo.freeLabel')}</span>
          </div>
          <h1 className="seo-h1">{page.h1}</h1>
          <p className="seo-h2">{page.h2}</p>
          <p className="seo-intro">{page.intro}</p>
          <div className="seo-cta-row">
            <button className="seo-cta-primary" onClick={handleStart}>
              {t('seo.startBuilding')}
            </button>
            <div className="seo-stats">
              <span>{t('seo.readyIn')}</span>
              <span>{t('seo.pdfDownload')}</span>
              <span>{t('seo.templates')}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="seo-tips-section">
        <div className="seo-section-inner">
          <h2 className="seo-section-title">
            {skill
              ? t('seo.tipsSkillTitle', { skill: skill.label })
              : t('seo.tipsCityTitle', { city: city?.label })}
          </h2>
          <ul className="seo-tips-list">
            {page.tips.map((tip, i) => (
              <li key={i} className="seo-tip-item">
                <span className="seo-tip-num">{i + 1}</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="seo-how-section">
        <div className="seo-section-inner">
          <h2 className="seo-section-title">{t('seo.howItWorks')}</h2>
          <div className="seo-steps">
            <div className="seo-step">
              <div className="seo-step-icon">1</div>
              <h3>{t('seo.step1Title')}</h3>
              <p>{t('seo.step1Desc')}</p>
            </div>
            <div className="seo-step">
              <div className="seo-step-icon">2</div>
              <h3>{t('seo.step2Title')}</h3>
              <p>{t('seo.step2Desc')}</p>
            </div>
            <div className="seo-step">
              <div className="seo-step-icon">3</div>
              <h3>{t('seo.step3Title')}</h3>
              <p>{t('seo.step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="seo-faq-section">
        <div className="seo-section-inner">
          <h2 className="seo-section-title">{t('seo.faqTitle')}</h2>
          <div className="seo-faqs">
            {page.faqs.map((faq, i) => (
              <details key={i} className="seo-faq-item">
                <summary className="seo-faq-q">{faq.q}</summary>
                <p className="seo-faq-a">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="seo-related-section">
        <div className="seo-section-inner">
          <h2 className="seo-section-title">{t('seo.relatedTitle')}</h2>
          <div className="seo-related-links">
            {skill ? (
              <>
                <Link to={`${langPrefix}/resume/new-york`} className="seo-related-link">
                  {t('seo.related.newYork')}
                </Link>
                <Link to={`${langPrefix}/resume/london`} className="seo-related-link">
                  {t('seo.related.london')}
                </Link>
                <Link to={`${langPrefix}/resume/toronto`} className="seo-related-link">
                  {t('seo.related.toronto')}
                </Link>
                <Link to={`${langPrefix}/resume/sydney`} className="seo-related-link">
                  {t('seo.related.sydney')}
                </Link>
              </>
            ) : (
              <>
                <Link to={`${langPrefix}/resume/software-engineer`} className="seo-related-link">
                  {t('seo.related.softwareEngineer')}
                </Link>
                <Link to={`${langPrefix}/resume/nurse`} className="seo-related-link">
                  {t('seo.related.nurse')}
                </Link>
                <Link to={`${langPrefix}/resume/teacher`} className="seo-related-link">
                  {t('seo.related.teacher')}
                </Link>
                <Link to={`${langPrefix}/resume/project-manager`} className="seo-related-link">
                  {t('seo.related.projectManager')}
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="seo-footer">
        <div className="seo-footer-inner">
          <Link to={langPrefix || '/'} className="seo-footer-logo">
            {t('nav.logo')} {t('nav.pro')}
          </Link>
          <p>{t('seo.footerTagline')}</p>
          <div className="seo-footer-links">
            <Link to={langPrefix || '/'}>{t('seo.home')}</Link>
            <Link to={`${langPrefix}/sitemap`}>{t('seo.sitemap')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
