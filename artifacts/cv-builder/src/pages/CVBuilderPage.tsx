import { useState } from 'react';
import FormPanel from '../components/FormPanel';
import CVPreview from '../components/CVPreview';
import { useCV } from '../hooks/useCV';

export default function CVBuilderPage() {
  const cv = useCV();
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="app-layout">
      <div className={`form-side ${showPreview ? 'hidden-mobile' : ''}`}>
        <FormPanel
          cvData={cv.cvData}
          template={cv.template}
          setTemplate={cv.setTemplate}
          saved={cv.saved}
          onSave={cv.saveToStorage}
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
