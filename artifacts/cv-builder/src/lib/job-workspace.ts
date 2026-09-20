export const JOB_WORKSPACE_STORAGE_KEY = 'cv-builder-saved-jobs-v1';
export const MAX_SAVED_JOBS = 20;

export type JobStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';

export interface SavedJob {
  id: string;
  title: string;
  company: string;
  jobAd: string;
  status: JobStatus;
  notes?: string;
  followUpDate?: string;
  source?: string;
  sourceJobId?: string;
  url?: string;
  location?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const STATUSES: JobStatus[] = ['saved', 'applied', 'interview', 'offer', 'rejected'];

function isJobStatus(value: unknown): value is JobStatus {
  return typeof value === 'string' && STATUSES.includes(value as JobStatus);
}
function cleanText(value: string, max: number): string { return value.trim().slice(0, max); }

export function parseSavedJobs(raw: string | null): SavedJob[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is SavedJob => {
      if (!item || typeof item !== 'object') return false;
      const c = item as Record<string, unknown>;
      return typeof c.id === 'string' && typeof c.title === 'string' && c.title.trim().length > 0 &&
        typeof c.company === 'string' && typeof c.jobAd === 'string' && c.jobAd.trim().length >= 40 &&
        isJobStatus(c.status) && typeof c.createdAt === 'string' && typeof c.updatedAt === 'string';
    }).slice(0, MAX_SAVED_JOBS);
  } catch { return []; }
}

export function createSavedJob(title: string, company: string, jobAd: string, now = new Date()): SavedJob {
  const cleanTitle = cleanText(title, 120);
  const cleanCompany = cleanText(company, 120);
  const cleanJobAd = jobAd.trim().slice(0, 15_000);
  if (!cleanTitle) throw new Error('JOB_TITLE_REQUIRED');
  if (cleanJobAd.length < 40) throw new Error('JOB_AD_TOO_SHORT');
  const timestamp = now.toISOString();
  return { id: `job-${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`, title: cleanTitle,
    company: cleanCompany, jobAd: cleanJobAd, status: 'saved', notes: '', followUpDate: '',
    createdAt: timestamp, updatedAt: timestamp };
}

export function prependSavedJob(jobs: SavedJob[], job: SavedJob): SavedJob[] {
  const withoutDuplicate = jobs.filter((item) =>
    item.id !== job.id && !(job.source && job.sourceJobId && item.source === job.source && item.sourceJobId === job.sourceJobId)
  );
  return [job, ...withoutDuplicate].slice(0, MAX_SAVED_JOBS);
}
export function updateSavedJobStatus(jobs: SavedJob[], id: string, status: JobStatus, now = new Date()): SavedJob[] {
  return jobs.map((job) => job.id === id ? { ...job, status, updatedAt: now.toISOString() } : job);
}
export function deleteSavedJob(jobs: SavedJob[], id: string): SavedJob[] { return jobs.filter((job) => job.id !== id); }
export function summarizeJobStatuses(jobs: SavedJob[]): Record<JobStatus, number> {
  return jobs.reduce<Record<JobStatus, number>>((s,j)=>{s[j.status]+=1;return s;},{saved:0,applied:0,interview:0,offer:0,rejected:0});
}
export function filterAndSortJobs(jobs: SavedJob[], status: JobStatus | null): SavedJob[] {
  return [...jobs].filter((job)=>status===null||job.status===status).sort((a,b)=>Date.parse(b.updatedAt)-Date.parse(a.updatedAt));
}
export function updateSavedJobDetails(jobs: SavedJob[], id: string, details: { notes: string; followUpDate: string }, now = new Date()): SavedJob[] {
  const notes=cleanText(details.notes,2000);
  const followUpDate=/^\d{4}-\d{2}-\d{2}$/.test(details.followUpDate)?details.followUpDate:'';
  return jobs.map((job)=>job.id===id?{...job,notes,followUpDate,updatedAt:now.toISOString()}:job);
}
