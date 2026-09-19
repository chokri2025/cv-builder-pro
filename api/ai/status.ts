import { getCopilotStatus } from '../../server/ai-copilot';

export async function GET(): Promise<Response> {
  return Response.json(getCopilotStatus(), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
