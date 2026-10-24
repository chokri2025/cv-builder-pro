import Link from 'next/link';
import type { Metadata } from 'next';
import { LANGUAGES, SITE_URL, getCanonicalPath } from '../../lib/seo';

// Native names as in artifacts/cv-builder/src/i18n.ts SUPPORTED_LANGUAGES.
const NATIVE_NAMES = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  ar: 'العربية',
  tr: 'Türkçe',
  pt: 'Português',
} as const;

export const metadata: Metadata = {
  title: 'CV Builder Pro – Free Online Resume & CV Maker',
  description: 'Create a CV with professional templates and PDF export. No sign-up required.',
  alternates: { canonical: `${SITE_URL}/` },
  robots: { index: false, follow: false },
};

export default function HomePage() {
  return (
    <main className="page">
      <nav><span>CV Builder Pro</span><span>Next.js SEO PoC — noindex</span></nav>
      <header>
        <p className="eyebrow">Migration proof of concept</p>
        <h1>Build a professional CV</h1>
        <p className="subtitle">Technical SEO experiment. The interactive editor remains on the live Vite website.</p>
        <a className="cta" href={SITE_URL}>Open current CV Editor</a>
      </header>
      <section>
        <h2>Routes to validate</h2>
        <ul>
          {LANGUAGES.map((lang) => (
            <li key={lang}>
              <Link href={getCanonicalPath('teacher', lang)} hrefLang={lang}>
                Teacher — <span lang={lang}>{NATIVE_NAMES[lang]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
