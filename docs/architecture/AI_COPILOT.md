# AI Copilot architecture

The AI Copilot is intentionally **disabled by default**. The CV Builder, ATS readiness score,
and Job Match continue to work without an AI provider, API quota, or backend deployment.

## Deployment boundary

The public CV Builder remains a static Vite application on Vercel. AI endpoints live in the
existing `artifacts/api-server` service rather than in the frontend Vercel project.

This separation protects the current SEO/static deployment from AI runtime changes and lets the
AI service be deployed independently on any Node-compatible host.

The frontend only attempts to contact AI when this build-time variable is present:

- `VITE_AI_API_BASE_URL=https://<ai-api-host>`

When it is absent, the AI controls stay hidden and no AI/network request is made.

## API-server activation

The separately deployed API server only reports AI as enabled when all required server-side
configuration is present:

- `AI_COPILOT_ENABLED=true`
- `AI_PROVIDER=openai` (optional today; OpenAI is the only implemented provider)
- `OPENAI_API_KEY=<server-side key>`
- `OPENAI_MODEL=<model id>` (optional; defaults to `gpt-5.6-luna`)

Endpoints:

- `GET /api/ai/status`
- `POST /api/ai/optimize`

The OpenAI key never belongs in the Vite frontend and must never use a `VITE_` prefix.

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
LinkedIn URL, portfolio URL, and profile picture. The API server validates size/shape before
calling the provider.

## Factuality boundary

The provider prompt treats the pasted job advert as untrusted reference text and forbids
inventing skills, employers, dates, qualifications, responsibilities, metrics, or achievements.
Suggestions are proposals only; the user must explicitly apply each summary or experience edit.

## Provider boundary

Provider-specific code lives behind `artifacts/api-server/src/lib/ai-copilot.ts`. The frontend
only knows the local API contract. This allows adding Gemini, OpenRouter, or an AI gateway later
without rewriting the CV Builder UI.

## Before enabling publicly

Do not set `AI_COPILOT_ENABLED=true` in production until the following are in place:

1. deploy the API server over HTTPS and set an explicit CORS allowlist for the CV Builder origin;
2. server-side rate limiting / abuse protection;
3. a funded provider account and a spend cap;
4. production smoke tests of `/api/ai/status` and `/api/ai/optimize`;
5. monitoring for 429/5xx provider failures;
6. privacy-policy wording covering explicit AI processing.
