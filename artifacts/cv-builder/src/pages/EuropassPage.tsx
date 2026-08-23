import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSEO } from '../hooks/useSEO';
import { useLanguage } from '../hooks/useLanguage';
import { buildEuropassSeoProps } from '../lib/europass-seo';
import { SITE_URL } from '../lib/site';
import { SEO_SKILLS } from '../data/seo-data';
import type { SupportedLang } from '../i18n';

const SUPPORTED_LANG_CODES = ['en', 'fr', 'es', 'ar', 'tr', 'pt'];
/** Guides linked from the foot of the page, back into the job × city cluster. */
const RELATED_SKILLS = ['nurse', 'teacher', 'software-engineer', 'accountant'];

interface Faq {
  q: string;
  a: string;
}

interface CefrLevel {
  level: string;
  description: string;
}

/**
 * The Europass guide.
 *
 * Europass is asked for by name across EU public-sector, academic and mobility
 * recruitment, which makes it a query in its own right in every language this
 * site serves. The page answers what the format is, who requires it, what it
 * contains and how to state language ability on the CEFR scale — the part
 * employers actually compare — and hands over to the builder with the Europass
 * template already selected.
 */
export default function EuropassPage() {
  const { t } = useTranslation();
  const { lang: urlLang } = useParams<{ lang?: string }>();
  const { currentLang } = useLanguage();
  const navigate = useNavigate();

  const effectiveLang: SupportedLang =
    urlLang && SUPPORTED_LANG_CODES.includes(urlLang) ? (urlLang as SupportedLang) : currentLang;
  const langPrefix = urlLang ? `/${urlLang}` : '';

  const sections = t('europass.sections', { returnObjects: true }) as unknown as string[];
  const steps = t('europass.steps', { returnObjects: true }) as unknown as string[];
  const faqs = t('europass.faqs', { returnObjects: true }) as unknown as Faq[];
  const cefr = t('europass.cefr', { returnObjects: true }) as unknown as CefrLevel[];

  useSEO(
    buildEuropassSeoProps(urlLang, effectiveLang, SITE_URL, {
      title: t('europass.title'),
      description: t('europass.description'),
      h1: t('europass.h1'),
      intro: t('europass.intro'),
      stepsTitle: t('europass.stepsTitle'),
      steps: Array.isArray(steps) ? steps : [],
      faqs: Array.isArray(faqs) ? faqs : [],
    }),
  );

  /** Opens the builder with the Europass template already applied. */
  const handleStart = () => {
    navigate(langPrefix || '/', { state: { template: 'europass' } });
  };

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
          {t('europass.cta')}
        </button>
      </nav>

      <header className="seo-hero">
        <div className="seo-hero-inner">
          <div className="seo-badges">
            <span className="seo-badge">Europass</span>
            <span className="seo-badge seo-badge-free">{t('seo.freeLabel')}</span>
          </div>
          <h1 className="seo-h1">{t('europass.h1')}</h1>
          <p className="seo-h2">{t('europass.h2')}</p>
          <p className="seo-intro">{t('europass.intro')}</p>
          <div className="seo-cta-row">
            <button className="seo-cta-primary" onClick={handleStart}>
              {t('europass.cta')}
            </button>
            <div className="seo-stats">
              <span>{t('seo.readyIn')}</span>
              <span>{t('seo.pdfDownload')}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="seo-local-section">
        <div className="seo-section-inner">
          <h2 className="seo-section-title">{t('europass.whoTitle')}</h2>
          <p className="seo-europass-body">{t('europass.whoBody')}</p>
        </div>
      </section>

      <section className="seo-tips-section">
        <div className="seo-section-inner">
          <h2 className="seo-section-title">{t('europass.sectionsTitle')}</h2>
          <ul className="seo-tips-list">
            {(Array.isArray(sections) ? sections : []).map((item, i) => (
              <li key={i} className="seo-tip-item">
                <span className="seo-tip-num">{i + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="seo-local-section">
        <div className="seo-section-inner">
          <h2 className="seo-section-title">{t('europass.cefrTitle')}</h2>
          <p className="seo-europass-body">{t('europass.cefrIntro')}</p>
          <dl className="seo-cefr-list">
            {(Array.isArray(cefr) ? cefr : []).map((entry) => (
              <div key={entry.level} className="seo-cefr-row">
                <dt>{entry.level}</dt>
                <dd>{entry.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="seo-how-section">
        <div className="seo-section-inner">
          <h2 className="seo-section-title">{t('europass.stepsTitle')}</h2>
          <div className="seo-steps">
            {(Array.isArray(steps) ? steps : []).map((step, i) => (
              <div key={i} className="seo-step">
                <div className="seo-step-icon">{i + 1}</div>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="seo-faq-section">
        <div className="seo-section-inner">
          <h2 className="seo-section-title">{t('europass.faqTitle')}</h2>
          <div className="seo-faqs">
            {(Array.isArray(faqs) ? faqs : []).map((faq, i) => (
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
          <h2 className="seo-section-title">{t('europass.relatedTitle')}</h2>
          <div className="seo-related-links">
            {RELATED_SKILLS.map((slug) => {
              const skill = SEO_SKILLS.find((s) => s.slug === slug);
              if (!skill) return null;
              return (
                <Link key={slug} to={`${langPrefix}/resume/${slug}`} className="seo-related-link">
                  {t('seo.related.skill', { skill: skill.label })}
                </Link>
              );
            })}
            <Link to={`${langPrefix}/sitemap`} className="seo-related-link">
              {t('seo.sitemap')}
            </Link>
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
