import { describe, expect, it } from 'vitest';
import type { CVData } from '../types/cv';
import {
  MAX_CV_VERSIONS,
  createCvVersion,
  parseCvVersions,
  prependCvVersion,
} from './cv-versions';

const CV: CVData = {
  personal: {
    fullName: 'Jane Doe',
    jobTitle: 'Teacher',
    email: 'jane@example.com',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    profilePicture: '',
  },
  summary: 'Teacher summary',
  experience: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
};

describe('cv versions', () => {
  it('ignores malformed localStorage content', () => {
    expect(parseCvVersions('{bad json')).toEqual([]);
    expect(parseCvVersions(JSON.stringify([{ id: 'x' }]))).toEqual([]);
  });

  it('creates an independent snapshot', () => {
    const version = createCvVersion(' Teacher Lyon ', CV, 'minimal', new Date('2026-09-19T20:00:00Z'));
    expect(version.name).toBe('Teacher Lyon');

    CV.personal.jobTitle = 'Changed after snapshot';
    expect(version.cvData.personal.jobTitle).toBe('Teacher');
  });

  it('keeps only the newest allowed snapshots', () => {
    const versions = Array.from({ length: MAX_CV_VERSIONS }, (_, index) =>
      createCvVersion(`Version ${index}`, CV, 'minimal', new Date(2026, 0, index + 1)),
    );
    const next = createCvVersion('Newest', CV, 'modern');

    const result = prependCvVersion(versions, next);
    expect(result).toHaveLength(MAX_CV_VERSIONS);
    expect(result[0]?.name).toBe('Newest');
  });
});
