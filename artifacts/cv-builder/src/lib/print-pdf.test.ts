import { describe, it, expect } from 'vitest';
import { buildFileName, buildPrintDocument } from './print-pdf';

describe('buildFileName', () => {
  it('builds a filename from the CV owner name', () => {
    expect(buildFileName('Amina Benali')).toBe('Amina-Benali-CV');
  });

  it('keeps non-Latin names intact', () => {
    expect(buildFileName('أمينة بنعلي')).toBe('أمينة-بنعلي-CV');
  });

  it('strips characters that break filesystems', () => {
    expect(buildFileName('John / Doe: "Jr"')).toBe('John-Doe-Jr-CV');
  });

  it('falls back when no name has been entered yet', () => {
    expect(buildFileName('   ')).toBe('CV');
  });
});

describe('buildPrintDocument', () => {
  const doc = buildPrintDocument(
    '<div class="cv-minimal">Amina Benali</div>',
    'Amina-Benali-CV',
    'body{color:red}',
  );

  it('carries the CV markup as real text rather than an image', () => {
    expect(doc).toContain('Amina Benali');
    expect(doc).not.toContain('data:image');
    expect(doc).not.toContain('<canvas');
  });

  it('sets A4 page geometry with no margin', () => {
    expect(doc).toContain('@page { size: A4; margin: 0; }');
  });

  it('uses the filename as the document title, which the save dialog picks up', () => {
    expect(doc).toContain('<title>Amina-Benali-CV</title>');
  });

  it('inlines the app stylesheet so the print matches the preview', () => {
    expect(doc).toContain('body{color:red}');
  });

  it('neutralises the on-screen preview scaling', () => {
    expect(doc).toContain('transform: none !important');
  });

  it('puts the print reset after the app stylesheet so it wins the cascade', () => {
    // The app styles the CV for a scaled panel on a coloured backdrop; if those
    // rules came last they would paint the printed page.
    expect(doc.indexOf('body{color:red}')).toBeLessThan(doc.indexOf('@page { size: A4'));
  });

  it('re-links cross-origin font stylesheets it cannot inline', () => {
    const withFonts = buildPrintDocument(
      '<div></div>',
      'CV',
      '',
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter">',
    );
    expect(withFonts).toContain('fonts.googleapis.com');
  });
});
