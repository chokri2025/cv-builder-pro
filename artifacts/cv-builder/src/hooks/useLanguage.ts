import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useCallback } from 'react';
import { SUPPORTED_LANGUAGES, SupportedLang, isRTL } from '../i18n';

export function useLanguage() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const currentLang = (i18n.language?.slice(0, 2) ?? 'en') as SupportedLang;
  const rtl = isRTL(currentLang);

  useEffect(() => {
    const dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
    document.body.className = document.body.className
      .replace(/\brtl\b/, '')
      .replace(/\bltr\b/, '')
      .trim();
    document.body.classList.add(dir);
  }, [currentLang, rtl]);

  const changeLanguage = useCallback(
    (lang: SupportedLang) => {
      i18n.changeLanguage(lang);
      localStorage.setItem('cv-builder-lang', lang);
      const segments = location.pathname.split('/').filter(Boolean);
      if (SUPPORTED_LANGUAGES.some((locale) => locale.code === segments[0])) segments.shift();
      const pathname = '/' + [...(lang === 'en' ? [] : [lang]), ...segments].join('/');
      navigate({ pathname, search: location.search, hash: location.hash }, { state: location.state });
    },
    [i18n, location, navigate],
  );

  return {
    currentLang,
    rtl,
    changeLanguage,
    languages: SUPPORTED_LANGUAGES,
  };
}
