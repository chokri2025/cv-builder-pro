import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FormPanel from '../components/FormPanel';
import CVPreview from '../components/CVPreview';
import { useCV } from '../hooks/useCV';
import { useSEO } from '../hooks/useSEO';

export default function CVBuilderPage() {
  const cv = useCV();
  const [showPreview, setShowPreview] = useState(false);
  const location = useLocation();

  useSEO({
    title: 'CV Builder Pro – Free Online Resume & CV Maker',
    description: 'Create a professional CV or resume in minutes. Choose from 3 beautiful templates and download as PDF. Free, no sign-up required.',
    canonical: 'https://cvbuilder.replit.app/',
  });

  useEffect(() => {
    const state = location.state as { prefilledJobTitle?: string } | null;
    if (state?.prefilledJobTitle) {
      cv.updatePersonal('jobTitle', state.prefilledJobTitle);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  return (
    <div className="app-layout">
      <div className={`form-side ${showPreview ? 'hidden-mobile' : ''}`}>
        <FormPanel
          cvData={cv.cvData}
          template={cv.template}
          setTemplate={cv.setTemplate}
          saved={cv.saved}
          onSave={cv.saveToStorage}
          onClear={cv.clearCV}
          updatePersonal={cv.updatePersonal}
          updateSummary={cv.updateSummary}
          addExperience={cv.addExperience}
          updateExperience={cv.updateExperience}
          removeExperience={cv.removeExperience}
          addEducation={cv.addEducation}
          updateEducation={cv.updateEducation}
          removeEducation={cv.removeEducation}
          addSkill={cv.addSkill}
          removeSkill={cv.removeSkill}
          addLanguage={cv.addLanguage}
          updateLanguage={cv.updateLanguage}
          removeLanguage={cv.removeLanguage}
          addProject={cv.addProject}
          updateProject={cv.updateProject}
          removeProject={cv.removeProject}
        />
      </div>
      <div className={`preview-side ${!showPreview ? 'hidden-mobile' : ''}`}>
        <CVPreview data={cv.cvData} template={cv.template} />
      </div>
      <button
        className="mobile-toggle-btn"
        onClick={() => setShowPreview(p => !p)}
      >
        {showPreview ? '← Edit' : 'Preview →'}
      </button>
    </div>
  );
}
