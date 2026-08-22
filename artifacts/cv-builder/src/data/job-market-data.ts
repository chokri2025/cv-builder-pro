/**
 * Language-neutral job-market facts used to differentiate the ~1,000 job × city
 * landing pages from one another.
 *
 * Before this module every landing page was the same paragraph with the job title
 * and city name swapped in, which is exactly the scaled/thin-content pattern search
 * engines suppress. Everything here is a *fact atom* — a credential name, a sector,
 * a CV convention, a job board — that varies by city, country and job category, so
 * two pages built from it never read the same way.
 *
 * Atoms are deliberately language-neutral: credential and employer names are proper
 * nouns that stay identical in every locale, and sectors/CV conventions are keys
 * that `market-copy.ts` renders into each supported language.
 */

export type JobCategory =
  | 'healthcare'
  | 'technology'
  | 'education'
  | 'finance'
  | 'creative'
  | 'business'
  | 'engineering'
  | 'trades';

export type SectorKey =
  | 'finance'
  | 'technology'
  | 'healthcare'
  | 'education'
  | 'media'
  | 'tourism'
  | 'logistics'
  | 'energy'
  | 'publicSector'
  | 'manufacturing'
  | 'research'
  | 'retail'
  | 'construction'
  | 'startups'
  | 'legal';

export type CvNormKey =
  | 'noPhoto'
  | 'photoCommon'
  | 'onePage'
  | 'twoPages'
  | 'attestedCertificates'
  | 'workAuthorization'
  | 'referencesOnRequest'
  | 'localContactDetails'
  | 'languageLevels'
  | 'reverseChronological';

export type CredentialKind =
  | 'registration'
  | 'licence'
  | 'certification'
  | 'qualification'
  | 'attestation';

export interface Credential {
  /** Proper noun / official name — identical across locales. */
  name: string;
  kind: CredentialKind;
}

export interface CountryProfile {
  /** ISO-3166 alpha-2, used only as a lookup key. */
  code: string;
  /** CV conventions that genuinely differ by country. */
  cvNorms: CvNormKey[];
  /** Where roles are actually advertised — proper nouns. */
  jobBoards: string;
  /** Licensing / registration bodies, per job category, where one really exists. */
  credentials: Partial<Record<JobCategory, Credential>>;
}

export interface CityProfile {
  countryCode: string;
  /** The sectors that actually drive hiring in this city. */
  sectors: SectorKey[];
  /** Named local employers or districts — proper nouns, kept as-is in every locale. */
  anchors: string;
}

/** Maps every SEO skill slug to the category whose advice actually applies to it. */
export const SKILL_CATEGORIES: Record<string, JobCategory> = {
  'software-engineer': 'technology',
  'web-developer': 'technology',
  'data-analyst': 'technology',
  'devops-engineer': 'technology',
  'product-manager': 'technology',
  'ux-designer': 'creative',
  'graphic-designer': 'creative',
  'content-writer': 'creative',
  'marketing-manager': 'creative',
  'project-manager': 'business',
  'business-analyst': 'business',
  'hr-manager': 'business',
  'sales-manager': 'business',
  'customer-service': 'business',
  accountant: 'finance',
  'financial-analyst': 'finance',
  nurse: 'healthcare',
  teacher: 'education',
  electrician: 'trades',
  'civil-engineer': 'engineering',
};

