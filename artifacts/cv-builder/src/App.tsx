import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, lazy, Suspense } from 'react';
import { isRTL } from './i18n';

const CVBuilderPage = lazy(() => import('./pages/CVBuilderPage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));
const EuropassPage = lazy(() => import('./pages/EuropassPage'));

function AppRoutes() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) ?? 'en';

  useEffect(() => {
    document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<CVBuilderPage />} />
        <Route path="/resume/:slug" element={<LandingPage />} />
        <Route path="/sitemap" element={<SitemapPage />} />
        <Route path="/europass-cv" element={<EuropassPage />} />
        <Route path="/:lang" element={<CVBuilderPage />} />
        <Route path="/:lang/resume/:slug" element={<LandingPage />} />
        <Route path="/:lang/sitemap" element={<SitemapPage />} />
        <Route path="/:lang/europass-cv" element={<EuropassPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
