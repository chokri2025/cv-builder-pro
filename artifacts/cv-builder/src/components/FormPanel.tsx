import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CVData, TemplateType } from '../types/cv';
import LanguageSwitcher from './LanguageSwitcher';

const TEMPLATE_KEYS: TemplateType[] = ['minimal', 'modern', 'creative'];

type SectionKey = 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'languages' | 'projects';

interface FormPanelProps {
  cvData: CVData;
  template: TemplateType;
  setTemplate: (t: TemplateType) => void;
  saved: boolean;
  onSave: () => void;
  onClear: () => void;
  updatePersonal: (field: string, value: string) => void;
  updateSummary: (value: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, field: string, value: string | boolean) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, field: string, value: string) => void;
  removeEducation: (id: string) => void;
  addSkill: (name: string) => void;
  removeSkill: (id: string) => void;
  addLanguage: () => void;
  updateLanguage: (id: string, field: string, value: string) => void;
  removeLanguage: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, field: string, value: string) => void;
  removeProject: (id: string) => void;
}

export default function FormPanel(props: FormPanelProps) {
  const { t } = useTranslation();
  const { cvData, template, setTemplate, saved, onSave, onClear,
    updatePersonal, updateSummary,
    addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation,
    addSkill, removeSkill,
    addLanguage, updateLanguage, removeLanguage,
    addProject, updateProject, removeProject } = props;

  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    personal: true, summary: true, experience: false, education: false,
    skills: false, languages: false, projects: false,
  });
  const [skillInput, setSkillInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (key: SectionKey) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updatePersonal('profilePicture', reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (skillInput.trim()) {
        addSkill(skillInput.trim());
        setSkillInput('');
      }
    }
  };

  const LANGUAGE_LEVELS = [
    'Native', 'Fluent', 'Advanced', 'Intermediate', 'Conversational', 'Beginner'
  ] as const;

  return (
    <div className="form-panel">
      <div className="form-header">
        <div className="form-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{t('nav.logo')} <span className="pro-badge">{t('nav.pro')}</span></span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button className="reset-btn" onClick={() => { if (window.confirm(t('builder.resetConfirm'))) onClear(); }} title={t('builder.reset')}>
            {t('builder.reset')}
          </button>
          <button className="save-btn" onClick={onSave}>
            {saved ? t('builder.saved') : t('builder.save')}
          </button>
        </div>
      </div>

      <div className="lang-bar">
        <span className="lang-bar-label">{t('languageSwitcher.label')}</span>
        <LanguageSwitcher />
      </div>

      <div className="template-switcher">
        <p className="section-label">{t('builder.template')}</p>
        <div className="template-buttons">
          {TEMPLATE_KEYS.map(key => (
            <button
              key={key}
              className={`template-btn ${template === key ? 'active' : ''}`}
              onClick={() => setTemplate(key)}
            >
              {t(`builder.templates.${key}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="form-sections">
        <CollapsibleSection title={t('sections.personal')} isOpen={openSections.personal} onToggle={() => toggleSection('personal')}>
          <div className="photo-upload-area" onClick={() => fileInputRef.current?.click()}>
            {cvData.personal.profilePicture
              ? <img src={cvData.personal.profilePicture} alt="Profile" className="photo-preview" />
              : <div className="photo-placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="#38bdf8" strokeWidth="2"/></svg>
                  <span>{t('fields.addPhoto')}</span>
                </div>
            }
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
          </div>
          <div className="field-grid">
            <FormField label={t('fields.fullName')} value={cvData.personal.fullName} onChange={v => updatePersonal('fullName', v)} placeholder={t('placeholders.fullName')} />
            <FormField label={t('fields.jobTitle')} value={cvData.personal.jobTitle} onChange={v => updatePersonal('jobTitle', v)} placeholder={t('placeholders.jobTitle')} />
            <FormField label={t('fields.email')} value={cvData.personal.email} onChange={v => updatePersonal('email', v)} placeholder={t('placeholders.email')} type="email" />
            <FormField label={t('fields.phone')} value={cvData.personal.phone} onChange={v => updatePersonal('phone', v)} placeholder={t('placeholders.phone')} type="tel" />
            <FormField label={t('fields.location')} value={cvData.personal.location} onChange={v => updatePersonal('location', v)} placeholder={t('placeholders.location')} />
            <FormField label={t('fields.linkedin')} value={cvData.personal.linkedin} onChange={v => updatePersonal('linkedin', v)} placeholder={t('placeholders.linkedin')} />
            <FormField label={t('fields.portfolio')} value={cvData.personal.portfolio} onChange={v => updatePersonal('portfolio', v)} placeholder={t('placeholders.portfolio')} colSpan={2} />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title={t('sections.summary')} isOpen={openSections.summary} onToggle={() => toggleSection('summary')}>
          <textarea
            className="form-textarea"
            placeholder={t('fields.summaryPlaceholder')}
            value={cvData.summary}
            onChange={e => updateSummary(e.target.value)}
            rows={4}
          />
        </CollapsibleSection>

        <CollapsibleSection title={`${t('sections.experience')} (${cvData.experience.length})`} isOpen={openSections.experience} onToggle={() => toggleSection('experience')}>
          {cvData.experience.map((exp, i) => (
            <div key={exp.id} className="repeatable-item">
              <div className="item-header">
                <span className="item-num">{i + 1}</span>
                <button className="remove-btn" onClick={() => removeExperience(exp.id)}>✕</button>
              </div>
              <div className="field-grid">
                <FormField label={t('fields.jobTitle')} value={exp.jobTitle} onChange={v => updateExperience(exp.id, 'jobTitle', v)} placeholder={t('placeholders.jobTitle')} />
                <FormField label={t('fields.company')} value={exp.company} onChange={v => updateExperience(exp.id, 'company', v)} placeholder={t('placeholders.company')} />
                <FormField label={t('fields.location')} value={exp.location} onChange={v => updateExperience(exp.id, 'location', v)} placeholder={t('placeholders.location')} />
                <div className="field-group">
                  <label className="field-label">{t('fields.startDate')}</label>
                  <input className="form-input" type="month" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} />
                </div>
                {!exp.current && (
                  <div className="field-group">
                    <label className="field-label">{t('fields.endDate')}</label>
                    <input className="form-input" type="month" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} />
                  </div>
                )}
                <div className="field-group current-check">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={exp.current} onChange={e => updateExperience(exp.id, 'current', e.target.checked)} />
                    {t('fields.currentPosition')}
                  </label>
                </div>
              </div>
              <div className="field-group" style={{ marginTop: '0.5rem' }}>
                <label className="field-label">{t('fields.description')}</label>
                <textarea className="form-textarea" value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} placeholder={t('placeholders.experienceDescription')} rows={3} />
              </div>
            </div>
          ))}
          <button className="add-btn" onClick={addExperience}>{t('actions.addExperience')}</button>
        </CollapsibleSection>

        <CollapsibleSection title={`${t('sections.education')} (${cvData.education.length})`} isOpen={openSections.education} onToggle={() => toggleSection('education')}>
          {cvData.education.map((edu, i) => (
            <div key={edu.id} className="repeatable-item">
              <div className="item-header">
                <span className="item-num">{i + 1}</span>
                <button className="remove-btn" onClick={() => removeEducation(edu.id)}>✕</button>
              </div>
              <div className="field-grid">
                <FormField label={t('fields.degree')} value={edu.degree} onChange={v => updateEducation(edu.id, 'degree', v)} placeholder={t('placeholders.degree')} />
                <FormField label={t('fields.school')} value={edu.school} onChange={v => updateEducation(edu.id, 'school', v)} placeholder={t('placeholders.school')} />
                <FormField label={t('fields.year')} value={edu.year} onChange={v => updateEducation(edu.id, 'year', v)} placeholder={t('placeholders.year')} />
                <div className="field-group" style={{ gridColumn: 'span 2' }}>
                  <label className="field-label">{t('fields.description')}</label>
                  <textarea className="form-textarea" value={edu.description} onChange={e => updateEducation(edu.id, 'description', e.target.value)} placeholder={t('placeholders.educationDescription')} rows={2} />
                </div>
              </div>
            </div>
          ))}
          <button className="add-btn" onClick={addEducation}>{t('actions.addEducation')}</button>
        </CollapsibleSection>

        <CollapsibleSection title={`${t('sections.skills')} (${cvData.skills.length})`} isOpen={openSections.skills} onToggle={() => toggleSection('skills')}>
          <div className="skills-input-area">
            <input
              className="form-input"
              type="text"
              placeholder={t('fields.skillPlaceholder')}
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
            />
          </div>
          <div className="skills-tags">
            {cvData.skills.map(skill => (
              <span key={skill.id} className="skill-tag">
                {skill.name}
                <button onClick={() => removeSkill(skill.id)}>✕</button>
              </span>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title={`${t('sections.languages')} (${cvData.languages.length})`} isOpen={openSections.languages} onToggle={() => toggleSection('languages')}>
          {cvData.languages.map((lang) => (
            <div key={lang.id} className="repeatable-item lang-item">
              <input
                className="form-input"
                placeholder={t('fields.language')}
                value={lang.language}
                onChange={e => updateLanguage(lang.id, 'language', e.target.value)}
              />
              <select className="form-select" value={lang.level} onChange={e => updateLanguage(lang.id, 'level', e.target.value)}>
                {LANGUAGE_LEVELS.map(l => (
                  <option key={l} value={l}>{t(`languageLevels.${l}`)}</option>
                ))}
              </select>
              <button className="remove-btn-inline" onClick={() => removeLanguage(lang.id)}>✕</button>
            </div>
          ))}
          <button className="add-btn" onClick={addLanguage}>{t('actions.addLanguage')}</button>
        </CollapsibleSection>

        <CollapsibleSection title={`${t('sections.projects')} (${cvData.projects.length})`} isOpen={openSections.projects} onToggle={() => toggleSection('projects')}>
          {cvData.projects.map((proj, i) => (
            <div key={proj.id} className="repeatable-item">
              <div className="item-header">
                <span className="item-num">{i + 1}</span>
                <button className="remove-btn" onClick={() => removeProject(proj.id)}>✕</button>
              </div>
              <div className="field-grid">
                <FormField label={t('fields.projectName')} value={proj.name} onChange={v => updateProject(proj.id, 'name', v)} placeholder={t('placeholders.projectName')} />
                <FormField label={t('fields.link')} value={proj.link} onChange={v => updateProject(proj.id, 'link', v)} placeholder={t('placeholders.projectLink')} />
                <div className="field-group" style={{ gridColumn: 'span 2' }}>
                  <label className="field-label">{t('fields.description')}</label>
                  <textarea className="form-textarea" value={proj.description} onChange={e => updateProject(proj.id, 'description', e.target.value)} placeholder={t('placeholders.projectDescription')} rows={2} />
                </div>
              </div>
            </div>
          ))}
          <button className="add-btn" onClick={addProject}>{t('actions.addProject')}</button>
        </CollapsibleSection>
      </div>
    </div>
  );
}

function CollapsibleSection({
  title, isOpen, onToggle, children,
}: { title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="collapsible-section">
      <button className="section-toggle" onClick={onToggle}>
        <span>{title}</span>
        <span className={`chevron ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      {isOpen && <div className="section-content">{children}</div>}
    </div>
  );
}

function FormField({
  label, value, onChange, placeholder, type = 'text', colSpan,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; colSpan?: number }) {
  return (
    <div className="field-group" style={colSpan ? { gridColumn: `span ${colSpan}` } : undefined}>
      <label className="field-label">{label}</label>
      <input
        className="form-input"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
