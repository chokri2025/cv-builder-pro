import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CVData, TemplateType } from '../types/cv';
import {
  CV_VERSIONS_STORAGE_KEY,
  MAX_CV_VERSIONS,
  createCvVersion,
  parseCvVersions,
  prependCvVersion,
  type CvVersion,
} from '../lib/cv-versions';

interface Props {
  data: CVData;
  template: TemplateType;
  onLoad: (data: CVData, template: TemplateType) => void;
}

const canUseStorage =
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function readVersions(): CvVersion[] {
  if (!canUseStorage) return [];
  return parseCvVersions(window.localStorage.getItem(CV_VERSIONS_STORAGE_KEY));
}

export default function CvVersions({ data, template, onLoad }: Props) {
  const { t, i18n } = useTranslation();
  const [versions, setVersions] = useState<CvVersion[]>(readVersions);
  const [name, setName] = useState(() => data.personal.jobTitle.trim().slice(0, 60));
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const persist = (next: CvVersion[]) => {
    if (!canUseStorage) return false;
    try {
      window.localStorage.setItem(CV_VERSIONS_STORAGE_KEY, JSON.stringify(next));
      setVersions(next);
      return true;
    } catch {
      setMessage(t('versions.storageError'));
      return false;
    }
  };

  const saveVersion = () => {
    try {
      const version = createCvVersion(name, data, template);
      const next = prependCvVersion(versions, version);
      if (persist(next)) {
        setName('');
        setMessage(t('versions.saved'));
      }
    } catch {
      setMessage(t('versions.nameRequired'));
    }
  };

  const loadVersion = (version: CvVersion) => {
    onLoad(JSON.parse(JSON.stringify(version.cvData)) as CVData, version.template);
    setMessage(t('versions.loaded', { name: version.name }));
  };

  const deleteVersion = (id: string) => {
    const next = versions.filter((version) => version.id !== id);
    if (persist(next)) setMessage(t('versions.deleted'));
  };

  return (
    <div className="cv-versions">
      <button
        type="button"
        className="cv-versions-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span>
          {t('versions.title')}
          {versions.length > 0 && (
            <span className="cv-versions-count">{versions.length}/{MAX_CV_VERSIONS}</span>
          )}
        </span>
        <span aria-hidden="true">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="cv-versions-body">
          <p className="cv-versions-hint">{t('versions.hint')}</p>

          <div className="cv-version-save">
            <input
              value={name}
              maxLength={60}
              onChange={(event) => {
                setName(event.target.value);
                setMessage(null);
              }}
              placeholder={t('versions.namePlaceholder')}
              aria-label={t('versions.namePlaceholder')}
            />
            <button type="button" onClick={saveVersion}>
              {t('versions.save')}
            </button>
          </div>

          {message && <p className="cv-versions-message">{message}</p>}

          {versions.length === 0 ? (
            <p className="cv-versions-empty">{t('versions.empty')}</p>
          ) : (
            <div className="cv-versions-list">
              {versions.map((version) => (
                <div key={version.id} className="cv-version-row">
                  <div className="cv-version-meta">
                    <strong>{version.name}</strong>
                    <span>
                      {new Intl.DateTimeFormat(i18n.language, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      }).format(new Date(version.createdAt))}
                    </span>
                  </div>
                  <div className="cv-version-actions">
                    <button type="button" onClick={() => loadVersion(version)}>
                      {t('versions.load')}
                    </button>
                    <button
                      type="button"
                      className="cv-version-delete"
                      onClick={() => deleteVersion(version.id)}
                      aria-label={t('versions.deleteNamed', { name: version.name })}
                    >
                      {t('versions.delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
