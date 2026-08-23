import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { CEFR_BY_LEVEL } from '../../lib/cefr';

/** The level options the form actually offers, read from FormPanel itself. */
function levelsOfferedByTheForm(): string[] {
  const source = readFileSync(path.resolve(__dirname, '../FormPanel.tsx'), 'utf8');
  const block = source.match(/const LANGUAGE_LEVELS = \[([\s\S]*?)\]/)?.[1] ?? '';
  return [...block.matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

describe('Europass CEFR mapping', () => {
  it('covers every level the form can produce', () => {
    const offered = levelsOfferedByTheForm();
    expect(offered.length).toBeGreaterThan(0);
    // A level with no CEFR equivalent would render bare on a CV whose whole point
    // is stating language ability on the European scale.
    expect(offered.filter((level) => !CEFR_BY_LEVEL[level])).toEqual([]);
  });

  it('maps to valid CEFR bands, strongest first', () => {
    const bands = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    for (const value of Object.values(CEFR_BY_LEVEL)) {
      expect(bands).toContain(value);
    }
    expect(CEFR_BY_LEVEL.Native).toBe('C2');
    expect(CEFR_BY_LEVEL.Beginner).toBe('A1');
  });

  it('assigns a distinct band to each level', () => {
    const values = Object.values(CEFR_BY_LEVEL);
    expect(new Set(values).size).toBe(values.length);
  });
});

describe('template registration', () => {
  const types = readFileSync(path.resolve(__dirname, '../../types/cv.ts'), 'utf8');
  const preview = readFileSync(path.resolve(__dirname, '../CVPreview.tsx'), 'utf8');
  const form = readFileSync(path.resolve(__dirname, '../FormPanel.tsx'), 'utf8');

  it('is selectable, typed and rendered', () => {
    expect(types).toContain("'europass'");
    expect(form).toContain("'europass'");
    expect(preview).toContain('EuropassTemplate');
  });

  it('is offered in every locale', () => {
    for (const lang of ['en', 'fr', 'es', 'ar', 'tr', 'pt']) {
      const json = JSON.parse(
        readFileSync(path.resolve(__dirname, `../../locales/${lang}/translation.json`), 'utf8'),
      ) as { builder: { templates: Record<string, string> }; cv: Record<string, string> };
      expect(json.builder.templates.europass, lang).toBeTruthy();
      expect(json.cv.personalInformation, lang).toBeTruthy();
      expect(json.cv.educationAndTraining, lang).toBeTruthy();
      expect(json.cv.languageSkills, lang).toBeTruthy();
    }
  });
});
