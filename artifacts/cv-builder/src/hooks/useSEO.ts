import { useEffect } from 'react';

interface HreflangEntry {
  lang: string;
  href: string;
}

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  lang?: string;
  alternateLangs?: HreflangEntry[];
  jsonLd?: Record<string, unknown>;
}

export function useSEO({ title, description, canonical, lang, alternateLangs, jsonLd }: SEOProps) {
  useEffect(() => {
    document.title = title;

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', 'website');

    if (canonical) {
      setLink('canonical', canonical);
      setMeta('property', 'og:url', canonical);
    }

    if (lang) {
      setMeta('property', 'og:locale', lang);
    }

    removeOldHreflangs();
    if (alternateLangs && alternateLangs.length > 0) {
      alternateLangs.forEach(({ lang: hLang, href }) => {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = hLang;
        link.href = href;
        link.setAttribute('data-i18n-hreflang', 'true');
        document.head.appendChild(link);
      });
      const xDefault = document.createElement('link');
      xDefault.rel = 'alternate';
      xDefault.hreflang = 'x-default';
      xDefault.href = alternateLangs.find(l => l.lang === 'en')?.href ?? alternateLangs[0]?.href ?? '';
      xDefault.setAttribute('data-i18n-hreflang', 'true');
      document.head.appendChild(xDefault);
    }

    removeOldJsonLd();
    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-i18n-jsonld', 'true');
      script.textContent = JSON.stringify(jsonLd);
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
  document.querySelectorAll('link[data-i18n-hreflang]').forEach(el => el.remove());
}

function removeOldJsonLd() {
  document.querySelectorAll('script[data-i18n-jsonld]').forEach(el => el.remove());
}
