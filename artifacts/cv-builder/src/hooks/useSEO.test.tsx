import { describe, it, expect, afterEach } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';
import { useSEO } from './useSEO';

afterEach(() => {
  cleanup();
  document
    .querySelectorAll(
      'link[data-i18n-hreflang], link[rel="alternate"][hreflang], script[type="application/ld+json"]',
    )
    .forEach((el) => el.remove());
});

/** Adds unmarked hreflang links the way the prerendered HTML and the index.html shell ship them. */
function addStaticHreflangs(entries: Array<[string, string]>) {
  for (const [hreflang, href] of entries) {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = hreflang;
    link.href = href;
    document.head.appendChild(link);
  }
}

const hreflangPairs = () =>
  Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]')).map(
    (l) => [l.getAttribute('hreflang'), l.getAttribute('href')],
  );

describe('useSEO', () => {
  it('sets document title, description and canonical', () => {
    renderHook(() =>
      useSEO({
        title: 'Test Title',
        description: 'Test description',
        canonical: 'https://example.com/page',
      }),
    );

    expect(document.title).toBe('Test Title');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'Test description',
    );
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://example.com/page',
    );
  });

  it('renders hreflang alternates plus x-default', () => {
    renderHook(() =>
      useSEO({
        title: 'Test',
        description: 'Test',
        alternateLangs: [
          { lang: 'en', href: 'https://example.com/en' },
          { lang: 'fr', href: 'https://example.com/fr' },
        ],
      }),
    );

    const hreflangs = document.querySelectorAll('link[data-i18n-hreflang]');
    expect(hreflangs).toHaveLength(3);
    const xDefault = document.querySelector('link[hreflang="x-default"]');
    expect(xDefault?.getAttribute('href')).toBe('https://example.com/en');
  });

  it('cleans up hreflang and JSON-LD tags on unmount', () => {
    const { unmount } = renderHook(() =>
      useSEO({
        title: 'Test',
        description: 'Test',
        alternateLangs: [{ lang: 'en', href: 'https://example.com/en' }],
        jsonLd: { '@context': 'https://schema.org', '@type': 'WebPage' },
      }),
    );

    expect(document.querySelectorAll('link[data-i18n-hreflang]')).toHaveLength(2);
    expect(document.querySelector('script[data-i18n-jsonld]')).not.toBeNull();

    unmount();

    expect(document.querySelectorAll('link[data-i18n-hreflang]')).toHaveLength(0);
    expect(document.querySelector('script[data-i18n-jsonld]')).toBeNull();
  });

  it('replaces prerendered hreflang links instead of adding a second set', () => {
    // Same set the prerender writes into the static HTML for this page.
    addStaticHreflangs([
      ['en', 'https://example.com/resume/teacher'],
      ['fr', 'https://example.com/fr/resume/teacher'],
      ['x-default', 'https://example.com/resume/teacher'],
    ]);

    renderHook(() =>
      useSEO({
        title: 'Test',
        description: 'Test',
        alternateLangs: [
          { lang: 'en', href: 'https://example.com/resume/teacher' },
          { lang: 'fr', href: 'https://example.com/fr/resume/teacher' },
        ],
      }),
    );

    expect(hreflangPairs()).toEqual([
      ['en', 'https://example.com/resume/teacher'],
      ['fr', 'https://example.com/fr/resume/teacher'],
      ['x-default', 'https://example.com/resume/teacher'],
    ]);
  });

  it('drops the homepage hreflang set when a non-prerendered URL falls back to the homepage HTML', () => {
    // Legacy URLs without a prerendered file are served the homepage HTML, whose
    // hreflang cluster points at the homepages, not at this page.
    addStaticHreflangs([
      ['en', 'https://example.com/'],
      ['fr', 'https://example.com/fr'],
      ['x-default', 'https://example.com/'],
    ]);

    renderHook(() =>
      useSEO({
        title: 'Test',
        description: 'Test',
        canonical: 'https://example.com/resume/legacy',
        alternateLangs: [
          { lang: 'en', href: 'https://example.com/resume/legacy' },
          { lang: 'fr', href: 'https://example.com/fr/resume/legacy' },
        ],
      }),
    );

    const pairs = hreflangPairs();
    expect(pairs).toHaveLength(3);
    expect(pairs.map(([, href]) => href)).not.toContain('https://example.com/');
    expect(new Set(pairs.map(([lang]) => lang)).size).toBe(pairs.length);
  });

  it('replaces the prerendered page JSON-LD and keeps the site-wide shell graph', () => {
    // Shell graph (unmarked) and the per-page graph the prerender writes (marked).
    const shell = document.createElement('script');
    shell.type = 'application/ld+json';
    shell.textContent = JSON.stringify({ '@type': 'WebSite' });
    document.head.appendChild(shell);
    const prerendered = document.createElement('script');
    prerendered.type = 'application/ld+json';
    prerendered.setAttribute('data-i18n-jsonld', 'true');
    prerendered.textContent = JSON.stringify({ '@type': 'FAQPage', name: 'prerendered' });
    document.head.appendChild(prerendered);

    renderHook(() =>
      useSEO({
        title: 'Test',
        description: 'Test',
        jsonLd: { '@context': 'https://schema.org', '@type': 'FAQPage', name: 'page' },
      }),
    );

    const blocks = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(
      (s) => JSON.parse(s.textContent ?? '{}'),
    );
    expect(blocks.filter((b) => b['@type'] === 'FAQPage')).toHaveLength(1);
    expect(blocks.find((b) => b['@type'] === 'FAQPage').name).toBe('page');
    expect(blocks.filter((b) => b['@type'] === 'WebSite')).toHaveLength(1);
  });
});
