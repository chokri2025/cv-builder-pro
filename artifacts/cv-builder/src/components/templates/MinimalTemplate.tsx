import { CVData } from '../../types/cv';

interface Props {
  data: CVData;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  if (!month) return year;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export default function MinimalTemplate({ data }: Props) {
  const { personal, summary, experience, education, skills, languages, projects } = data;

  return (
    <div className="cv-minimal">
      <div className="cv-header-minimal">
        {personal.profilePicture && (
          <img src={personal.profilePicture} alt="Profile" className="cv-photo-minimal" />
        )}
        <div className="cv-header-text">
          <h1>{personal.fullName || 'Your Name'}</h1>
          {personal.jobTitle && <h2>{personal.jobTitle}</h2>}
          <div className="cv-contact-row">
            {personal.email && <span>✉ {personal.email}</span>}
            {personal.phone && <span>✆ {personal.phone}</span>}
            {personal.location && <span>⚲ {personal.location}</span>}
            {personal.linkedin && <span>in {personal.linkedin}</span>}
            {personal.portfolio && <span>⊕ {personal.portfolio}</span>}
          </div>
        </div>
      </div>

      {summary && (
        <div className="cv-section">
          <div className="cv-section-title">Profile</div>
          <p className="cv-summary">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="cv-section">
          <div className="cv-section-title">Experience</div>
          {experience.map(exp => (
            <div key={exp.id} className="cv-item">
              <div className="cv-item-header">
                <div>
                  <strong>{exp.jobTitle}</strong>
                  {exp.company && <span className="cv-company"> · {exp.company}</span>}
                  {exp.location && <span className="cv-location"> · {exp.location}</span>}
                </div>
                <div className="cv-date">
                  {formatDate(exp.startDate)}
                  {exp.startDate && ' – '}
                  {exp.current ? 'Present' : formatDate(exp.endDate)}
                </div>
              </div>
              {exp.description && <p className="cv-desc">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="cv-section">
          <div className="cv-section-title">Education</div>
          {education.map(edu => (
            <div key={edu.id} className="cv-item">
              <div className="cv-item-header">
                <div>
                  <strong>{edu.degree}</strong>
                  {edu.school && <span className="cv-company"> · {edu.school}</span>}
                </div>
                <div className="cv-date">{edu.year}</div>
              </div>
              {edu.description && <p className="cv-desc">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {(skills.length > 0 || languages.length > 0) && (
        <div className="cv-section cv-section-two-col">
          {skills.length > 0 && (
            <div>
              <div className="cv-section-title">Skills</div>
              <div className="cv-tags-row">
                {skills.map(s => <span key={s.id} className="cv-tag">{s.name}</span>)}
              </div>
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <div className="cv-section-title">Languages</div>
              {languages.map(l => (
                <div key={l.id} className="cv-lang-row">
                  <span>{l.language}</span>
                  <span className="cv-lang-level">{l.level}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {projects.length > 0 && (
        <div className="cv-section">
          <div className="cv-section-title">Projects</div>
          {projects.map(proj => (
            <div key={proj.id} className="cv-item">
              <div className="cv-item-header">
                <strong>{proj.name}</strong>
                {proj.link && <a href={proj.link} className="cv-link" target="_blank" rel="noopener noreferrer">{proj.link}</a>}
              </div>
              {proj.description && <p className="cv-desc">{proj.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
