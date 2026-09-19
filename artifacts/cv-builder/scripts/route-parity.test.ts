import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { getPrerenderRoutes, LANGUAGES } from './seo-routes.mjs';

/**
 * `App.tsx`'s <Routes> is a third, independent declaration of the route space
 * already enumerated by seo-routes.mjs (consumed by the sitemap generator and
 * the prerender script — see seo-routes.test.ts for their parity check).
 *
 * A route added to App.tsx without a matching entry in seo-routes.mjs renders
 * fine for a browser but is never prerendered: a crawler hitting that URL
 * falls through to the SPA shell and sees the homepage's <title>/canonical
 * instead of the page's own. This test catches that drift at the other end —
 * both declarations must contain the same page path patterns: a runtime-only route
 * would not be prerendered, while a prerender-only route would not be reachable
 * through the live router.
 */

/** Path patterns declared in App.tsx's <Routes>, read as source text (same
 * approach EuropassTemplate.test.ts uses to check FormPanel.tsx) so this test
 * has no runtime dependency on react-router-dom or JSX evaluation. */
function routePatternsInApp(): string[] {
  const source = readFileSync(path.resolve(__dirname, '../src/App.tsx'), 'utf8');
  return [...source.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]).filter((p) => p !== '*'); // catch-all isn't a page to prerender
}

/** Turns a concrete prerendered path into the pattern that would match it in
 * App.tsx, e.g. `/fr/resume/nurse-london` -> `/:lang/resume/:slug`. */
function toPattern(concretePath: string, lang: string, urlLang: string | undefined): string {
  let pattern = concretePath;
  if (urlLang) {
    pattern = pattern.replace(`/${urlLang}`, '/:lang');
  }
  pattern = pattern.replace(/\/resume\/[^/]+$/, '/resume/:slug');
  void lang;
  return pattern;
}

describe('App.tsx route parity with the prerender/sitemap route space', () => {
  it('has a <Route> pattern for every kind of page seo-routes.mjs prerenders', () => {
    const appPatterns = new Set(routePatternsInApp());

    const prerenderPatterns = new Set(
      getPrerenderRoutes().map((r) => toPattern(r.path, r.lang, r.urlLang)),
    );

    const missingFromApp = [...prerenderPatterns].filter((p) => !appPatterns.has(p));
    const missingFromPrerender = [...appPatterns].filter((p) => !prerenderPatterns.has(p));

    expect({ missingFromApp, missingFromPrerender }).toEqual({
      missingFromApp: [],
      missingFromPrerender: [],
    });
  });

  it("declares every locale's home route, not just the unprefixed one", () => {
    const appPatterns = routePatternsInApp();
    expect(appPatterns).toContain('/:lang');
    expect(appPatterns).toContain('/');
    // Sanity: LANGUAGES is non-empty, so the :lang pattern actually matters.
    expect(LANGUAGES.length).toBeGreaterThan(0);
  });
});
