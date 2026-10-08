import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_URL } from '../../lib/seo';

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
          <li><Link href="/resume/teacher">Teacher — English</Link></li>
          <li><Link href="/fr/resume/teacher">Teacher — Français</Link></li>
        </ul>
      </section>
    </main>
  );
}
