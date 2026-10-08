import Link from 'next/link';
import type { SeoPageData } from '../../../artifacts/cv-builder/src/data/seo-data';
import { SITE_URL } from '../lib/seo';

type Props = { data: SeoPageData; structuredData: Record<string, unknown>; lang: 'en' | 'fr' };

export function SeoLanding({ data, structuredData, lang }: Props) {
  return (
    <main className="page">
      <nav><Link href="/">CV Builder Pro</Link><span>Next.js SEO PoC — noindex</span></nav>
      <header>
        <p className="eyebrow">{lang === 'fr' ? 'Guide métier' : 'Career guide'}</p>
        <h1>{data.h1}</h1>
        <p className="subtitle">{data.h2}</p>
        <p>{data.intro}</p>
        <a className="cta" href={SITE_URL}>
          {lang === 'fr' ? 'Créer mon CV sur le site actuel' : 'Create CV on the current website'}
        </a>
      </header>
      <section>
        <h2>{data.localTitle}</h2>
        <ul>{data.localLines.map((line, i) => <li key={i}>{line}</li>)}</ul>
      </section>
      <section>
        <h2>{lang === 'fr' ? 'Conseils CV' : 'CV advice'}</h2>
        <ul>{data.tips.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
      </section>
      <section>
        <h2>FAQ</h2>
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
