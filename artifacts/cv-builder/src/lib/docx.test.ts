import { describe, it, expect } from 'vitest';
import { buildDocumentXml, buildDocx, escapeXml, type DocxLabels } from './docx';
import { createZip, crc32 } from './zip';
import type { CVData } from '../types/cv';

const LABELS: DocxLabels = {
  profile: 'Profile',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  languages: 'Languages',
  projects: 'Projects',
  present: 'Present',
};

const CV: CVData = {
  personal: {
    fullName: 'Amina Benali',
    jobTitle: 'Registered Nurse',
    email: 'amina@example.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    linkedin: 'linkedin.com/in/aminabenali',
    portfolio: '',
    profilePicture: '',
  },
  summary: 'Nurse with six years in intensive care & post-operative monitoring.',
  experience: [
    {
      id: 'a',
      jobTitle: 'ICU Nurse',
      company: 'Hôpital Saint-Louis',
      location: 'Paris',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: 'Lead nurse on a 24-bed unit.',
    },
  ],
  education: [
    {
      id: 'b',
      degree: 'State Nursing Diploma',
      school: 'IFSI Paris',
      year: '2018',
      description: '',
    },
  ],
  skills: [
    { id: 's1', name: 'Intensive care' },
    { id: 's2', name: 'Triage' },
  ],
  languages: [{ id: 'l1', language: 'French', level: 'Native' }],
  projects: [],
};

/** Reads the little-endian uint32 at an offset, for checking ZIP signatures. */
function u32(bytes: Uint8Array, offset: number): number {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(offset, true);
}

describe('escapeXml', () => {
  it('escapes every character that would break the document', () => {
    expect(escapeXml(`R&D <tag> "quoted" 'single'`)).toBe(
      'R&amp;D &lt;tag&gt; &quot;quoted&quot; &apos;single&apos;',
    );
  });
});

describe('buildDocumentXml', () => {
  const xml = buildDocumentXml(CV, LABELS);

  it('carries every section of the CV as text', () => {
    for (const fragment of [
      'Amina Benali',
      'Registered Nurse',
      'amina@example.com',
      'ICU Nurse',
      'State Nursing Diploma',
      'Intensive care',
      'French',
    ]) {
      expect(xml).toContain(fragment);
    }
  });

  it('escapes user content rather than emitting broken XML', () => {
    expect(xml).toContain('intensive care &amp; post-operative');
    expect(xml).not.toMatch(/care & post/);
  });

  it('uses real heading styles so a parser can find the sections', () => {
    expect(xml).toContain('<w:pStyle w:val="Heading1"/>');
    expect(xml).toContain('<w:pStyle w:val="Title"/>');
  });

  it('keeps a single column with no tables or text boxes', () => {
    expect(xml).not.toContain('<w:tbl>');
    expect(xml).not.toContain('<w:txbxContent>');
    expect(xml).not.toContain('<w:cols w:num=');
  });

  it('preserves the spaces around separators', () => {
    expect(xml).toContain('xml:space="preserve"');
    expect(xml).toContain('ICU Nurse — Hôpital Saint-Louis — Paris');
  });

  it('marks the open-ended role as current rather than leaving it blank', () => {
    expect(xml).toContain('2021-03 – Present');
  });

  it('sets A4 page geometry', () => {
    expect(xml).toContain('<w:pgSz w:w="11906" w:h="16838"/>');
  });

  it('adds bidi direction only when asked', () => {
    expect(xml).not.toContain('<w:bidi/>');
    expect(buildDocumentXml(CV, LABELS, true)).toContain('<w:bidi/>');
    expect(buildDocumentXml(CV, LABELS, true)).toContain('<w:rtl/>');
  });

  it('omits sections the CV does not have', () => {
    expect(xml).not.toContain('Projects');
  });
});

describe('buildDocx', () => {
  const bytes = buildDocx(CV, LABELS);

  it('starts with the ZIP local file signature', () => {
    expect(u32(bytes, 0)).toBe(0x04034b50);
  });

  it('ends with an end-of-central-directory record naming five parts', () => {
    const eocdOffset = bytes.length - 22;
    expect(u32(bytes, eocdOffset)).toBe(0x06054b50);
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    expect(view.getUint16(eocdOffset + 8, true)).toBe(5);
  });

  it('contains the OOXML parts a reader looks for', () => {
    const text = new TextDecoder().decode(bytes);
    for (const part of [
      '[Content_Types].xml',
      '_rels/.rels',
      'word/document.xml',
      'word/_rels/document.xml.rels',
      'word/styles.xml',
    ]) {
      expect(text).toContain(part);
    }
  });

  it('puts [Content_Types].xml first, where readers expect it', () => {
    const text = new TextDecoder().decode(bytes);
    expect(text.indexOf('[Content_Types].xml')).toBeLessThan(text.indexOf('word/document.xml'));
  });
});

describe('zip writer', () => {
  it('computes the CRC-32 of a known input', () => {
    // "123456789" has a well-known CRC-32 check value.
    expect(crc32(new TextEncoder().encode('123456789'))).toBe(0xcbf43926);
  });

  it('stores entries uncompressed, so sizes match the input', () => {
    const data = new TextEncoder().encode('hello');
    const zip = createZip([{ name: 'a.txt', data }]);
    const view = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
    expect(view.getUint16(8, true)).toBe(0); // compression method: stored
    expect(view.getUint32(18, true)).toBe(data.length); // compressed size
    expect(view.getUint32(22, true)).toBe(data.length); // uncompressed size
  });

  it('flags filenames as UTF-8', () => {
    const zip = createZip([{ name: 'é.txt', data: new Uint8Array([1]) }]);
    const view = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
    expect(view.getUint16(6, true) & 0x0800).toBe(0x0800);
  });

  it('handles an empty entry list', () => {
    const zip = createZip([]);
    expect(zip.length).toBe(22);
    expect(u32(zip, 0)).toBe(0x06054b50);
  });
});
