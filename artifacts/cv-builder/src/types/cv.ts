export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  profilePicture: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Language {
  id: string;
  language: string;
  level: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

export interface CVData {
  personal: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  projects: Project[];
}

export type TemplateType = 'minimal' | 'modern' | 'creative' | 'europass';

export const DEFAULT_CV_DATA: CVData = {
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    profilePicture: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
};
