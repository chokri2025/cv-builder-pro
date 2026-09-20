export interface DiscoveredJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  applyUrl: string;
  createdAt?: string;
  contractType?: string;
  source: 'adzuna';
}

export interface JobSearchInput {
  what: string;
  where?: string;
  country?: string;
  page?: number;
  resultsPerPage?: number;
}

export async function searchJobs(input: JobSearchInput): Promise<DiscoveredJob[]> {
  const params = new URLSearchParams({
    what: input.what.trim(),
    where: input.where?.trim() ?? '',
    country: input.country ?? 'fr',
    page: String(input.page ?? 1),
    results_per_page: String(input.resultsPerPage ?? 20),
  });
  const response = await fetch(`/api/jobs/search?${params.toString()}`);
  if (!response.ok) throw new Error('JOB_SEARCH_FAILED');
  const body = await response.json() as { results?: DiscoveredJob[] };
  return Array.isArray(body.results) ? body.results : [];
}