export const COUNTRY_PROFILES: Record<string, CountryProfile> = {
  US: {
    code: 'US',
    cvNorms: ['noPhoto', 'onePage', 'reverseChronological'],
    jobBoards: 'LinkedIn, Indeed and company career portals',
    credentials: {
      healthcare: { name: 'NCLEX-RN and a state board of nursing licence', kind: 'licence' },
      education: { name: 'a state teaching licence', kind: 'licence' },
      finance: { name: 'CPA licensure', kind: 'licence' },
      engineering: { name: 'a Professional Engineer (PE) licence', kind: 'licence' },
      trades: { name: 'a state or city electrical licence', kind: 'licence' },
    },
  },
  GB: {
    code: 'GB',
    cvNorms: ['noPhoto', 'twoPages', 'referencesOnRequest'],
    jobBoards: 'LinkedIn, Indeed, Reed and Totaljobs',
    credentials: {
      healthcare: { name: 'NMC registration', kind: 'registration' },
      education: { name: 'Qualified Teacher Status (QTS)', kind: 'qualification' },
      finance: { name: 'ACA, ACCA or CIMA', kind: 'qualification' },
      engineering: { name: 'Chartered Engineer (CEng) status', kind: 'registration' },
      trades: {
        name: 'an ECS/JIB card and 18th Edition wiring regulations',
        kind: 'certification',
      },
    },
  },
  FR: {
    code: 'FR',
    cvNorms: ['onePage', 'photoCommon', 'languageLevels'],
    jobBoards: 'LinkedIn, Indeed, APEC and Welcome to the Jungle',
    credentials: {
      healthcare: {
        name: "the Diplôme d'État d'infirmier and ONI registration",
        kind: 'registration',
      },
      education: { name: 'the CAPES or CRPE examination', kind: 'qualification' },
      finance: { name: 'the DSCG or expert-comptable route', kind: 'qualification' },
      engineering: { name: "a diplôme d'ingénieur accredited by the CTI", kind: 'qualification' },
      trades: { name: 'a CAP Électricien or Titre Professionnel', kind: 'qualification' },
    },
  },
  CA: {
    code: 'CA',
    cvNorms: ['noPhoto', 'twoPages', 'workAuthorization'],
    jobBoards: 'LinkedIn, Indeed and the Government of Canada Job Bank',
    credentials: {
      healthcare: {
        name: 'registration with the provincial college of nurses',
        kind: 'registration',
      },
      education: { name: 'a provincial teaching certificate', kind: 'certification' },
      finance: { name: 'the CPA Canada designation', kind: 'qualification' },
      engineering: { name: 'a P.Eng licence from the provincial regulator', kind: 'licence' },
      trades: { name: 'a Red Seal certificate of qualification', kind: 'certification' },
    },
  },
  AU: {
    code: 'AU',
    cvNorms: ['noPhoto', 'twoPages', 'workAuthorization'],
    jobBoards: 'Seek, LinkedIn and Indeed',
    credentials: {
      healthcare: { name: 'AHPRA registration', kind: 'registration' },
      education: { name: 'state teacher registration (NESA, VIT)', kind: 'registration' },
      finance: { name: 'CPA Australia or CA ANZ membership', kind: 'qualification' },
      engineering: {
        name: 'Chartered status (CPEng) with Engineers Australia',
        kind: 'registration',
      },
      trades: { name: 'a state electrical licence', kind: 'licence' },
    },
  },
  DE: {
    code: 'DE',
    cvNorms: ['photoCommon', 'twoPages', 'reverseChronological'],
    jobBoards: 'StepStone, LinkedIn, XING and Indeed',
    credentials: {
      healthcare: { name: 'Anerkennung of your nursing qualification', kind: 'registration' },
      education: { name: 'the Staatsexamen and Referendariat', kind: 'qualification' },
      finance: { name: 'the Steuerberater or Wirtschaftsprüfer exam', kind: 'qualification' },
      engineering: { name: 'Ingenieurkammer membership for chartered work', kind: 'registration' },
      trades: {
        name: 'a Gesellenbrief (and a Meisterbrief to trade alone)',
        kind: 'qualification',
      },
    },
  },
  AE: {
    code: 'AE',
    cvNorms: ['photoCommon', 'attestedCertificates', 'workAuthorization'],
    jobBoards: 'Bayt, LinkedIn, Naukrigulf and GulfTalent',
    credentials: {
      healthcare: { name: 'a DHA licence', kind: 'licence' },
      education: {
        name: 'KHDA approval of an attested teaching qualification',
        kind: 'attestation',
      },
      finance: { name: 'ACCA or CPA with attested certificates', kind: 'qualification' },
      engineering: { name: 'Society of Engineers – UAE membership', kind: 'registration' },
      trades: { name: 'attested trade certificates', kind: 'attestation' },
    },
  },
  SG: {
    code: 'SG',
    cvNorms: ['noPhoto', 'onePage', 'workAuthorization'],
    jobBoards: 'MyCareersFuture, LinkedIn and JobStreet',
    credentials: {
      healthcare: { name: 'Singapore Nursing Board registration', kind: 'registration' },
      education: { name: 'MOE registration via NIE', kind: 'registration' },
      finance: {
        name: 'the Chartered Accountant of Singapore (ISCA) designation',
        kind: 'qualification',
      },
      engineering: {
        name: 'PE registration with the Professional Engineers Board',
        kind: 'registration',
      },
      trades: { name: 'an EMA Licensed Electrical Worker licence', kind: 'licence' },
    },
  },
  NL: {
    code: 'NL',
    cvNorms: ['noPhoto', 'twoPages', 'languageLevels'],
    jobBoards: 'LinkedIn, Indeed and Nationale Vacaturebank',
    credentials: {
      healthcare: { name: 'BIG-register registration', kind: 'registration' },
      education: { name: 'a Dutch lesbevoegdheid', kind: 'qualification' },
      finance: { name: 'RA or AA registration with the NBA', kind: 'registration' },
      engineering: { name: 'a recognised ir./ing. degree', kind: 'qualification' },
      trades: { name: 'VCA safety certification and NEN 3140 competence', kind: 'certification' },
    },
  },
  ES: {
    code: 'ES',
    cvNorms: ['photoCommon', 'twoPages', 'languageLevels'],
    jobBoards: 'InfoJobs, LinkedIn and Indeed',
    credentials: {
      healthcare: { name: 'colegiación with the Colegio de Enfermería', kind: 'registration' },
      education: {
        name: 'the Máster de Formación del Profesorado (or oposiciones)',
        kind: 'qualification',
      },
      finance: { name: 'ROAC registration for audit work', kind: 'registration' },
      engineering: { name: 'colegiación with the Colegio de Ingenieros', kind: 'registration' },
      trades: { name: 'the instalador electricista autorizado certificate', kind: 'certification' },
    },
  },
};

