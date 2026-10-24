import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NON_EN_LANGUAGES, getDirection, isLanguage } from '../../lib/seo';
import '../globals.css';

// Root layout for every prefixed locale (/fr, /es, /ar, /tr, /pt). English stays
// unprefixed in app/(en); /en/* is not a route here (production 301s it to /*).
export const dynamicParams = false;
export function generateStaticParams() {
  return NON_EN_LANGUAGES.map((lang) => ({ lang }));
}

type Props = { children: ReactNode; params: Promise<{ lang: string }> };

export default async function LocaleRootLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLanguage(lang) || lang === 'en') notFound();
  return (
    <html lang={lang} dir={getDirection(lang)}>
      <body>{children}</body>
    </html>
  );
}
