import type { CVData, TemplateType } from '../types/cv';

export const CV_VERSIONS_STORAGE_KEY = 'cv-builder-versions-v1';
export const MAX_CV_VERSIONS = 8;

export interface CvVersion {
  id: string;
  name: string;
  createdAt: string;
  cvData: CVData;
  template: TemplateType;
}

const TEMPLATES: TemplateType[] = ['minimal', 'modern', 'professional', 'executive', 'europass'];

function isTemplate(value: unknown): value is TemplateType {
  return typeof value === 'string' && TEMPLATES.includes(value as TemplateType);
}

function hasCvShape(value: unknown): value is CVData {
  if (!value || typeof value !== 'object') return false;
  const cv = value as Record<string, unknown>;
  return (
    cv.personal !== null &&
    typeof cv.personal === 'object' &&
    typeof cv.summary === 'string' &&
    Array.isArray(cv.experience) &&
    Array.isArray(cv.education) &&
    Array.isArray(cv.skills) &&
    Array.isArray(cv.languages) &&
    Array.isArray(cv.projects)
  );
}

export function parseCvVersions(raw: string | null): CvVersion[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is CvVersion => {
        if (!item || typeof item !== 'object') return false;
        const candidate = item as Record<string, unknown>;
        return (
          typeof candidate.id === 'string' &&
          typeof candidate.name === 'string' &&
          candidate.name.trim().length > 0 &&
          typeof candidate.createdAt === 'string' &&
          isTemplate(candidate.template) &&
          hasCvShape(candidate.cvData)
        );
      })
      .slice(0, MAX_CV_VERSIONS);
  } catch {
    return [];
  }
}

export function createCvVersion(
  name: string,
  cvData: CVData,
  template: TemplateType,
  now = new Date(),
): CvVersion {
  const cleanName = name.trim().slice(0, 60);
  if (!cleanName) throw new Error('VERSION_NAME_REQUIRED');

  return {
    id: `cvv-${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    name: cleanName,
    createdAt: now.toISOString(),
    cvData: JSON.parse(JSON.stringify(cvData)) as CVData,
    template,
  };
}

export function prependCvVersion(
  versions: CvVersion[],
  version: CvVersion,
): CvVersion[] {
  return [version, ...versions].slice(0, MAX_CV_VERSIONS);
}
