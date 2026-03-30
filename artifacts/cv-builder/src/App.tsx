import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CVBuilderPage from './pages/CVBuilderPage';
import LandingPage from './pages/LandingPage';
import SitemapPage from './pages/SitemapPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CVBuilderPage />} />
        <Route path="/resume/:slug" element={<LandingPage />} />
        <Route path="/sitemap" element={<SitemapPage />} />
      </Routes>
    </BrowserRouter>
  );
}
