import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CVData } from '../types/cv';
import { analyseMatch, assessAtsReadiness, runStructuralChecks } from '../lib/ats-match';
import { useLanguage } from '../hooks/useLanguage';

interface Props {
  data: CVData;
}

const JOB_AD_STORAGE_KEY = 'cv-builder-job-ad';

function readStoredJobAd(): string {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(JOB_AD_STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

function scoreBand(score: number): 'low' | 'mid' | 'high' {
  if (score >= 70) return 'high';
  if (score >= 40) return 'mid';
  return 'low';
}

/**
 * Compares the CV against a pasted job advert.
 *
 * Missing keywords are shown as prompts, not as something the tool will insert:
 * a one-click "add to skills" would invite people to claim skills they do not
 * have, which fails at interview and is not what this is for. The wording asks
 * the applicant to mention the ones that genuinely apply, where they belong.
 */
export default function AtsChecker({ data }: Props) {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const [jobAd, setJobAd] = useState(readStoredJobAd);
  const [open, setOpen] = useState(false);

  const readiness = useMemo(() => assessAtsReadiness(data), [data]);
  const structuralChecks = useMemo(() => runStructuralChecks(data), [data]);

  const result = useMemo(
    () => (jobAd.trim() ? analyseMatch(jobAd, data, currentLang) : null),
    [jobAd, data, currentLang],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (jobAd.trim()) {
        window.localStorage.setItem(JOB_AD_STORAGE_KEY, jobAd);
      } else {
        window.localStorage.removeItem(JOB_AD_STORAGE_KEY);
      }
    } catch {
      // Storage can be unavailable in private/restricted browsing. Job matching
      // still works for the current session because React state remains intact.
    }
  }, [jobAd]);

  const clearJobAd = () => setJobAd('');

  const topMissing = result?.missing.slice(0, 5) ?? [];
  const remainingMissing = Math.max(0, (result?.missing.length ?? 0) - topMissing.length);

  return (
    <section className="ats-checker">
      <button
        type="button"
        className="ats-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{t('ats.title')}</span>
        <span className="ats-toggle-meta">
          <span className={`ats-live-badge ats-live-badge-${scoreBand(readiness.score)}`}>
            {readiness.score}/100
          </span>
          {result && !result.tooShort && (
            <span className={`ats-match-badge ats-match-badge-${scoreBand(result.score)}`}>
              {t('ats.matchBadge', { score: result.score })}
            </span>
          )}
          <span className="ats-toggle-icon">{open ? '▲' : '▼'}</span>
        </span>
      </button>

      {open && (
        <div className="ats-body">
          <div className={`ats-readiness ats-readiness-${scoreBand(readiness.score)}`}>
            <div className="ats-readiness-head">
              <div>
                <div className="ats-readiness-label">{t('ats.readinessLabel')}</div>
                <p className="ats-readiness-intro">{t('ats.readinessIntro')}</p>
              </div>
              <div className="ats-readiness-score">{readiness.score}<span>/100</span></div>
            </div>

            <div className="ats-readiness-progress" aria-hidden="true">
              <span style={{ width: `${readiness.score}%` }} />
            </div>

            <div className="ats-category-list">
              {readiness.categories.map((category) => (
                <div key={category.id} className="ats-category-row">
                  <span className="ats-category-name">{t(`ats.categories.${category.id}`)}</span>
                  <span className="ats-category-value">{category.score}/{category.max}</span>
                </div>
              ))}
            </div>

            {readiness.recommendations.length > 0 && (
              <div className="ats-improve">
                <strong>{t('ats.improveTitle')}</strong>
                <div className="ats-recommendations">
                  {readiness.recommendations.slice(0, 4).map((recommendation) => (
                    <div key={recommendation.id} className="ats-recommendation">
                      <span>{t(`ats.recommendations.${recommendation.id}`)}</span>
                      <span className="ats-recommendation-points">
                        {t('ats.pointsGain', { points: recommendation.points })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="ats-intro">{t('ats.intro')}</p>

          <div className="ats-job-ad-head">
            <span className="ats-job-ad-label">{t('ats.jobAdLabel')}</span>
            {jobAd && (
              <button type="button" className="ats-clear-btn" onClick={clearJobAd}>
                {t('ats.clearJobAd')}
              </button>
            )}
          </div>

          <textarea
            className="ats-textarea"
            value={jobAd}
            onChange={(e) => setJobAd(e.target.value)}
            placeholder={t('ats.placeholder')}
            rows={6}
            aria-label={t('ats.title')}
          />
          {jobAd && <p className="ats-storage-note">{t('ats.savedLocally')}</p>}

          {result?.tooShort && <p className="ats-hint">{t('ats.tooShort')}</p>}

          {result && !result.tooShort && (
            <>
              <div className={`ats-score ats-score-${scoreBand(result.score)}`}>
                <div className="ats-score-value">{result.score}%</div>
                <div className="ats-score-label">{t('ats.scoreLabel')}</div>
              </div>
              <p className="ats-caveat">{t('ats.caveat')}</p>

              {topMissing.length > 0 && (
                <div className="ats-group">
                  <h4 className="ats-group-title">{t('ats.priorityMissingTitle')}</h4>
                  <p className="ats-group-hint">{t('ats.missingHint')}</p>
                  <div className="ats-chips">
                    {topMissing.map((k, index) => (
                      <span
                        key={k.term}
                        className={`ats-chip ats-chip-missing ${index < 2 ? 'ats-chip-priority' : ''}`}
                      >
                        {k.term}
                      </span>
                    ))}
                  </div>
                  {remainingMissing > 0 && (
                    <p className="ats-more-missing">
                      {t('ats.moreMissing', { count: remainingMissing })}
                    </p>
                  )}
                </div>
              )}

              {result.matched.length > 0 && (
                <div className="ats-group">
                  <h4 className="ats-group-title">{t('ats.matchedTitle')}</h4>
                  <div className="ats-chips">
                    {result.matched.map((k) => (
                      <span
                        key={k.term}
                        className={`ats-chip ${k.match === 1 ? 'ats-chip-full' : 'ats-chip-partial'}`}
                        title={k.match === 1 ? undefined : t('ats.partialHint')}
                      >
                        {k.term}
                        {k.match < 1 && ' ~'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="ats-group">
            <h4 className="ats-group-title">{t('ats.checksTitle')}</h4>
            <ul className="ats-checks">
              {structuralChecks.map((check) => (
                <li key={check.id} className={check.ok ? 'ats-check-ok' : 'ats-check-fail'}>
                  <span aria-hidden="true">{check.ok ? '✓' : '!'}</span>
                  <span>{t(`ats.checks.${check.id}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
