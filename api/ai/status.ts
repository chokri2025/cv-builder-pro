import { getCopilotStatus } from '../../server/ai-copilot';

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'GET') {
      return Response.json({ error: 'METHOD_NOT_ALLOWED' }, { status: 405 });
    }

    return Response.json(getCopilotStatus(), {
      headers: { 'Cache-Control': 'no-store' },
    });
  },
};
