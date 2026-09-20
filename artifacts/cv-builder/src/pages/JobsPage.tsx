import { FormEvent, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCV } from '../hooks/useCV';
import { analyseMatch } from '../lib/ats-match';
import { searchJobs, type DiscoveredJob } from '../lib/job-discovery';
import {
  JOB_WORKSPACE_STORAGE_KEY,
  createSavedJob,
  parseSavedJobs,
  prependSavedJob,
} from '../lib/job-workspace';

export default function JobsPage() {
  const { i18n } = useTranslation();
  const params = useParams<{ lang?: string }>();
  const cv = useCV();
  const [what, setWhat] = useState(cv.cvData.personal.jobTitle || '');
  const [where, setWhere] = useState(cv.cvData.personal.location || '');
  const [jobs, setJobs] = useState<DiscoveredJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const lang = i18n.language?.slice(0, 2) || 'en';
  const country = lang === 'fr' ? 'fr' : 'gb';
  const builderHref = params.lang ? `/${params.lang}` : '/';

  const scores = useMemo(
    () => new Map(jobs.map((job) => [job.id, analyseMatch(job.description, cv.cvData, lang)])),
    [jobs, cv.cvData, lang],
  );

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!what.trim()) return;
    setLoading(true);
    setMessage('');
    try {
      const result = await searchJobs({ what, where, country });
      setJobs(result);
      if (!result.length) setMessage('No jobs found. Try a broader search.');
    } catch {
      setMessage('Job search is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const saveJob = (job: DiscoveredJob) => {
    try {
      const existing = parseSavedJobs(localStorage.getItem(JOB_WORKSPACE_STORAGE_KEY));
      if (existing.some((item) => item.sourceJobId === job.id && item.source === job.source)) {
        setMessage('This job is already in your tracker.');
        return;
      }
      const saved = createSavedJob(job.title, job.company, job.description);
      const enriched = {
        ...saved,
        source: job.source,
        sourceJobId: job.id,
        url: job.applyUrl,
        location: job.location,
        publishedAt: job.createdAt,
      };
      localStorage.setItem(
        JOB_WORKSPACE_STORAGE_KEY,
        JSON.stringify(prependSavedJob(existing, enriched)),
      );
      setMessage(`${job.title} saved to your tracker.`);
    } catch {
      setMessage('Could not save this job.');
    }
  };

  return (
    <main className="jobs-page">
      <header className="jobs-hero">
        <div>
          <span className="jobs-kicker">CV Builder Pro · Job Discovery</span>
          <h1>Find jobs that match your CV</h1>
          <p>Search real offers, see your live CV match, save the best ones and track every application.</p>
        </div>
        <Link className="jobs-builder-link" to={builderHref}>← CV Builder & Tracker</Link>
      </header>

      <form className="jobs-search" onSubmit={submit}>
        <input value={what} onChange={(e) => setWhat(e.target.value)} placeholder="Job title or keywords" />
        <input value={where} onChange={(e) => setWhere(e.target.value)} placeholder="City or location" />
        <button disabled={loading || !what.trim()}>{loading ? 'Searching…' : 'Search jobs'}</button>
      </form>

      {message && <p className="jobs-message">{message}</p>}

      <section className="jobs-grid">
        {jobs.map((job) => {
          const match = scores.get(job.id);
          return (
            <article className="job-card" key={job.id}>
              <div className="job-card-head">
                <div>
                  <h2>{job.title}</h2>
                  <p>{job.company}{job.location ? ` · ${job.location}` : ''}</p>
                </div>
                {match && !match.tooShort && <strong className="job-match-score">{match.score}% match</strong>}
              </div>
              <p className="job-description">{job.description}</p>
              {match && !match.tooShort && match.missing.length > 0 && (
                <div className="job-keywords">
                  <span>Top gaps:</span> {match.missing.slice(0, 3).map((item) => item.term).join(' · ')}
                </div>
              )}
              <div className="job-actions">
                <button type="button" onClick={() => saveJob(job)}>Save & Track</button>
                <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">View & Apply ↗</a>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
