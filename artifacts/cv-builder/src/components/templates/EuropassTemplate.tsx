import { useTranslation } from 'react-i18next';
import { CVData } from '../../types/cv';
import { CEFR_BY_LEVEL } from '../../lib/cefr';

interface Props {
  data: CVData;
}

function useFormatDate() {
  const { t } = useTranslation();
  return (dateStr: string): string => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    if (!month) return year;
    const months = t('cv.months', { returnObjects: true }) as unknown as string[];
    return `${months[parseInt(month) - 1]} ${year}`;
  };
}

/**
 * Europass-styled CV.
 *
 * Follows the layout European employers recognise — a personal-information block,
 * then dated entries with the period in a left-hand column — while staying a
 * single-column document in DOM order: each entry reads "period, then role, then
 * employer", so a parser extracting raw text still gets sensible sentences.
 */
export default function EuropassTemplate({ data }: Props) {
  const { t } = useTranslation();
  const formatDate = useFormatDate();
  const { personal, summary, experience, education, skills, languages, projects } = data;

  const contactLines: Array<{ label: string; value: string }> = [
    { label: t('fields.email'), value: personal.email },
    { label: t('fields.phone'), value: personal.phone },
    { label: t('fields.location'), value: personal.location },
    { label: t('fields.linkedin'), value: personal.linkedin },
    { label: t('fields.portfolio'), value: personal.portfolio },
  ].filter((line) => line.value);

  return (
    <div className="cv-europass">
      <header className="cv-europass-header">
        {personal.profilePicture && (
          <img
            src={personal.profilePicture}
            alt={personal.fullName ? `${personal.fullName}'s profile photo` : 'Profile photo'}
            className="cv-photo-europass"
          />
        )}
        <div className="cv-europass-identity">
          <p className="cv-name">{personal.fullName || 'Your Name'}</p>
          {personal.jobTitle && <p className="cv-job-title">{personal.jobTitle}</p>}
        </div>
      </header>

      {contactLines.length > 0 && (
        <section className="cv-europass-section">
          <h3 className="cv-europass-title">{t('cv.personalInformation')}</h3>
          <dl className="cv-europass-contact">
            {contactLines.map((line) => (
              <div key={line.label} className="cv-europass-contact-row">
                <dt>{line.label}</dt>
                <dd>{line.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {summary && (
        <section className="cv-europass-section">
          <h3 className="cv-europass-title">{t('cv.profile')}</h3>
          <p className="cv-europass-summary">{summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="cv-europass-section">
          <h3 className="cv-europass-title">{t('cv.experience')}</h3>
          {experience.map((exp) => (
            <div key={exp.id} className="cv-europass-entry">
              <div className="cv-europass-period">
                {formatDate(exp.startDate)}
                {exp.startDate && ' – '}
                {exp.current ? t('cv.present') : formatDate(exp.endDate)}
              </div>
              <div className="cv-europass-body">
                <strong>{exp.jobTitle}</strong>
                {exp.company && <span className="cv-europass-org"> — {exp.company}</span>}
                {exp.location && <span className="cv-europass-place">, {exp.location}</span>}
                {exp.description && <p className="cv-europass-desc">{exp.description}</p>}
              </div>
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="cv-europass-section">
          <h3 className="cv-europass-title">{t('cv.educationAndTraining')}</h3>
          {education.map((edu) => (
            <div key={edu.id} className="cv-europass-entry">
              <div className="cv-europass-period">{edu.year}</div>
              <div className="cv-europass-body">
                <strong>{edu.degree}</strong>
                {edu.school && <span className="cv-europass-org"> — {edu.school}</span>}
                {edu.description && <p className="cv-europass-desc">{edu.description}</p>}
              </div>
            </div>
          ))}
        </section>
      )}

      {languages.length > 0 && (
        <section className="cv-europass-section">
          <h3 className="cv-europass-title">{t('cv.languageSkills')}</h3>
          <ul className="cv-europass-languages">
            {languages.map((lang) => {
              const cefr = CEFR_BY_LEVEL[lang.level];
              return (
                <li key={lang.id}>
                  <strong>{lang.language}</strong>
                  {lang.level && (
                    <span className="cv-europass-level">
                      {' — '}
                      {t(`languageLevels.${lang.level}`, { defaultValue: lang.level })}
                      {cefr && ` (${cefr})`}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {skills.length > 0 && (
        <section className="cv-europass-section">
          <h3 className="cv-europass-title">{t('cv.skills')}</h3>
          <p className="cv-europass-skills">{skills.map((s) => s.name).join(' · ')}</p>
        </section>
      )}

      {projects.length > 0 && (
        <section className="cv-europass-section">
          <h3 className="cv-europass-title">{t('cv.projects')}</h3>
          {projects.map((project) => (
            <div key={project.id} className="cv-europass-entry">
              <div className="cv-europass-period">{project.link}</div>
              <div className="cv-europass-body">
                <strong>{project.name}</strong>
                {project.description && <p className="cv-europass-desc">{project.description}</p>}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
