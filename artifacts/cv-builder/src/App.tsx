import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import CVBuilderPage from './pages/CVBuilderPage';
import LandingPage from './pages/LandingPage';
import SitemapPage from './pages/SitemapPage';
import { isRTL } from './i18n';

function AppRoutes() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) ?? 'en';

  useEffect(() => {
    document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <Routes>
      <Route path="/" element={<CVBuilderPage />} />
      <Route path="/resume/:slug" element={<LandingPage />} />
      <Route path="/sitemap" element={<SitemapPage />} />
      <Route path="/:lang" element={<CVBuilderPage />} />
      <Route path="/:lang/resume/:slug" element={<LandingPage />} />
      <Route path="/:lang/sitemap" element={<SitemapPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
