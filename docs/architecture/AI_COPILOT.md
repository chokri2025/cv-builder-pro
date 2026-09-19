# AI Copilot architecture

The AI Copilot is intentionally **disabled by default**. The CV Builder, ATS readiness score,
and Job Match continue to work without an AI provider or API quota.

## Activation

The Vercel deployment only exposes AI suggestions when all of the following are configured:

- `AI_COPILOT_ENABLED=true`
- `AI_PROVIDER=openai` (optional today; OpenAI is the only implemented provider)
- `OPENAI_API_KEY=<server-side key>`
- `OPENAI_MODEL=<model id>` (optional; defaults to `gpt-5.6-luna`)

The frontend checks `GET /api/ai/status`. If the endpoint is unavailable or the feature is
disabled, AI controls are not shown.

## Privacy boundary

An AI request happens only after the user explicitly chooses **Optimize for this job**.
The browser sends:

- target job description
- target job title
- professional summary
- experience ids, job titles, and descriptions
- skill names
- selected UI language

The client deliberately excludes full name, email, phone, location, employer names, dates,
LinkedIn URL, portfolio URL, and profile picture. The server validates size/shape before calling
the provider.

## Factuality boundary

The provider prompt treats the pasted job advert as untrusted reference text and forbids
inventing skills, employers, dates, qualifications, responsibilities, metrics, or achievements.
Suggestions are proposals only; the user must explicitly apply each summary or experience edit.

## Provider boundary

Provider-specific code lives behind `server/ai-copilot.ts`. The frontend only calls the local
`/api/ai/*` contract. This keeps the UI independent from OpenAI and allows adding Gemini,
OpenRouter, or Vercel AI Gateway later without rewriting the CV Builder.

## Before enabling publicly

Do not set `AI_COPILOT_ENABLED=true` in production until the following are in place:

1. server-side rate limiting / abuse protection;
2. a funded provider account and spend cap;
3. production smoke tests of `/api/ai/status` and `/api/ai/optimize`;
4. monitoring for 429/5xx provider failures;
5. privacy-policy wording covering explicit AI processing.
