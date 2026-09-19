import {
  CopilotError,
  optimizeCvForJob,
  validateOptimizeInput,
} from '../../server/ai-copilot';

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return Response.json({ error: 'METHOD_NOT_ALLOWED' }, { status: 405 });
    }

    try {
      const raw: unknown = await request.json();
      const input = validateOptimizeInput(raw);
      const result = await optimizeCvForJob(input);

      return Response.json(result, {
        headers: { 'Cache-Control': 'no-store' },
      });
    } catch (error) {
      if (error instanceof CopilotError) {
        return Response.json(
          { error: error.code, message: error.message },
          { status: error.status, headers: { 'Cache-Control': 'no-store' } },
        );
      }

      return Response.json(
        { error: 'AI_PROVIDER_ERROR', message: 'Unexpected AI Copilot error.' },
        { status: 500, headers: { 'Cache-Control': 'no-store' } },
      );
    }
  },
};
