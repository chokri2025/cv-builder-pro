export default function handler(
  request: { method?: string },
  response: { status(code: number): any; json(body: unknown): void },
): void {
  response.status(200).json({ ok: true, method: request.method ?? null });
}
