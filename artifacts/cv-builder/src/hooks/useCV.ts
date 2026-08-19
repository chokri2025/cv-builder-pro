import { useState, useEffect, useCallback, useRef } from 'react';
import {
  CVData,
  DEFAULT_CV_DATA,
  WorkExperience,
  Education,
  Skill,
  Language,
  Project,
  TemplateType,
} from '../types/cv';

const STORAGE_KEY = 'cv-builder-data';
const TEMPLATE_KEY = 'cv-builder-template';
const AUTOSAVE_DELAY_MS = 1500;

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function useCV() {
  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_CV_DATA;
    } catch {
      return DEFAULT_CV_DATA;
    }
  });

  const [template, setTemplate] = useState<TemplateType>(() => {
    return (localStorage.getItem(TEMPLATE_KEY) as TemplateType) || 'minimal';
  });

  const [saved, setSaved] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData));
      localStorage.setItem(TEMPLATE_KEY, template);
    }, AUTOSAVE_DELAY_MS);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [cvData, template]);

  const saveToStorage = useCallback(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData));
    localStorage.setItem(TEMPLATE_KEY, template);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [cvData, template]);

  const updatePersonal = useCallback((field: string, value: string) => {
    setCvData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  }, []);

  const updateSummary = useCallback((value: string) => {
    setCvData((prev) => ({ ...prev, summary: value }));
  }, []);

  const addExperience = useCallback(() => {
    const newExp: WorkExperience = {
      id: generateId(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setCvData((prev) => ({ ...prev, experience: [...prev.experience, newExp] }));
  }, []);

  const updateExperience = useCallback((id: string, field: string, value: string | boolean) => {
    setCvData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setCvData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  }, []);

  const addEducation = useCallback(() => {
    const newEdu: Education = {
      id: generateId(),
      degree: '',
      school: '',
      year: '',
      description: '',
    };
    setCvData((prev) => ({ ...prev, education: [...prev.education, newEdu] }));
  }, []);

  const updateEducation = useCallback((id: string, field: string, value: string) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  }, []);

  const addSkill = useCallback((name: string) => {
    if (!name.trim()) return;
    const newSkill: Skill = { id: generateId(), name: name.trim() };
    setCvData((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  }, []);

  const addLanguage = useCallback(() => {
    const newLang: Language = { id: generateId(), language: '', level: 'Conversational' };
    setCvData((prev) => ({ ...prev, languages: [...prev.languages, newLang] }));
  }, []);

  const updateLanguage = useCallback((id: string, field: string, value: string) => {
    setCvData((prev) => ({
      ...prev,
      languages: prev.languages.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    }));
  }, []);

  const removeLanguage = useCallback((id: string) => {
    setCvData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l.id !== id),
    }));
  }, []);

  const addProject = useCallback(() => {
    const newProj: Project = { id: generateId(), name: '', description: '', link: '' };
    setCvData((prev) => ({ ...prev, projects: [...prev.projects, newProj] }));
  }, []);

  const updateProject = useCallback((id: string, field: string, value: string) => {
    setCvData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setCvData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  }, []);

  const clearCV = useCallback(() => {
    setCvData(DEFAULT_CV_DATA);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TEMPLATE_KEY);
  }, []);

  return {
    cvData,
    template,
    setTemplate,
    saved,
    saveToStorage,
    updatePersonal,
    updateSummary,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    removeSkill,
    addLanguage,
    updateLanguage,
    removeLanguage,
    addProject,
    updateProject,
    removeProject,
    clearCV,
  };
}
