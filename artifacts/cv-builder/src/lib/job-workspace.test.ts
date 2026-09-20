import { describe, expect, it } from 'vitest';
import {
  MAX_SAVED_JOBS,
  createSavedJob,
  deleteSavedJob,
  parseSavedJobs,
  prependSavedJob,
  summarizeJobStatuses,
  updateSavedJobStatus,
} from './job-workspace';

describe('job workspace', () => {
  const AD =
    'We are hiring an electrician with experience in maintenance, safety procedures, diagnostics and customer service.';

  it('ignores malformed local storage content', () => {
    expect(parseSavedJobs('{bad json')).toEqual([]);
    expect(parseSavedJobs(JSON.stringify([{ id: 'x' }]))).toEqual([]);
  });

  it('creates a normalized saved job', () => {
    const job = createSavedJob(' Electrician ', ' ACME ', AD, new Date('2026-09-20T00:00:00Z'));
    expect(job.title).toBe('Electrician');
    expect(job.company).toBe('ACME');
    expect(job.status).toBe('saved');
  });

  it('requires a title and a useful job description', () => {
    expect(() => createSavedJob('', 'ACME', AD)).toThrow('JOB_TITLE_REQUIRED');
    expect(() => createSavedJob('Electrician', 'ACME', 'too short')).toThrow('JOB_AD_TOO_SHORT');
  });

  it('keeps only the newest allowed jobs', () => {
    const jobs = Array.from({ length: MAX_SAVED_JOBS }, (_, index) =>
      createSavedJob(`Job ${index}`, '', AD, new Date(2026, 0, index + 1)),
    );
    const newest = createSavedJob('Newest', '', AD);
    const result = prependSavedJob(jobs, newest);

    expect(result).toHaveLength(MAX_SAVED_JOBS);
    expect(result[0]?.title).toBe('Newest');
  });

  it('summarizes the application pipeline by status', () => {
    const saved = createSavedJob('Saved', '', AD, new Date('2026-09-20T00:00:00Z'));
    const applied = { ...createSavedJob('Applied', '', AD), status: 'applied' as const };
    const interview = { ...createSavedJob('Interview', '', AD), status: 'interview' as const };

    expect(summarizeJobStatuses([saved, applied, interview])).toEqual({
      saved: 1,
      applied: 1,
      interview: 1,
      offer: 0,
      rejected: 0,
    });
  });

  it('updates status and deletes jobs without mutating unrelated entries', () => {
    const first = createSavedJob('First', '', AD, new Date('2026-09-20T00:00:00Z'));
    const second = createSavedJob('Second', '', AD, new Date('2026-09-20T00:01:00Z'));

    const updated = updateSavedJobStatus(
      [first, second],
      first.id,
      'interview',
      new Date('2026-09-20T01:00:00Z'),
    );

    expect(updated[0]?.status).toBe('interview');
    expect(updated[1]).toEqual(second);
    expect(deleteSavedJob(updated, first.id)).toEqual([second]);
  });
});
