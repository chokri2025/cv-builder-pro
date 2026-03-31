import { useTranslation } from 'react-i18next';
import { CVData } from '../../types/cv';

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

export default function ModernTemplate({ data }: Props) {
  const { t } = useTranslation();
  const formatDate = useFormatDate();
  const { personal, summary, experience, education, skills, languages, projects } = data;

  return (
    <div className="cv-modern">
      <div className="cv-modern-sidebar">
        {personal.profilePicture && (
          <div className="cv-photo-modern-wrap">
            <img src={personal.profilePicture} alt="Profile" className="cv-photo-modern" />
          </div>
        )}
        <div className="cv-modern-name">
          <h1>{personal.fullName || 'Your Name'}</h1>
          {personal.jobTitle && <p className="cv-modern-title">{personal.jobTitle}</p>}
        </div>

        <div className="cv-modern-contact">
          {personal.email && <div className="cv-contact-item"><span className="icon">✉</span>{personal.email}</div>}
          {personal.phone && <div className="cv-contact-item"><span className="icon">✆</span>{personal.phone}</div>}
          {personal.location && <div className="cv-contact-item"><span className="icon">⚲</span>{personal.location}</div>}
          {personal.linkedin && <div className="cv-contact-item"><span className="icon">in</span>{personal.linkedin}</div>}
          {personal.portfolio && <div className="cv-contact-item"><span className="icon">⊕</span>{personal.portfolio}</div>}
        </div>

        {skills.length > 0 && (
          <div className="cv-modern-section">
            <div className="cv-modern-section-title">{t('cv.skills')}</div>
            <div className="cv-modern-skills">
              {skills.map(s => <div key={s.id} className="cv-modern-skill-item">{s.name}</div>)}
            </div>
          </div>
        )}

        {languages.length > 0 && (
          <div className="cv-modern-section">
            <div className="cv-modern-section-title">{t('cv.languages')}</div>
            {languages.map(l => (
              <div key={l.id} className="cv-modern-lang">
                <span>{l.language}</span>
                <span className="cv-modern-lang-level">{t(`languageLevels.${l.level}`, { defaultValue: l.level })}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="cv-modern-main">
        {summary && (
          <div className="cv-modern-main-section">
            <div className="cv-modern-main-title">{t('cv.profile')}</div>
            <p className="cv-modern-summary">{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div className="cv-modern-main-section">
            <div className="cv-modern-main-title">{t('cv.experience')}</div>
            {experience.map(exp => (
              <div key={exp.id} className="cv-modern-exp-item">
                <div className="cv-modern-exp-dot" />
                <div className="cv-modern-exp-content">
                  <div className="cv-modern-exp-header">
                    <strong>{exp.jobTitle}</strong>
                    <span className="cv-modern-date">
                      {formatDate(exp.startDate)}{exp.startDate && ' – '}{exp.current ? t('cv.present') : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.company && <div className="cv-modern-exp-company">{exp.company}{exp.location && ` · ${exp.location}`}</div>}
                  {exp.description && <p className="cv-modern-exp-desc">{exp.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div className="cv-modern-main-section">
            <div className="cv-modern-main-title">{t('cv.education')}</div>
            {education.map(edu => (
              <div key={edu.id} className="cv-modern-exp-item">
                <div className="cv-modern-exp-dot" />
                <div className="cv-modern-exp-content">
                  <div className="cv-modern-exp-header">
                    <strong>{edu.degree}</strong>
                    <span className="cv-modern-date">{edu.year}</span>
                  </div>
                  {edu.school && <div className="cv-modern-exp-company">{edu.school}</div>}
                  {edu.description && <p className="cv-modern-exp-desc">{edu.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div className="cv-modern-main-section">
            <div className="cv-modern-main-title">{t('cv.projects')}</div>
            {projects.map(proj => (
              <div key={proj.id} className="cv-modern-exp-item">
                <div className="cv-modern-exp-dot" />
                <div className="cv-modern-exp-content">
                  <div className="cv-modern-exp-header">
                    <strong>{proj.name}</strong>
                    {proj.link && <a href={proj.link} className="cv-link-small" target="_blank" rel="noopener noreferrer">View</a>}
                  </div>
                  {proj.description && <p className="cv-modern-exp-desc">{proj.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
