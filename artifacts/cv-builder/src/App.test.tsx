import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Link } from 'react-router-dom';
import i18n from './i18n';
import { useLanguage } from './hooks/useLanguage';
import App from './App';

function LocaleProbe() {
  const { currentLang, changeLanguage } = useLanguage();
  return <>
    <span data-testid="locale">{currentLang}</span>
    <Link to="/ar/resume/software-engineer">Arabic route</Link>
    <Link to="/resume/software-engineer">English route</Link>
    <button onClick={() => changeLanguage('en')}>Choose English</button>
  </>;
}
vi.mock('./pages/LandingPage', () => ({ default: () => <LocaleProbe /> }));
vi.mock('./pages/CVBuilderPage', () => ({ default: () => <LocaleProbe /> }));
vi.mock('./pages/SitemapPage', () => ({ default: () => <LocaleProbe /> }));
vi.mock('./pages/EuropassPage', () => ({ default: () => <LocaleProbe /> }));
vi.mock('./pages/JobsPage', () => ({ default: () => <LocaleProbe /> }));

afterEach(() => { cleanup(); localStorage.clear(); });

async function openRoute(path: string, storedLanguage: string) {
  window.history.replaceState({}, '', path);
  localStorage.setItem('cv-builder-lang', storedLanguage);
  await i18n.changeLanguage(storedLanguage);
  render(<App />);
  await screen.findByTestId('locale');
}
async function expectLocale(lang: string) {
  await waitFor(() => {
    expect(screen.getByTestId('locale').textContent).toBe(lang);
    expect(document.documentElement.lang).toBe(lang);
    expect(document.documentElement.dir).toBe(lang === 'ar' ? 'rtl' : 'ltr');
    expect(document.body.classList.contains(lang === 'ar' ? 'rtl' : 'ltr')).toBe(true);
  });
}

describe('URL language after JavaScript', () => {
  it.each(['/fr/resume/software-engineer', '/fr/sitemap', '/fr/europass-cv', '/fr/jobs', '/fr'])(
    'keeps French on %s despite an English preference', async (path) => {
      await openRoute(path, 'en');
      await expectLocale('fr');
    },
  );
  it('keeps an unprefixed route English despite a saved French preference', async () => {
    await openRoute('/resume/software-engineer', 'fr');
    await expectLocale('en');
  });
  it('updates language and direction across client-side navigation', async () => {
    await openRoute('/fr/resume/software-engineer', 'en');
    await expectLocale('fr');
    fireEvent.click(screen.getByText('Arabic route'));
    await expectLocale('ar');
    fireEvent.click(screen.getByText('English route'));
    await expectLocale('en');
  });
  it('switches the URL along with the chosen language and keeps query/hash', async () => {
    await openRoute('/fr/resume/software-engineer?source=test#example', 'en');
    await expectLocale('fr');
    fireEvent.click(screen.getByText('Choose English'));
    await expectLocale('en');
    expect(window.location.pathname).toBe('/resume/software-engineer');
    expect(window.location.search).toBe('?source=test');
    expect(window.location.hash).toBe('#example');
  });
});
