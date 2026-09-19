import { getCopilotStatus } from '../../server/ai-copilot';

interface ApiRequest {
  method?: string;
}

interface ApiResponse {
  status(code: number): ApiResponse;
  setHeader(name: string, value: string): void;
  json(body: unknown): void;
}

export default function handler(request: ApiRequest, response: ApiResponse): void {
  if (request.method !== 'GET') {
    response.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json(getCopilotStatus());
}
