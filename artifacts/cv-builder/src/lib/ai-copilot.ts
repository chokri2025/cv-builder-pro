import type { CVData } from '../types/cv';

export interface AiCopilotStatus {
  enabled: boolean;
  provider: 'openai' | null;
}

export interface AiSummarySuggestion {
  suggested: string;
  rationale: string;
}

export interface AiExperienceSuggestion {
  id: string;
  suggestedDescription: string;
  rationale: string;
}

export interface AiCopilotSuggestion {
  summary: AiSummarySuggestion | null;
  experience: AiExperienceSuggestion[];
  warnings: string[];
}

export interface AiCopilotRequest {
  language: string;
  jobAd: string;
  cv: {
    jobTitle: string;
    summary: string;
    experience: Array<{
      id: string;
      jobTitle: string;
      description: string;
    }>;
    skills: string[];
  };
}

/**
 * Build the smallest useful payload for AI tailoring.
 *
 * Deliberately excludes full name, email, phone, location, LinkedIn,
 * portfolio URL and profile picture. AI optimization only needs professional
 * CV content plus the job description.
 */
export function buildAiCopilotRequest(
  data: CVData,
  jobAd: string,
  language: string,
): AiCopilotRequest {
  return {
    language,
    jobAd,
    cv: {
      jobTitle: data.personal.jobTitle,
      summary: data.summary,
      experience: data.experience.map((item) => ({
        id: item.id,
        jobTitle: item.jobTitle,
        description: item.description,
      })),
      skills: data.skills.map((skill) => skill.name),
    },
  };
}

export async function fetchAiCopilotStatus(): Promise<AiCopilotStatus> {
  const response = await fetch('/api/ai/status', {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) return { enabled: false, provider: null };

  const payload = (await response.json()) as Partial<AiCopilotStatus>;
  return {
    enabled: payload.enabled === true,
    provider: payload.provider === 'openai' ? 'openai' : null,
  };
}

export async function requestCvOptimization(
  data: CVData,
  jobAd: string,
  language: string,
): Promise<AiCopilotSuggestion> {
  const response = await fetch('/api/ai/optimize', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buildAiCopilotRequest(data, jobAd, language)),
  });

  if (!response.ok) {
    let code = 'AI_PROVIDER_ERROR';
    try {
      const payload = (await response.json()) as { error?: string };
      if (payload.error) code = payload.error;
    } catch {
      // Keep the generic code when the response is not JSON.
    }
    throw new Error(code);
  }

  return (await response.json()) as AiCopilotSuggestion;
}
