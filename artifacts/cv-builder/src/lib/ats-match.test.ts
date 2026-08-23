import { describe, it, expect } from 'vitest';
import { analyseMatch, cvText, extractKeywords, normalize, runStructuralChecks } from './ats-match';
import type { CVData } from '../types/cv';

const NURSE_CV: CVData = {
  personal: {
    fullName: 'Amina Benali',
    jobTitle: 'Registered Nurse',
    email: 'amina@example.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    linkedin: '',
    portfolio: '',
    profilePicture: '',
  },
  summary: 'Registered nurse with six years in intensive care and post-operative monitoring.',
  experience: [
    {
      id: 'a',
      jobTitle: 'ICU Nurse',
      company: 'Hôpital Saint-Louis',
      location: 'Paris',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: 'Lead nurse on a 24-bed intensive care unit, supervising a team of six.',
    },
  ],
  education: [
    {
      id: 'b',
      degree: "Diplôme d'État d'Infirmier",
      school: 'IFSI Paris',
      year: '2018',
      description: '',
    },
  ],
  skills: [
    { id: 's1', name: 'Intensive care' },
    { id: 's2', name: 'Triage' },
    { id: 's3', name: 'Patient education' },
  ],
  languages: [{ id: 'l1', language: 'French', level: 'Native' }],
  projects: [],
};

const NURSE_AD = `We are looking for a Registered Nurse to join our intensive care unit.
The successful candidate will have experience in post-operative monitoring, triage and
patient education. You will work in a team of nurses on a busy intensive care ward.
Responsibilities include medication administration and supervising junior staff.`;

const DEVELOPER_AD = `We are seeking a senior backend engineer with strong Kubernetes and
Terraform experience. You will design distributed systems, own our PostgreSQL migrations
and improve deployment pipelines. Familiarity with Go and gRPC is required for this role.`;

describe('normalize', () => {
  it('folds case, accents and punctuation', () => {
    expect(normalize('Diplôme d’État, Infirmier!')).toBe('diplome d etat infirmier');
  });

  it('keeps the characters that carry meaning in tech terms', () => {
    // Folding only: dropping "and" is the keyword extractor's job, not this one's.
    expect(normalize('C++ / C# and .NET')).toBe('c++ c# and net');
  });

  it('unifies Arabic alef and yaa spellings', () => {
    expect(normalize('إدارة')).toBe(normalize('ادارة'));
    expect(normalize('مستشفى')).toBe(normalize('مستشفي'));
  });
});

describe('extractKeywords', () => {
  const keywords = extractKeywords(NURSE_AD, 'en');
  const terms = keywords.map((k) => k.term);

  it('keeps the terms that decide the shortlist', () => {
    expect(terms).toContain('intensive care');
    expect(terms).toContain('triage');
  });

  it('drops recruiting boilerplate and function words', () => {
    for (const noise of ['we', 'are', 'looking', 'candidate', 'experience', 'responsibilities']) {
      expect(terms).not.toContain(noise);
    }
  });

  it('shows a phrase instead of its parts, even when a part is more frequent', () => {
    // "care" occurs more often than any single phrase containing it; listing both
    // would read as two separate things to fix when it is one.
    expect(terms).toContain('intensive care');
    expect(terms).not.toContain('care');
  });

  it('drops generic recruiting verbs that say nothing about fit', () => {
    const noisy = extractKeywords(
      `${NURSE_AD} Knowledge of local protocols is a plus and familiarity with our systems helps.`,
      'en',
    ).map((k) => k.term);
    expect(noisy).not.toContain('knowledge');
    expect(noisy).not.toContain('familiarity');
  });

  it('respects per-language stopwords', () => {
    const french = extractKeywords(
      'Nous recherchons un infirmier pour notre service de réanimation avec une expérience en triage.',
      'fr',
    ).map((k) => k.term);
    expect(french).toContain('reanimation');
    expect(french).not.toContain('nous');
    expect(french).not.toContain('recherchons');
  });
});

describe('analyseMatch', () => {
  it('scores a closely matching CV highly', () => {
    const result = analyseMatch(NURSE_AD, NURSE_CV, 'en');
    expect(result.score).toBeGreaterThan(55);
    expect(result.matched.map((k) => k.term)).toContain('intensive care');
  });

  it('scores an unrelated advert low and names what is missing', () => {
    const result = analyseMatch(DEVELOPER_AD, NURSE_CV, 'en');
    expect(result.score).toBeLessThan(25);
    expect(result.missing.map((k) => k.term)).toContain('kubernetes');
  });

  it('refuses to score an advert too short to judge', () => {
    const result = analyseMatch('Nurse wanted', NURSE_CV, 'en');
    expect(result.tooShort).toBe(true);
    expect(result.score).toBe(0);
    expect(result.matched).toEqual([]);
  });

  it('still reports structural checks for a too-short advert', () => {
    expect(analyseMatch('Nurse wanted', NURSE_CV, 'en').checks.length).toBeGreaterThan(0);
  });

  it('tolerates plurals between advert and CV', () => {
    const result = analyseMatch(
      `${NURSE_AD} We need nurses who can handle triages daily across several wards and units.`,
      NURSE_CV,
      'en',
    );
    expect(result.missing.map((k) => k.term)).not.toContain('nurses');
  });

  it('counts a split phrase as partial rather than full evidence', () => {
    const splitCv: CVData = {
      ...NURSE_CV,
      summary: 'Nurse focused on care of patients in an intensive environment.',
      skills: [{ id: 's1', name: 'Triage' }],
      experience: [{ ...NURSE_CV.experience[0], description: 'Ward duties.' }],
    };
    const phrase = analyseMatch(NURSE_AD, splitCv, 'en').matched.find(
      (k) => k.term === 'intensive care',
    );
    expect(phrase?.match).toBe(0.5);
  });

  it('never returns a score outside 0–100', () => {
    for (const ad of [NURSE_AD, DEVELOPER_AD]) {
      const { score } = analyseMatch(ad, NURSE_CV, 'en');
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });
});

describe('cvText', () => {
  it('includes every section a parser would read', () => {
    const text = cvText(NURSE_CV);
    for (const fragment of [
      'amina benali',
      'icu nurse',
      'hopital saint louis',
      'triage',
      'french',
    ]) {
      expect(text).toContain(fragment);
    }
  });
});

describe('runStructuralChecks', () => {
  it('passes a complete CV', () => {
    expect(runStructuralChecks(NURSE_CV).filter((c) => !c.ok)).toEqual([]);
  });

  it('flags a missing email, phone and undated role', () => {
    const broken: CVData = {
      ...NURSE_CV,
      personal: { ...NURSE_CV.personal, email: 'not-an-email', phone: '' },
      experience: [{ ...NURSE_CV.experience[0], startDate: '' }],
    };
    const failing = runStructuralChecks(broken)
      .filter((c) => !c.ok)
      .map((c) => c.id);
    expect(failing).toEqual(expect.arrayContaining(['email', 'phone', 'experienceDates']));
  });

  it('flags a thin CV', () => {
    const thin: CVData = { ...NURSE_CV, summary: '', skills: [], education: [] };
    const failing = runStructuralChecks(thin)
      .filter((c) => !c.ok)
      .map((c) => c.id);
    expect(failing).toEqual(expect.arrayContaining(['summary', 'skills', 'education']));
  });
});
