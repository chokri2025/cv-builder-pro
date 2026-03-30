import React, { useState, useRef } from 'react';
import { CVData, TemplateType } from '../types/cv';

const LANGUAGE_LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Conversational', 'Beginner'];
const TEMPLATES: { key: TemplateType; label: string }[] = [
  { key: 'minimal', label: 'Minimal' },
  { key: 'modern', label: 'Modern' },
  { key: 'creative', label: 'Creative' },
];

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

  return (
    <div className="form-panel">
      <div className="form-header">
        <div className="form-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>CV Builder <span className="pro-badge">PRO</span></span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button className="reset-btn" onClick={() => { if (window.confirm('Reset all CV data? This cannot be undone.')) onClear(); }} title="Reset CV">
            ↺
          </button>
          <button className="save-btn" onClick={onSave}>
            {saved ? '✓ Saved' : '💾 Save'}
          </button>
        </div>
      </div>

      <div className="template-switcher">
        <p className="section-label">Template</p>
        <div className="template-buttons">
          {TEMPLATES.map(t => (
            <button
              key={t.key}
              className={`template-btn ${template === t.key ? 'active' : ''}`}
              onClick={() => setTemplate(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-sections">
        <CollapsibleSection title="Personal Information" isOpen={openSections.personal} onToggle={() => toggleSection('personal')}>
          <div className="photo-upload-area" onClick={() => fileInputRef.current?.click()}>
            {cvData.personal.profilePicture
              ? <img src={cvData.personal.profilePicture} alt="Profile" className="photo-preview" />
              : <div className="photo-placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="#38bdf8" strokeWidth="2"/></svg>
                  <span>Add Photo</span>
                </div>
            }
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
          </div>
          <div className="field-grid">
            <FormField label="Full Name" value={cvData.personal.fullName} onChange={v => updatePersonal('fullName', v)} placeholder="John Doe" />
            <FormField label="Job Title" value={cvData.personal.jobTitle} onChange={v => updatePersonal('jobTitle', v)} placeholder="Software Engineer" />
            <FormField label="Email" value={cvData.personal.email} onChange={v => updatePersonal('email', v)} placeholder="john@example.com" type="email" />
            <FormField label="Phone" value={cvData.personal.phone} onChange={v => updatePersonal('phone', v)} placeholder="+1 (555) 000-0000" type="tel" />
            <FormField label="Location" value={cvData.personal.location} onChange={v => updatePersonal('location', v)} placeholder="New York, USA" />
            <FormField label="LinkedIn" value={cvData.personal.linkedin} onChange={v => updatePersonal('linkedin', v)} placeholder="linkedin.com/in/johndoe" />
            <FormField label="Portfolio" value={cvData.personal.portfolio} onChange={v => updatePersonal('portfolio', v)} placeholder="johndoe.dev" colSpan={2} />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Professional Summary" isOpen={openSections.summary} onToggle={() => toggleSection('summary')}>
          <textarea
            className="form-textarea"
            placeholder="Write a brief professional summary..."
            value={cvData.summary}
            onChange={e => updateSummary(e.target.value)}
            rows={4}
          />
        </CollapsibleSection>

        <CollapsibleSection title={`Work Experience (${cvData.experience.length})`} isOpen={openSections.experience} onToggle={() => toggleSection('experience')}>
          {cvData.experience.map((exp, i) => (
            <div key={exp.id} className="repeatable-item">
              <div className="item-header">
                <span className="item-num">{i + 1}</span>
                <button className="remove-btn" onClick={() => removeExperience(exp.id)}>✕</button>
              </div>
              <div className="field-grid">
                <FormField label="Job Title" value={exp.jobTitle} onChange={v => updateExperience(exp.id, 'jobTitle', v)} placeholder="Software Engineer" />
                <FormField label="Company" value={exp.company} onChange={v => updateExperience(exp.id, 'company', v)} placeholder="Acme Corp" />
                <FormField label="Location" value={exp.location} onChange={v => updateExperience(exp.id, 'location', v)} placeholder="New York, USA" />
                <div className="field-group">
                  <label className="field-label">Start Date</label>
                  <input className="form-input" type="month" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} />
                </div>
                {!exp.current && (
                  <div className="field-group">
                    <label className="field-label">End Date</label>
                    <input className="form-input" type="month" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} />
                  </div>
                )}
                <div className="field-group current-check">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={exp.current} onChange={e => updateExperience(exp.id, 'current', e.target.checked)} />
                    Current position
                  </label>
                </div>
              </div>
              <div className="field-group" style={{ marginTop: '0.5rem' }}>
                <label className="field-label">Description</label>
                <textarea className="form-textarea" value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} placeholder="Describe your responsibilities and achievements..." rows={3} />
              </div>
            </div>
          ))}
          <button className="add-btn" onClick={addExperience}>+ Add Experience</button>
        </CollapsibleSection>

        <CollapsibleSection title={`Education (${cvData.education.length})`} isOpen={openSections.education} onToggle={() => toggleSection('education')}>
          {cvData.education.map((edu, i) => (
            <div key={edu.id} className="repeatable-item">
              <div className="item-header">
                <span className="item-num">{i + 1}</span>
                <button className="remove-btn" onClick={() => removeEducation(edu.id)}>✕</button>
              </div>
              <div className="field-grid">
                <FormField label="Degree" value={edu.degree} onChange={v => updateEducation(edu.id, 'degree', v)} placeholder="B.Sc. Computer Science" />
                <FormField label="School" value={edu.school} onChange={v => updateEducation(edu.id, 'school', v)} placeholder="MIT" />
                <FormField label="Year" value={edu.year} onChange={v => updateEducation(edu.id, 'year', v)} placeholder="2018 – 2022" />
                <div className="field-group" style={{ gridColumn: 'span 2' }}>
                  <label className="field-label">Description</label>
                  <textarea className="form-textarea" value={edu.description} onChange={e => updateEducation(edu.id, 'description', e.target.value)} placeholder="Notable achievements, GPA, honors..." rows={2} />
                </div>
              </div>
            </div>
          ))}
          <button className="add-btn" onClick={addEducation}>+ Add Education</button>
        </CollapsibleSection>

        <CollapsibleSection title={`Skills (${cvData.skills.length})`} isOpen={openSections.skills} onToggle={() => toggleSection('skills')}>
          <div className="skills-input-area">
            <input
              className="form-input"
              type="text"
              placeholder="Type a skill and press Enter or comma..."
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

        <CollapsibleSection title={`Languages (${cvData.languages.length})`} isOpen={openSections.languages} onToggle={() => toggleSection('languages')}>
          {cvData.languages.map((lang) => (
            <div key={lang.id} className="repeatable-item lang-item">
              <input
                className="form-input"
                placeholder="Language"
                value={lang.language}
                onChange={e => updateLanguage(lang.id, 'language', e.target.value)}
              />
              <select className="form-select" value={lang.level} onChange={e => updateLanguage(lang.id, 'level', e.target.value)}>
                {LANGUAGE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <button className="remove-btn-inline" onClick={() => removeLanguage(lang.id)}>✕</button>
            </div>
          ))}
          <button className="add-btn" onClick={addLanguage}>+ Add Language</button>
        </CollapsibleSection>

        <CollapsibleSection title={`Projects (${cvData.projects.length})`} isOpen={openSections.projects} onToggle={() => toggleSection('projects')}>
          {cvData.projects.map((proj, i) => (
            <div key={proj.id} className="repeatable-item">
              <div className="item-header">
                <span className="item-num">{i + 1}</span>
                <button className="remove-btn" onClick={() => removeProject(proj.id)}>✕</button>
              </div>
              <div className="field-grid">
                <FormField label="Project Name" value={proj.name} onChange={v => updateProject(proj.id, 'name', v)} placeholder="My Awesome Project" />
                <FormField label="Link" value={proj.link} onChange={v => updateProject(proj.id, 'link', v)} placeholder="https://github.com/..." />
                <div className="field-group" style={{ gridColumn: 'span 2' }}>
                  <label className="field-label">Description</label>
                  <textarea className="form-textarea" value={proj.description} onChange={e => updateProject(proj.id, 'description', e.target.value)} placeholder="What did you build and what impact did it have?" rows={2} />
                </div>
              </div>
            </div>
          ))}
          <button className="add-btn" onClick={addProject}>+ Add Project</button>
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
