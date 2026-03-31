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

export default function CreativeTemplate({ data }: Props) {
  const { t } = useTranslation();
  const formatDate = useFormatDate();
  const { personal, summary, experience, education, skills, languages, projects } = data;

  return (
    <div className="cv-creative">
      <div className="cv-creative-top">
        <div className="cv-creative-accent-bar" />
        <div className="cv-creative-hero">
          <div className="cv-creative-hero-text">
            <h1>{personal.fullName || 'Your Name'}</h1>
            {personal.jobTitle && <p className="cv-creative-subtitle">{personal.jobTitle}</p>}
          </div>
          {personal.profilePicture && (
            <img src={personal.profilePicture} alt="Profile" className="cv-photo-creative" />
          )}
        </div>
        <div className="cv-creative-contact">
          {personal.email && <span>✉ {personal.email}</span>}
          {personal.phone && <span>✆ {personal.phone}</span>}
          {personal.location && <span>⚲ {personal.location}</span>}
          {personal.linkedin && <span>in {personal.linkedin}</span>}
          {personal.portfolio && <span>⊕ {personal.portfolio}</span>}
        </div>
      </div>

      <div className="cv-creative-body">
        <div className="cv-creative-left">
          {summary && (
            <div className="cv-creative-section">
              <div className="cv-creative-section-title">{t('cv.profile')}</div>
              <p className="cv-creative-text">{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="cv-creative-section">
              <div className="cv-creative-section-title">{t('cv.experience')}</div>
              {experience.map(exp => (
                <div key={exp.id} className="cv-creative-item">
                  <div className="cv-creative-item-marker" />
                  <div className="cv-creative-item-body">
                    <div className="cv-creative-role">{exp.jobTitle}</div>
                    <div className="cv-creative-company">
                      {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                    </div>
                    <div className="cv-creative-dates">
                      {formatDate(exp.startDate)}{exp.startDate && ' – '}{exp.current ? t('cv.present') : formatDate(exp.endDate)}
                    </div>
                    {exp.description && <p className="cv-creative-desc">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {projects.length > 0 && (
            <div className="cv-creative-section">
              <div className="cv-creative-section-title">{t('cv.projects')}</div>
              {projects.map(proj => (
                <div key={proj.id} className="cv-creative-item">
                  <div className="cv-creative-item-marker" />
                  <div className="cv-creative-item-body">
                    <div className="cv-creative-role">{proj.name}</div>
                    {proj.link && <a href={proj.link} className="cv-creative-link" target="_blank" rel="noopener noreferrer">{proj.link}</a>}
                    {proj.description && <p className="cv-creative-desc">{proj.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cv-creative-right">
          {education.length > 0 && (
            <div className="cv-creative-section">
              <div className="cv-creative-section-title">{t('cv.education')}</div>
              {education.map(edu => (
                <div key={edu.id} className="cv-creative-edu-item">
                  <div className="cv-creative-edu-year">{edu.year}</div>
                  <div>
                    <div className="cv-creative-edu-degree">{edu.degree}</div>
                    <div className="cv-creative-edu-school">{edu.school}</div>
                    {edu.description && <p className="cv-creative-desc">{edu.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {skills.length > 0 && (
            <div className="cv-creative-section">
              <div className="cv-creative-section-title">{t('cv.skills')}</div>
              <div className="cv-creative-skills">
                {skills.map(s => <span key={s.id} className="cv-creative-skill">{s.name}</span>)}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div className="cv-creative-section">
              <div className="cv-creative-section-title">{t('cv.languages')}</div>
              {languages.map(l => (
                <div key={l.id} className="cv-creative-lang">
                  <span className="cv-creative-lang-name">{l.language}</span>
                  <span className="cv-creative-lang-level">{t(`languageLevels.${l.level}`, { defaultValue: l.level })}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
