import { Router } from 'express';

const router = Router();

router.get('/search', async (req, res) => {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) {
    return res.status(503).json({ error: 'JOB_PROVIDER_NOT_CONFIGURED' });
  }

  const what = String(req.query.what ?? '').trim().slice(0, 120);
  const where = String(req.query.where ?? '').trim().slice(0, 120);
  const country = String(req.query.country ?? 'fr').toLowerCase().replace(/[^a-z]/g, '').slice(0, 2) || 'fr';
  const page = Math.max(1, Math.min(20, Number(req.query.page) || 1));
  const resultsPerPage = Math.max(1, Math.min(50, Number(req.query.results_per_page) || 20));

  if (!what) return res.status(400).json({ error: 'JOB_QUERY_REQUIRED' });

  const url = new URL(`https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`);
  url.searchParams.set('app_id', appId);
  url.searchParams.set('app_key', appKey);
  url.searchParams.set('results_per_page', String(resultsPerPage));
  url.searchParams.set('what', what);
  if (where) url.searchParams.set('where', where);
  url.searchParams.set('content-type', 'application/json');

  try {
    const upstream = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!upstream.ok) return res.status(502).json({ error: 'JOB_PROVIDER_ERROR' });
    const payload = await upstream.json() as any;
    const results = Array.isArray(payload.results) ? payload.results.map((job: any) => ({
      id: String(job.id ?? ''),
      title: String(job.title ?? ''),
      company: String(job.company?.display_name ?? ''),
      location: String(job.location?.display_name ?? ''),
      description: String(job.description ?? ''),
      applyUrl: String(job.redirect_url ?? ''),
      createdAt: job.created ? String(job.created) : undefined,
      contractType: job.contract_type ? String(job.contract_type) : undefined,
      source: 'adzuna',
    })) : [];
    return res.json({ count: Number(payload.count ?? results.length), results });
  } catch {
    return res.status(502).json({ error: 'JOB_PROVIDER_UNAVAILABLE' });
  }
});

export default router;
