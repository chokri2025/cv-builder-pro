import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SeoLanding } from '../../../../components/SeoLanding';
import {
  getSeoMetadata,
  getSeoPage,
  getStructuredData,
  isLanguage,
  POC_SLUGS,
} from '../../../../lib/seo';

type Props = { params: Promise<{ lang: string; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return POC_SLUGS.map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLanguage(lang) || lang === 'en') return { robots: { index: false, follow: false } };
  return getSeoMetadata(slug, lang);
}
export default async function LocalizedLanding({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLanguage(lang) || lang === 'en') notFound();
  const data = getSeoPage(slug, lang);
  const structuredData = getStructuredData(slug, lang);
  if (!data || !structuredData) notFound();
  return <SeoLanding data={data} structuredData={structuredData} lang={lang} />;
}
