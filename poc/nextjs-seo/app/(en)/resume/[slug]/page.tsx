import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SeoLanding } from '../../../../components/SeoLanding';
import { getSeoMetadata, getSeoPage, getStructuredData, POC_SLUGS } from '../../../../lib/seo';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return POC_SLUGS.map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return getSeoMetadata(slug, 'en');
}
export default async function EnglishLanding({ params }: Props) {
  const { slug } = await params;
  const data = getSeoPage(slug, 'en');
  const structuredData = getStructuredData(slug, 'en');
  if (!data || !structuredData) notFound();
  return <SeoLanding data={data} structuredData={structuredData} lang="en" />;
}
