import { describe, expect, it } from 'vitest';
import type { CVData } from '../types/cv';
import { buildAiCopilotRequest } from './ai-copilot';

const DATA: CVData = {
  personal: {
    fullName: 'Private Name',
    jobTitle: 'Electrician',
    email: 'private@example.com',
    phone: '+216 00 000 000',
    location: 'Tunis',
    linkedin: 'https://linkedin.example/private',
    portfolio: 'https://portfolio.example/private',
    profilePicture: 'data:image/png;base64,secret',
  },
  summary: 'Residential and commercial electrical installation experience.',
  experience: [
    {
      id: 'exp-1',
      jobTitle: 'Electrician',
      company: 'Private Employer',
      location: 'Private Location',
      startDate: '2020',
      endDate: '2024',
      current: false,
      description: 'Installed and maintained electrical systems.',
    },
  ],
  education: [],
  skills: [{ id: 'skill-1', name: 'Electrical installation' }],
  languages: [],
  projects: [],
};

describe('buildAiCopilotRequest', () => {
  it('sends professional content but excludes contact/profile PII', () => {
    const request = buildAiCopilotRequest(DATA, 'Target electrician job advert', 'en');
    const serialized = JSON.stringify(request);

    expect(request.cv.jobTitle).toBe('Electrician');
    expect(request.cv.experience[0]?.description).toContain('electrical systems');
    expect(serialized).not.toContain('Private Name');
    expect(serialized).not.toContain('private@example.com');
    expect(serialized).not.toContain('+216 00 000 000');
    expect(serialized).not.toContain('linkedin.example');
    expect(serialized).not.toContain('portfolio.example');
    expect(serialized).not.toContain('data:image');
    expect(serialized).not.toContain('Private Employer');
    expect(serialized).not.toContain('Private Location');
  });
});
