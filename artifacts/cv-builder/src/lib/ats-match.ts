import type { CVData } from '../types/cv';
import { stopwordsFor } from './stopwords';

/**
 * Compares a CV against one job advert.
 *
 * This is deliberately *not* an "ATS score" in the abstract: no tool can predict
 * how a particular employer's system ranks a candidate. What it measures is
 * concrete and checkable — how much of the vocabulary this advert leans on
 * actually appears in the CV, plus the structural details a parser needs to read
 * a CV at all. Both are things the applicant can act on.
 */

export interface Keyword {
  /** The term as it should read to the user, taken from the advert. */
  term: string;
  /** Relative importance, derived from how often and how specifically it appears. */
  weight: number;
  /** 1 = present in the CV, 0.5 = phrase split across the CV, 0 = absent. */
  match: number;
}

export type CheckId =
  | 'email'
  | 'phone'
  | 'jobTitle'
  | 'summary'
  | 'experienceDates'
  | 'skills'
  | 'education';

export interface StructuralCheck {
  id: CheckId;
  ok: boolean;
}

export interface AtsResult {
  /** 0–100 coverage of the advert's weighted vocabulary. */
  score: number;
  matched: Keyword[];
  missing: Keyword[];
  checks: StructuralCheck[];
  /** True when the advert was too short to draw conclusions from. */
  tooShort: boolean;
}

const MIN_AD_WORDS = 20;
const MAX_KEYWORDS = 20;
const MIN_TOKEN_LENGTH = 3;
/** Below this length a prefix match produces noise ("art" ⊂ "article"). */
const MIN_PREFIX_LENGTH = 6;

/** Arabic combining marks: harakat, hamza forms, dagger alef, tatweel. */
const ARABIC_MARKS = /[\u064B-\u065F\u0670\u0640]/g;

