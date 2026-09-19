import {
  CopilotError,
  optimizeCvForJob,
  validateOptimizeInput,
} from '../../server/ai-copilot';

interface ApiRequest {
  method?: string;
  body?: unknown;
}

interface ApiResponse {
  status(code: number): ApiResponse;
  setHeader(name: string, value: string): void;
  json(body: unknown): void;
}

function parseBody(body: unknown): unknown {
  if (typeof body !== 'string') return body;
  try {
    return JSON.parse(body) as unknown;
  } catch {
    return null;
  }
}

export default async function handler(
  request: ApiRequest,
  response: ApiResponse,
): Promise<void> {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  response.setHeader('Cache-Control', 'no-store');

  try {
    const input = validateOptimizeInput(parseBody(request.body));
    const result = await optimizeCvForJob(input);
    response.status(200).json(result);
  } catch (error) {
    if (error instanceof CopilotError) {
      response.status(error.status).json({ error: error.code, message: error.message });
      return;
    }

    response
      .status(500)
      .json({ error: 'AI_PROVIDER_ERROR', message: 'Unexpected AI Copilot error.' });
  }
}
