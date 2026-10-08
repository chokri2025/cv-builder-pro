import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SeoLanding } from '../../../../../components/SeoLanding';
import { getSeoMetadata, getSeoPage, getStructuredData, POC_SLUGS } from '../../../../../lib/seo';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return POC_SLUGS.map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return getSeoMetadata(slug, 'fr');
}
export default async function FrenchLanding({ params }: Props) {
  const { slug } = await params;
  const data = getSeoPage(slug, 'fr');
  const structuredData = getStructuredData(slug, 'fr');
  if (!data || !structuredData) notFound();
  return <SeoLanding data={data} structuredData={structuredData} lang="fr" />;
}
