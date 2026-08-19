import { useTranslation } from 'react-i18next';
import { useEffect, useCallback } from 'react';
import { SUPPORTED_LANGUAGES, SupportedLang, isRTL } from '../i18n';

export function useLanguage() {
  const { i18n } = useTranslation();

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
    },
    [i18n],
  );

  return {
    currentLang,
    rtl,
    changeLanguage,
    languages: SUPPORTED_LANGUAGES,
  };
}
