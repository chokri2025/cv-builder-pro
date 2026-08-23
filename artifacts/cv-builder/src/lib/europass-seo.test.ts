import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { buildEuropassSeoProps, europassPath, type EuropassSeoContent } from './europass-seo';

const SITE = 'https://www.cvbuilder-pro.online';
const LANGS = ['en', 'fr', 'es', 'ar', 'tr', 'pt'] as const;

const CONTENT: EuropassSeoContent = {
  title: 'Free Europass CV Builder',
  description: 'Build a Europass CV free online.',
  h1: 'Free Europass CV Builder',
  intro: 'Europass is the CV format defined by the European Union.',
  stepsTitle: 'How to build yours',
  steps: ['Fill in the form.', 'Pick the Europass template.', 'Download as PDF or .docx.'],
  faqs: [{ q: 'Is it free?', a: 'Yes.' }],
};

function locale(lang: string) {
  return JSON.parse(
    readFileSync(path.resolve(__dirname, `../locales/${lang}/translation.json`), 'utf8'),
  ) as {
    europass: {
      title: string;
      description: string;
      h1: string;
      intro: string;
      whoBody: string;
      sections: string[];
      steps: string[];
      cefr: Array<{ level: string; description: string }>;
      faqs: Array<{ q: string; a: string }>;
    };
  };
}

describe('europassPath', () => {
  it('serves English unprefixed and other locales under their prefix', () => {
    expect(europassPath('en')).toBe('/europass-cv');
    expect(europassPath('fr')).toBe('/fr/europass-cv');
  });
});

describe('buildEuropassSeoProps', () => {
  it('canonicalizes /en/europass-cv to the unprefixed page', () => {
    const bare = buildEuropassSeoProps(undefined, 'en', SITE, CONTENT);
    const prefixed = buildEuropassSeoProps('en', 'en', SITE, CONTENT);
    expect(bare.canonical).toBe(`${SITE}/europass-cv`);
    expect(prefixed.canonical).toBe(bare.canonical);
  });

  it('canonicalizes localized pages to their own path', () => {
    expect(buildEuropassSeoProps('fr', 'fr', SITE, CONTENT).canonical).toBe(
      `${SITE}/fr/europass-cv`,
    );
  });

  it('declares the full hreflang cluster', () => {
    const props = buildEuropassSeoProps('fr', 'fr', SITE, CONTENT);
    expect(props.alternateLangs?.map((a) => a.lang).sort()).toEqual([...LANGS].sort());
    expect(props.alternateLangs?.find((a) => a.lang === 'en')?.href).toBe(`${SITE}/europass-cv`);
  });

  it('ships a graph with HowTo and FAQPage taken from the page content', () => {
    const graph = (
      buildEuropassSeoProps(undefined, 'en', SITE, CONTENT).jsonLd as {
        '@graph': Array<Record<string, unknown>>;
      }
    )['@graph'];

    expect(graph.map((n) => n['@type'])).toEqual(['WebPage', 'BreadcrumbList', 'HowTo', 'FAQPage']);

    const howTo = graph.find((n) => n['@type'] === 'HowTo') as {
      step: Array<{ position: number; text: string }>;
    };
    expect(howTo.step).toHaveLength(CONTENT.steps.length);
    expect(howTo.step[0].text).toBe(CONTENT.steps[0]);

    const faq = graph.find((n) => n['@type'] === 'FAQPage') as {
      mainEntity: Array<{ name: string }>;
    };
    expect(faq.mainEntity[0].name).toBe(CONTENT.faqs[0].q);
  });
});

describe('Europass guide content', () => {
  it.each(LANGS)('is fully translated in %s', (lang) => {
    const { europass } = locale(lang);

    for (const key of ['title', 'description', 'h1', 'intro', 'whoBody'] as const) {
      expect(europass[key]?.length, `${lang}.${key}`).toBeGreaterThan(0);
    }
    expect(europass.sections).toHaveLength(6);
    expect(europass.steps).toHaveLength(3);
    expect(europass.faqs).toHaveLength(4);
  });

  it.each(LANGS)('states the whole CEFR scale in %s', (lang) => {
    const { cefr } = locale(lang).europass;
    expect(cefr.map((c) => c.level)).toEqual(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
    for (const entry of cefr) {
      expect(entry.description.length, `${lang} ${entry.level}`).toBeGreaterThan(20);
    }
  });

  it.each(LANGS)('keeps the %s meta description within the snippet limit', (lang) => {
    expect(locale(lang).europass.description.length).toBeLessThanOrEqual(155);
  });

  it('gives each locale its own copy rather than reusing English', () => {
    const intros = LANGS.map((lang) => locale(lang).europass.intro);
    expect(new Set(intros).size).toBe(LANGS.length);
  });
});
