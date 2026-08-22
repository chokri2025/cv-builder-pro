import { getLocalFacts, pickVariant } from '../job-market-data';
import type { CvNormKey } from '../job-market-data';
import type { CopyContext, FaqEntry, MarketPhrasebook } from './types';
import { en } from './en';
import { fr } from './fr';
import { es } from './es';
import { ar } from './ar';
import { tr } from './tr';
import { pt } from './pt';

export type { CopyContext, FaqEntry, MarketPhrasebook } from './types';

type LangCode = 'en' | 'fr' | 'es' | 'ar' | 'tr' | 'pt';

export const PHRASEBOOKS: Record<LangCode, MarketPhrasebook> = { en, fr, es, ar, tr, pt };

export interface DifferentiatedCopy {
  intro: string;
  tips: string[];
  faqs: FaqEntry[];
  localTitle: string;
  localLines: string[];
}

/**
 * Turns the language-neutral facts for a (skill, city) pair into the localized
 * copy for that landing page: a rotating intro, category-specific tips, the
 * "what local employers expect" block, and page-specific FAQs.
 *
 * The variant is picked from the slug, so a given page's copy is stable across
 * builds while neighbouring pages get different phrasing on top of different facts.
 */
export function buildDifferentiatedCopy(
  lang: LangCode,
  slug: string,
  skill: { slug: string; label: string } | null,
  city: { slug: string; label: string } | null,
): DifferentiatedCopy {
  const book = PHRASEBOOKS[lang] ?? en;
  const facts = getLocalFacts(skill?.slug ?? null, city?.slug ?? null);

  const proof = facts.credential
    ? book.credentialProof(facts.credential.name, facts.credential.kind, city?.label ?? null)
    : facts.category
      ? book.categoryProof[facts.category]
      : book.genericProof;

  const lengthNormKey = facts.cvNorms.find(
    (n): n is Extract<CvNormKey, 'onePage' | 'twoPages'> => n === 'onePage' || n === 'twoPages',
  );

  const context: CopyContext = {
    skill: skill?.label ?? null,
    city: city?.label ?? null,
    sectors: facts.sectors.map((s) => book.sector[s]),
    anchors: facts.anchors,
    boards: facts.jobBoards,
    norms: facts.cvNorms.map((n) => book.norm[n]),
    lengthNorm: lengthNormKey ? book.norm[lengthNormKey] : null,
    credential: facts.credential?.name ?? null,
    credentialKind: facts.credential?.kind ?? null,
    proof,
    category: facts.category,
  };

  const variants = skill && city ? book.introSkillCity : skill ? book.introSkill : book.introCity;
  const intro = variants[pickVariant(slug, variants.length)](context);

  const baseTips = facts.category ? book.categoryTips[facts.category] : book.genericTips;
  const tips = city ? [...baseTips, book.localTip(context)] : [...baseTips];

  // Without a city there are no country facts to list, so fall back to the
  // conventions-and-evidence advice rather than showing a one-bullet block.
  const localLines = city
    ? book.localLines(context)
    : [...book.localLines(context), book.localTip(context), book.genericProof];

  return {
    intro,
    tips,
    faqs: book.faqs(context),
    localTitle: book.localTitle(context),
    localLines,
  };
}
