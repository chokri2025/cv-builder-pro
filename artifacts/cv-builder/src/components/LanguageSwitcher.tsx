import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';

export default function LanguageSwitcher() {
  const { t } = useTranslation();
  const { currentLang, changeLanguage, languages } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const current = languages.find((l) => l.code === currentLang) ?? languages[0];

  return (
    <div className="lang-switcher" ref={ref}>
      <button
        className="lang-switcher-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label={t('languageSwitcher.label')}
        aria-expanded={open}
      >
        <span className="lang-flag">{current.flag}</span>
        <span className="lang-btn-name">{current.nativeName}</span>
        <span className="lang-btn-code">({current.code.toUpperCase()})</span>
        <span className={`lang-chevron ${open ? 'open' : ''}`}>▾</span>
      </button>

      {open && (
        <ul className="lang-dropdown" role="listbox" aria-label={t('languageSwitcher.label')}>
          {languages.map((lang) => (
            <li
              key={lang.code}
              role="option"
              aria-selected={lang.code === currentLang}
              className={`lang-option ${lang.code === currentLang ? 'active' : ''}`}
              onClick={() => {
                changeLanguage(lang.code);
                setOpen(false);
              }}
            >
              <span className="lang-option-flag">{lang.flag}</span>
              <span className="lang-option-info">
                <span className="lang-option-name">{lang.nativeName}</span>
                {lang.nativeName !== lang.name && (
                  <span className="lang-option-native">{lang.name}</span>
                )}
              </span>
              {lang.code === currentLang && <span className="lang-check">✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
