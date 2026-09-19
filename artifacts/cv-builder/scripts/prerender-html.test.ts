import { describe, it, expect } from 'vitest';
import { assembleHtml, stripGenericSeoTags } from './prerender.tsx';
import type { HeadTags } from '../src/hooks/useSEO';

/**
 * Smoke test for the HTML-assembly half of the prerender pipeline: given the
 * shell template and a route's head tags, the assembled output must carry
 * exactly one <title>/<canonical>/<og:*> set — the route's own, not a
 * duplicate left over from the shell — since a crawler reading two
 * conflicting <title> tags picks an undefined one.
 */

const FIXTURE_TEMPLATE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Generic Shell Title</title>
    <meta name="description" content="generic shell description" />
    <link rel="canonical" href="https://example.test/" />
    <meta property="og:title" content="generic" />
    <script type="application/ld+json">{"@type":"WebSite"}</script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;

const FIXTURE_HEAD: HeadTags = {
  title: 'Route-specific Title',
  metas: [{ attrName: 'name', attrValue: 'description', content: 'route-specific description' }],
  links: [{ rel: 'canonical', href: 'https://example.test/resume/nurse-london' }],
  jsonLd: { '@type': 'WebPage' },
};

describe('stripGenericSeoTags', () => {
  it('removes the shell title, description, canonical and og tags', () => {
    const head = FIXTURE_TEMPLATE.match(/<head>([\s\S]*?)<\/head>/)![1];
    const stripped = stripGenericSeoTags(head);

    expect(stripped).not.toContain('<title>');
    expect(stripped).not.toContain('name="description"');
    expect(stripped).not.toContain('rel="canonical"');
    expect(stripped).not.toContain('og:title');
    expect(stripped).not.toContain('application/ld+json');
  });

  it('keeps the shell JSON-LD only when explicitly asked to', () => {
    const head = FIXTURE_TEMPLATE.match(/<head>([\s\S]*?)<\/head>/)![1];
    const stripped = stripGenericSeoTags(head, { keepJsonLd: true });

    expect(stripped).toContain('application/ld+json');
  });
});

describe('assembleHtml', () => {
  it('injects exactly one title/canonical/JSON-LD, not the shell duplicates', () => {
    const html = assembleHtml(FIXTURE_TEMPLATE, FIXTURE_HEAD, '<div>rendered</div>', 'en', false);

    expect(html.match(/<title>/g)).toHaveLength(1);
    expect(html).toContain('<title>Route-specific Title</title>');
    expect(html.match(/rel="canonical"/g)).toHaveLength(1);
    expect(html).toContain('https://example.test/resume/nurse-london');
    expect(html.match(/application\/ld\+json/g)).toHaveLength(1);
    expect(html).toContain('"@type":"WebPage"');
    expect(html).not.toContain('Generic Shell Title');
  });

  it('injects the rendered body into #root', () => {
    const html = assembleHtml(FIXTURE_TEMPLATE, FIXTURE_HEAD, '<div>rendered</div>', 'en', false);
    expect(html).toContain('<div id="root"><div>rendered</div></div>');
  });

  it('sets the html lang attribute, and dir="rtl" only for Arabic', () => {
    const en = assembleHtml(FIXTURE_TEMPLATE, FIXTURE_HEAD, '', 'en', false);
    const ar = assembleHtml(FIXTURE_TEMPLATE, FIXTURE_HEAD, '', 'ar', false);

    expect(en).toContain('<html lang="en">');
    expect(en).not.toContain('dir="rtl"');
    expect(ar).toContain('<html lang="ar" dir="rtl">');
  });
});