export const CITY_PROFILES: Record<string, CityProfile> = {
  'new-york': {
    countryCode: 'US',
    sectors: ['finance', 'media', 'healthcare'],
    anchors: 'Wall Street, Midtown media groups and the NYC Health + Hospitals network',
  },
  london: {
    countryCode: 'GB',
    sectors: ['finance', 'legal', 'technology'],
    anchors: 'the City and Canary Wharf, NHS trusts and the Shoreditch tech cluster',
  },
  paris: {
    countryCode: 'FR',
    sectors: ['finance', 'tourism', 'startups'],
    anchors: 'La Défense, Station F and the CAC 40 head offices',
  },
  toronto: {
    countryCode: 'CA',
    sectors: ['finance', 'technology', 'healthcare'],
    anchors: 'Bay Street, the MaRS Discovery District and Ontario Health teams',
  },
  sydney: {
    countryCode: 'AU',
    sectors: ['finance', 'technology', 'healthcare'],
    anchors: 'the CBD banking precinct, NSW Health and Australian tech firms such as Atlassian',
  },
  berlin: {
    countryCode: 'DE',
    sectors: ['startups', 'technology', 'publicSector'],
    anchors: 'the Mitte and Kreuzberg startup scene, Charité and federal agencies',
  },
  dubai: {
    countryCode: 'AE',
    sectors: ['logistics', 'tourism', 'construction'],
    anchors: 'DMCC and DIFC free zones, Emirates and the major contracting groups',
  },
  singapore: {
    countryCode: 'SG',
    sectors: ['finance', 'logistics', 'technology'],
    anchors: 'the CBD banking hub, PSA and the one-north research corridor',
  },
  chicago: {
    countryCode: 'US',
    sectors: ['finance', 'manufacturing', 'logistics'],
    anchors: 'the Loop trading houses, rail and freight operators and large hospital systems',
  },
  'san-francisco': {
    countryCode: 'US',
    sectors: ['technology', 'startups', 'research'],
    anchors: 'SoMa tech offices, venture-backed startups and UCSF',
  },
  'los-angeles': {
    countryCode: 'US',
    sectors: ['media', 'technology', 'logistics'],
    anchors: 'the studios and streaming groups, Silicon Beach and the Port of LA',
  },
  amsterdam: {
    countryCode: 'NL',
    sectors: ['technology', 'finance', 'logistics'],
    anchors: 'the Zuidas business district, Schiphol-linked logistics and scale-ups',
  },
  madrid: {
    countryCode: 'ES',
    sectors: ['finance', 'publicSector', 'tourism'],
    anchors: 'the IBEX 35 head offices, ministries and large hospital groups',
  },
  melbourne: {
    countryCode: 'AU',
    sectors: ['education', 'healthcare', 'finance'],
    anchors: 'the Parkville research precinct, universities and CBD professional-services firms',
  },
  montreal: {
    countryCode: 'CA',
    sectors: ['technology', 'research', 'manufacturing'],
    anchors: 'the AI research cluster, aerospace manufacturers and Quartier de l’innovation',
  },
};

export interface LocalFacts {
  category: JobCategory | null;
  sectors: SectorKey[];
  anchors: string | null;
  cvNorms: CvNormKey[];
  jobBoards: string | null;
  credential: Credential | null;
}

export function getJobCategory(skillSlug: string | null | undefined): JobCategory | null {
  if (!skillSlug) return null;
  return SKILL_CATEGORIES[skillSlug] ?? null;
}

export function getCityProfile(citySlug: string | null | undefined): CityProfile | null {
  if (!citySlug) return null;
  return CITY_PROFILES[citySlug] ?? null;
}

/** Collects every fact atom that applies to a (skill, city) pair. */
export function getLocalFacts(
  skillSlug: string | null | undefined,
  citySlug: string | null | undefined,
): LocalFacts {
  const category = getJobCategory(skillSlug);
  const city = getCityProfile(citySlug);
  const country = city ? COUNTRY_PROFILES[city.countryCode] : null;

  return {
    category,
    sectors: city?.sectors ?? [],
    anchors: city?.anchors ?? null,
    cvNorms: country?.cvNorms ?? [],
    jobBoards: country?.jobBoards ?? null,
    credential: (country && category && country.credentials[category]) || null,
  };
}

/**
 * Deterministic variant picker. The same slug always resolves to the same variant
 * (so a page's copy is stable across builds and matches what was indexed), while
 * different slugs spread across the available variants.
 */
export function pickVariant(seed: string, variantCount: number): number {
  if (variantCount <= 1) return 0;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 1000003;
  }
  return hash % variantCount;
}
