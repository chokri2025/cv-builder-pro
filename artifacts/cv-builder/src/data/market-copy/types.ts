import type { CredentialKind, CvNormKey, JobCategory, SectorKey } from '../job-market-data';

/** Everything a copy template can interpolate, already resolved into the target language. */
export interface CopyContext {
  /** Localized job label, e.g. "Nurse". Null on city-only pages. */
  skill: string | null;
  /** City label, e.g. "Sydney". Null on skill-only pages. */
  city: string | null;
  /** Localized sector words for the city, most significant first. */
  sectors: string[];
  /** Named local employers/districts (proper nouns, same in every language). */
  anchors: string | null;
  /** Where local roles are advertised (proper nouns). */
  boards: string | null;
  /** Localized CV-convention clauses for the country. */
  norms: string[];
  /** The country's CV-length convention, when it has one. */
  lengthNorm: string | null;
  /** The credential name for this job category in this country, if one exists. */
  credential: string | null;
  credentialKind: CredentialKind | null;
  /** One sentence on what employers look for — credential-based or category-based. */
  proof: string;
  category: JobCategory | null;
}

export interface FaqEntry {
  q: string;
  a: string;
}

/**
 * Per-language rendering of the language-neutral facts in `job-market-data.ts`.
 * Each locale supplies the words for sectors and CV conventions, plus rotating
 * copy templates so no two landing pages read alike.
 */
export interface MarketPhrasebook {
  sector: Record<SectorKey, string>;
  norm: Record<CvNormKey, string>;
  credentialKind: Record<CredentialKind, string>;
  /** Sentence used when a real credential exists for this job category and country. */
  credentialProof: (name: string, kind: CredentialKind, city: string | null) => string;
  /** Sentence used when the category has no licensing body. */
  categoryProof: Record<JobCategory, string>;
  /** Fallback proof sentence for pages with no job category at all (city-only). */
  genericProof: string;
  /** Rotating opening paragraphs, picked deterministically per slug. */
  introSkillCity: Array<(c: CopyContext) => string>;
  introSkill: Array<(c: CopyContext) => string>;
  introCity: Array<(c: CopyContext) => string>;
  /** Advice that genuinely differs per job family. */
  categoryTips: Record<JobCategory, string[]>;
  /** Advice for pages with no job category (city-only). */
  genericTips: string[];
  /** Closing tip that carries the local formatting conventions. */
  localTip: (c: CopyContext) => string;
  /** Heading + bullets for the "what local employers expect" block. */
  localTitle: (c: CopyContext) => string;
  localLines: (c: CopyContext) => string[];
  /** Page-specific questions and answers. */
  faqs: (c: CopyContext) => FaqEntry[];
}
