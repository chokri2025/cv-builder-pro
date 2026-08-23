/**
 * Approximate CEFR equivalents for the level labels the form offers.
 *
 * Europass states language ability on the CEFR scale, which is what European
 * employers and public-sector recruiters read. The builder collects plain labels,
 * so they are shown alongside the scale rather than replaced by it — the mapping
 * is indicative, and hiding the original wording would overstate its precision.
 */
export const CEFR_BY_LEVEL: Record<string, string> = {
  Native: 'C2',
  Fluent: 'C1',
  Advanced: 'B2',
  Intermediate: 'B1',
  Conversational: 'A2',
  Beginner: 'A1',
};
