import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import fr from './locales/fr/translation.json';
import es from './locales/es/translation.json';
import ar from './locales/ar/translation.json';
import tr from './locales/tr/translation.json';
import pt from './locales/pt/translation.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', dir: 'ltr' },
] as const;

export type SupportedLang = typeof SUPPORTED_LANGUAGES[number]['code'];

export function isRTL(lang: string): boolean {
  return lang === 'ar';
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      ar: { translation: ar },
      tr: { translation: tr },
      pt: { translation: pt },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'es', 'ar', 'tr', 'pt'],
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'cv-builder-lang',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
