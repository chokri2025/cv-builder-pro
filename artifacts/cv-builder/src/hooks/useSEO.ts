import { useEffect } from 'react';

interface HreflangEntry {
  lang: string;
  href: string;
}

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  lang?: string;
  alternateLangs?: HreflangEntry[];
  jsonLd?: Record<string, unknown>;
}

interface MetaTag {
  attrName: 'name' | 'property';
  attrValue: string;
  content: string;
}

interface LinkTag {
  rel: string;
  href: string;
  hreflang?: string;
}

export interface HeadTags {
  title: string;
  metas: MetaTag[];
  links: LinkTag[];
  jsonLd?: Record<string, unknown>;
}

/** Pure computation of the per-page <head> tags, shared between the client-side
 * useSEO effect and the build-time prerender script so they can never drift. */
export function buildHeadTags({
  title,
  description,
  canonical,
  lang,
  alternateLangs,
  jsonLd,
}: SEOProps): HeadTags {
  const metas: MetaTag[] = [
    { attrName: 'name', attrValue: 'description', content: description },
    { attrName: 'property', attrValue: 'og:title', content: title },
    { attrName: 'property', attrValue: 'og:description', content: description },
    { attrName: 'property', attrValue: 'og:type', content: 'website' },
  ];
  const links: LinkTag[] = [];

  if (canonical) {
    links.push({ rel: 'canonical', href: canonical });
    metas.push({ attrName: 'property', attrValue: 'og:url', content: canonical });
  }

  if (lang) {
    metas.push({ attrName: 'property', attrValue: 'og:locale', content: lang });
  }

  if (alternateLangs && alternateLangs.length > 0) {
    alternateLangs.forEach(({ lang: hLang, href }) => {
      links.push({ rel: 'alternate', hreflang: hLang, href });
    });
    const xDefaultHref =
      alternateLangs.find((l) => l.lang === 'en')?.href ?? alternateLangs[0]?.href ?? '';
    links.push({ rel: 'alternate', hreflang: 'x-default', href: xDefaultHref });
  }

  return { title, metas, links, jsonLd };
}

export function useSEO(props: SEOProps) {
  const { title, description, canonical, lang, alternateLangs, jsonLd } = props;

  useEffect(() => {
    const head = buildHeadTags({ title, description, canonical, lang, alternateLangs, jsonLd });

    document.title = head.title;
    head.metas.forEach(({ attrName, attrValue, content }) => setMeta(attrName, attrValue, content));

    const canonicalLink = head.links.find((l) => l.rel === 'canonical');
    if (canonicalLink) setLink('canonical', canonicalLink.href);

    removeOldHreflangs();
    head.links
      .filter((l) => l.hreflang)
      .forEach(({ href, hreflang }) => {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = hreflang!;
        link.href = href;
        link.setAttribute('data-i18n-hreflang', 'true');
        document.head.appendChild(link);
      });

    removeOldJsonLd();
    if (head.jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-i18n-jsonld', 'true');
      script.textContent = JSON.stringify(head.jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      removeOldHreflangs();
      removeOldJsonLd();
    };
  }, [title, description, canonical, lang, JSON.stringify(alternateLangs), JSON.stringify(jsonLd)]);
}

function setMeta(attrName: string, attrValue: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function removeOldHreflangs() {
  document.querySelectorAll('link[data-i18n-hreflang]').forEach((el) => el.remove());
}

function removeOldJsonLd() {
  document.querySelectorAll('script[data-i18n-jsonld]').forEach((el) => el.remove());
}
