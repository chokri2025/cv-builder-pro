import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, lazy, Suspense, type ReactNode } from 'react';
import { isRTL, SUPPORTED_LANGUAGES } from './i18n';
import { parseSlug } from './data/seo-data';
import NotFoundPage from './pages/NotFoundPage';

const CVBuilderPage = lazy(() => import('./pages/CVBuilderPage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));
const EuropassPage = lazy(() => import('./pages/EuropassPage'));
const JobsPage = lazy(() => import('./pages/JobsPage'));

// The server redirects retired combinations. Apply the same policy to in-app
// navigation and reject unknown locales instead of treating them as homepages.
function ValidRoute({ children }: { children: ReactNode }) {
  const { lang, slug } = useParams();
  if (lang && !SUPPORTED_LANGUAGES.some((locale) => locale.code === lang)) return <NotFoundPage />;
  if (slug) {
    const { skill, city } = parseSlug(slug);
    if (!skill && !city) return <NotFoundPage />;
    if (skill && city) {
      return (
        <Navigate to={`${lang && lang !== 'en' ? `/${lang}` : ''}/resume/${skill.slug}`} replace />
      );
    }
  }
  return children;
}

function AppRoutes() {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const prefix = pathname.split('/')[1];
  const lang = SUPPORTED_LANGUAGES.find((locale) => locale.code === prefix)?.code ?? 'en';

  useEffect(() => {
    // The URL locale takes precedence over browser and persisted preferences.
    // Sync on client-side navigation as well as direct page loads.
    if (i18n.language?.slice(0, 2) !== lang) void i18n.changeLanguage(lang);
    document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, i18n]);

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<CVBuilderPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route
          path="/resume/:slug"
          element={
            <ValidRoute>
              <LandingPage />
            </ValidRoute>
          }
        />
        <Route path="/sitemap" element={<SitemapPage />} />
        <Route path="/europass-cv" element={<EuropassPage />} />
        <Route
          path="/:lang"
          element={
            <ValidRoute>
              <CVBuilderPage />
            </ValidRoute>
          }
        />
        <Route
          path="/:lang/jobs"
          element={
            <ValidRoute>
              <JobsPage />
            </ValidRoute>
          }
        />
        <Route
          path="/:lang/resume/:slug"
          element={
            <ValidRoute>
              <LandingPage />
            </ValidRoute>
          }
        />
        <Route
          path="/:lang/sitemap"
          element={
            <ValidRoute>
              <SitemapPage />
            </ValidRoute>
          }
        />
        <Route
          path="/:lang/europass-cv"
          element={
            <ValidRoute>
              <EuropassPage />
            </ValidRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
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