/**
 * Folds text to a comparable form: lowercase, no diacritics, no punctuation.
 *
 * Arabic gets an extra pass — the same word is written with different alef and
 * yaa forms depending on the writer, so those are unified before comparing.
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(ARABIC_MARKS, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}+#]+/gu, ' ')
    .trim();
}

export function tokenize(text: string): string[] {
  return normalize(text).split(' ').filter(Boolean);
}

/** Punctuation and list markers that end a phrase, whatever the language. */
const SEGMENT_BOUNDARY = /[.,;:!?()[\]{}"“”'’/\\|\n\r•·–—]+/;

/**
 * Splits an advert into the runs of words that can form a phrase.
 *
 * Normalizing first would erase punctuation, and two words either side of a comma
 * are not a phrase: "post-operative monitoring, triage" must not become the term
 * "monitoring triage", which would also hide the real keyword "triage".
 */
export function segments(text: string): string[][] {
  return text
    .split(SEGMENT_BOUNDARY)
    .map((segment) => tokenize(segment))
    .filter((tokens) => tokens.length > 0);
}

/** Strips a trailing plural "s" so "nurses" and "nurse" compare equal. */
function singularize(token: string): string {
  return token.length > 4 && token.endsWith('s') ? token.slice(0, -1) : token;
}

/**
 * Pulls the terms that carry the advert's meaning, weighted by significance.
 *
 * Two-word phrases score double: "intensive care" and "project management" say
 * far more about a role than "care" or "management" on their own. A single word
 * already covered by a stronger phrase is dropped, so the list does not show the
 * user "care" and "intensive care" as two separate things to fix.
 */
export function extractKeywords(jobAd: string, lang: string): Array<Omit<Keyword, 'match'>> {
  const stopwords = stopwordsFor(lang);
  const tokens = tokenize(jobAd);

  const isContentWord = (token: string) =>
    token.length >= MIN_TOKEN_LENGTH && !stopwords.has(token) && !/^\d+$/.test(token);

  const unigrams = new Map<string, number>();
  const bigrams = new Map<string, number>();

  for (const token of tokens) {
    if (isContentWord(token)) unigrams.set(token, (unigrams.get(token) ?? 0) + 1);
  }

  for (const segment of segments(jobAd)) {
    segment.forEach((token, i) => {
      const next = segment[i + 1];
      if (next && isContentWord(token) && isContentWord(next)) {
        const phrase = `${token} ${next}`;
        bigrams.set(phrase, (bigrams.get(phrase) ?? 0) + 1);
      }
    });
  }

  const scoredPhrases = [...bigrams]
    .map(([term, count]) => ({ term, weight: count * 2 }))
    .sort((a, b) => b.weight - a.weight || a.term.localeCompare(b.term))
    .slice(0, MAX_KEYWORDS);

  // Coverage is decided from every phrase that can make the list, not only the
  // ones ranked above the word itself: otherwise a frequent word like "care"
  // outranks "intensive care" and both end up shown, which reads as two separate
  // things to fix when it is one.
  const coveredByPhrase = new Set(scoredPhrases.flatMap((p) => p.term.split(' ')));

  const scoredWords = [...unigrams]
    .filter(([term]) => !coveredByPhrase.has(term))
    .map(([term, count]) => ({ term, weight: count }));

  return [...scoredPhrases, ...scoredWords]
    .sort((a, b) => b.weight - a.weight || a.term.localeCompare(b.term))
    .slice(0, MAX_KEYWORDS);
}

/** Every piece of the CV a parser would read, as one normalized string. */
export function cvText(data: CVData): string {
  const { personal, summary, experience, education, skills, languages, projects } = data;
  return normalize(
    [
      personal.fullName,
      personal.jobTitle,
      personal.location,
      summary,
      ...experience.flatMap((e) => [e.jobTitle, e.company, e.location, e.description]),
      ...education.flatMap((e) => [e.degree, e.school, e.description]),
      ...skills.map((s) => s.name),
      ...languages.map((l) => `${l.language} ${l.level}`),
      ...projects.flatMap((p) => [p.name, p.description]),
    ]
      .filter(Boolean)
      .join(' '),
  );
}

/**
 * Decides whether one advert term is present in the CV.
 *
 * Exact comparison is too strict for the languages this site serves: a French ad
 * says "infirmiers" where the CV says "infirmier", and Turkish agglutinates
 * suffixes onto the stem. So a term also matches when it is a prefix of a CV word,
 * for terms long enough that a prefix is not a coincidence.
 */
function matchesToken(term: string, cvTokens: Set<string>, cvSingulars: Set<string>): boolean {
  if (cvTokens.has(term)) return true;

  const singular = singularize(term);
  if (cvSingulars.has(singular)) return true;

  if (term.length >= MIN_PREFIX_LENGTH) {
    for (const token of cvTokens) {
      if (token.startsWith(singular) || singular.startsWith(token.slice(0, MIN_PREFIX_LENGTH)))
        return true;
    }
  }
  return false;
}

export function analyseMatch(jobAd: string, data: CVData, lang: string): AtsResult {
  const adWords = tokenize(jobAd).length;
  const checks = runStructuralChecks(data);

  if (adWords < MIN_AD_WORDS) {
    return { score: 0, matched: [], missing: [], checks, tooShort: true };
  }

  const text = cvText(data);
  const cvTokens = new Set(text.split(' ').filter(Boolean));
  const cvSingulars = new Set([...cvTokens].map(singularize));

  const keywords: Keyword[] = extractKeywords(jobAd, lang).map(({ term, weight }) => {
    const words = term.split(' ');

    if (words.length === 1) {
      return { term, weight, match: matchesToken(term, cvTokens, cvSingulars) ? 1 : 0 };
    }

    // A phrase found intact is a real match; the two words scattered elsewhere in
    // the CV is weaker evidence, so it counts for half.
    if (text.includes(term)) return { term, weight, match: 1 };
    const bothPresent = words.every((w) => matchesToken(w, cvTokens, cvSingulars));
    return { term, weight, match: bothPresent ? 0.5 : 0 };
  });

  const totalWeight = keywords.reduce((sum, k) => sum + k.weight, 0);
  const matchedWeight = keywords.reduce((sum, k) => sum + k.weight * k.match, 0);

  return {
    score: totalWeight === 0 ? 0 : Math.round((matchedWeight / totalWeight) * 100),
    matched: keywords.filter((k) => k.match > 0),
    missing: keywords.filter((k) => k.match === 0),
    checks,
    tooShort: false,
  };
}

/**
 * The structural details that decide whether a parser can read the CV at all.
 *
 * These are independent of any advert: a CV with no email address or no dates on
 * its roles loses information in every system that reads it.
 */
export function runStructuralChecks(data: CVData): StructuralCheck[] {
  const { personal, summary, experience, skills, education } = data;

  return [
    { id: 'email', ok: /\S+@\S+\.\S+/.test(personal.email) },
    { id: 'phone', ok: normalize(personal.phone).replace(/\D/g, '').length >= 6 },
    { id: 'jobTitle', ok: personal.jobTitle.trim().length > 0 },
    { id: 'summary', ok: summary.trim().length >= 30 },
    {
      id: 'experienceDates',
      ok: experience.length > 0 && experience.every((e) => e.startDate.trim().length > 0),
    },
    { id: 'skills', ok: skills.length >= 3 },
    { id: 'education', ok: education.length > 0 },
  ];
}
