import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSEO } from '../hooks/useSEO';

export default function NotFoundPage() {
  const { t } = useTranslation();
  useSEO({
    title: '404 – CV Builder Pro',
    description: 'This page could not be found. Return to CV Builder Pro.',
    robots: 'noindex, follow',
  });
  return (
    <main className="seo-not-found">
      <div className="seo-not-found-inner">
        <h1>404 — {t('seo.notFound')}</h1>
        <p>
          {t('seo.notFoundDesc')} <Link to="/">{t('seo.notFoundLink')}</Link>.
        </p>
      </div>
    </main>
  );
}
