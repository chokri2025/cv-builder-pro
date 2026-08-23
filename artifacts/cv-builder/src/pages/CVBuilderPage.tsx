import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FormPanel from '../components/FormPanel';
import HomeSeoContent from '../components/HomeSeoContent';
import AtsChecker from '../components/AtsChecker';
import CVPreview from '../components/CVPreview';
import { useCV } from '../hooks/useCV';
import { useSEO } from '../hooks/useSEO';
import { useLanguage } from '../hooks/useLanguage';
import { SITE_URL } from '../lib/site';
import { buildHomeFaqJsonLd, getHomeFaqs } from '../lib/home-seo';
import type { SupportedLang } from '../i18n';

const SUPPORTED_LANG_CODES = ['en', 'fr', 'es', 'ar', 'tr', 'pt'];

export default function CVBuilderPage() {
  const cv = useCV();
  const [showPreview, setShowPreview] = useState(false);
  const location = useLocation();
  const params = useParams<{ lang?: string }>();
  const { t, i18n } = useTranslation();
  const { changeLanguage } = useLanguage();

  const urlLang = params.lang;
  // /en serves the same page as the root URL, so it canonicalizes to "/".
  const canonical = urlLang && urlLang !== 'en' ? `${SITE_URL}/${urlLang}` : `${SITE_URL}/`;

  useSEO({
    title: t('seo.homeTitle'),
    description: t('seo.homeDescription'),
    canonical,
    lang: i18n.language?.slice(0, 2) ?? 'en',
    alternateLangs: SUPPORTED_LANG_CODES.map((l) => ({
      lang: l,
      href: l === 'en' ? `${SITE_URL}/` : `${SITE_URL}/${l}`,
    })),
    image: `${SITE_URL}/opengraph.jpg`,
    siteName: 'CV Builder Pro',
    // The shell's Organization/WebSite/WebApplication graph is static in index.html;
    // the FAQ is per-locale, so it is attached here alongside the visible answers.
    jsonLd: buildHomeFaqJsonLd(getHomeFaqs(t), canonical),
  });

  useEffect(() => {
    const urlLang = params.lang;
    const supported = ['en', 'fr', 'es', 'ar', 'tr', 'pt'];
    if (urlLang && supported.includes(urlLang) && urlLang !== i18n.language?.slice(0, 2)) {
      changeLanguage(urlLang as SupportedLang);
    }
  }, [params.lang]);

  useEffect(() => {
    const state = location.state as { prefilledJobTitle?: string } | null;
    if (state?.prefilledJobTitle) {
      cv.updatePersonal('jobTitle', state.prefilledJobTitle);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  return (
    <main className="app-layout">
      <section
        className={`form-side ${showPreview ? 'hidden-mobile' : ''}`}
        aria-label={t('builder.editLabel')}
      >
        <FormPanel
          cvData={cv.cvData}
          template={cv.template}
          setTemplate={cv.setTemplate}
          saved={cv.saved}
          onSave={cv.saveToStorage}
          onClear={cv.clearCV}
          updatePersonal={cv.updatePersonal}
          updateSummary={cv.updateSummary}
          addExperience={cv.addExperience}
          updateExperience={cv.updateExperience}
          removeExperience={cv.removeExperience}
          addEducation={cv.addEducation}
          updateEducation={cv.updateEducation}
          removeEducation={cv.removeEducation}
          addSkill={cv.addSkill}
          removeSkill={cv.removeSkill}
          addLanguage={cv.addLanguage}
          updateLanguage={cv.updateLanguage}
          removeLanguage={cv.removeLanguage}
          addProject={cv.addProject}
          updateProject={cv.updateProject}
          removeProject={cv.removeProject}
        />
        <AtsChecker data={cv.cvData} />
        <HomeSeoContent langPrefix={urlLang ? `/${urlLang}` : ''} />
      </section>
      <section
        className={`preview-side ${!showPreview ? 'hidden-mobile' : ''}`}
        aria-label={t('builder.previewLabel')}
      >
        <CVPreview data={cv.cvData} template={cv.template} />
      </section>
      <button className="mobile-toggle-btn" onClick={() => setShowPreview((p) => !p)}>
        {showPreview ? t('builder.editLabel') : t('builder.previewLabel')}
      </button>
    </main>
  );
}
