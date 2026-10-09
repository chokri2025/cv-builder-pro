import Link from 'next/link';
import type { SeoPageData } from '../../../artifacts/cv-builder/src/data/seo-data';
import { SITE_URL, type Language } from '../lib/seo';
import { getLandingStrings } from '../lib/ui-strings';

type Props = { data: SeoPageData; structuredData: Record<string, unknown>; lang: Language };

export function SeoLanding({ data, structuredData, lang }: Props) {
  const t = getLandingStrings(lang);
  // CTA goes to the live editor's homepage in the same language.
  const editorUrl = lang === 'en' ? `${SITE_URL}/` : `${SITE_URL}/${lang}`;
  return (
    <main className="page">
      <nav><Link href="/">CV Builder Pro</Link><span>Next.js SEO PoC — noindex</span></nav>
      <header>
        <p className="eyebrow">{t.freeLabel}</p>
        <h1>{data.h1}</h1>
        <p className="subtitle">{data.h2}</p>
        <p>{data.intro}</p>
        <a className="cta" href={editorUrl}>{t.startBuilding}</a>
      </header>
      <section>
        <h2>{data.localTitle}</h2>
        <ul>{data.localLines.map((line, i) => <li key={i}>{line}</li>)}</ul>
      </section>
      <section>
        <h2>{t.tipsTitle(data.skill?.label, data.city?.label)}</h2>
        <ul>{data.tips.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
      </section>
      <section>
        <h2>{t.faqTitle}</h2>
        {data.faqs.map((faq, i) => (
          <details key={i}>
            <summary>{faq.q}</summary>
            <p>{faq.a}</p>
          </details>
        ))}
      </section>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
    </main>
  );
}
