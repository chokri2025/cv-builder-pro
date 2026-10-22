import { describe, it, expect, afterEach } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';
import { useSEO } from './useSEO';

afterEach(() => {
  cleanup();
  document
    .querySelectorAll('link[data-i18n-hreflang], script[data-i18n-jsonld]')
    .forEach((el) => el.remove());
});

describe('useSEO', () => {
  it('replaces prerendered hreflang and FAQ without duplicating the site graph', () => {
    document.head.insertAdjacentHTML(
      'beforeend',
      `
      <link rel="alternate" hreflang="en" href="https://example.com/">
      <script type="application/ld+json">{"@type":"FAQPage","name":"stale"}</script>
      <script type="application/ld+json" data-site-jsonld="true">{"@type":"Organization"}</script>
    `,
    );
    const { rerender } = renderHook(
      ({ page }) =>
        useSEO({
          title: page,
          description: page,
          canonical: `https://example.com/${page}`,
          alternateLangs: [{ lang: 'en', href: `https://example.com/${page}` }],
          jsonLd: { '@type': 'FAQPage', name: page },
        }),
      { initialProps: { page: 'teacher' } },
    );
    rerender({ page: 'nurse' });
    expect(document.querySelectorAll('link[hreflang="en"]')).toHaveLength(1);
    expect(document.querySelector('link[hreflang="en"]')?.getAttribute('href')).toBe(
      'https://example.com/nurse',
    );
    expect(document.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(2);
    expect(document.head.textContent).not.toContain('stale');
    document.querySelector('[data-site-jsonld]')?.remove();
  });

  it('clears the previous canonical and applies noindex on missing pages', () => {
    document.head.insertAdjacentHTML(
      'beforeend',
      '<link rel="canonical" href="https://example.com/">',
    );
    renderHook(() => useSEO({ title: '404', description: 'Missing', robots: 'noindex, follow' }));
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'noindex, follow',
    );
  });
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
});
