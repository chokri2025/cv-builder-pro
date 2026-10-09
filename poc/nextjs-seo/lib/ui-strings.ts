import en from '../../../artifacts/cv-builder/src/locales/en/translation.json';
import fr from '../../../artifacts/cv-builder/src/locales/fr/translation.json';
import es from '../../../artifacts/cv-builder/src/locales/es/translation.json';
import ar from '../../../artifacts/cv-builder/src/locales/ar/translation.json';
import tr from '../../../artifacts/cv-builder/src/locales/tr/translation.json';
import pt from '../../../artifacts/cv-builder/src/locales/pt/translation.json';
import type { Language } from './seo';

// Landing-page UI copy comes from the production app's translations (no new copy).
const LOCALES = { en, fr, es, ar, tr, pt } satisfies Record<Language, unknown>;

export function getLandingStrings(lang: Language) {
  const seo = LOCALES[lang].seo;
  return {
    freeLabel: seo.freeLabel,
    startBuilding: seo.startBuilding,
    faqTitle: seo.faqTitle,
    tipsTitle: (skill: string | undefined, city: string | undefined) =>
      skill
        ? seo.tipsSkillTitle.replace('{{skill}}', skill)
        : seo.tipsCityTitle.replace('{{city}}', city ?? ''),
  };
}
