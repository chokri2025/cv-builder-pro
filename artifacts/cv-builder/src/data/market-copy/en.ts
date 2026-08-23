import type { MarketPhrasebook } from './types';

function list(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

export const en: MarketPhrasebook = {
  sector: {
    finance: 'finance',
    technology: 'technology',
    healthcare: 'healthcare',
    education: 'education',
    media: 'media',
    tourism: 'hospitality and tourism',
    logistics: 'logistics',
    energy: 'energy',
    publicSector: 'the public sector',
    manufacturing: 'manufacturing',
    research: 'research',
    retail: 'retail',
    construction: 'construction',
    startups: 'startups',
    legal: 'legal services',
  },

  norm: {
    noPhoto: 'no photo, date of birth or marital status',
    photoCommon: 'a professional headshot is still normal and often expected',
    onePage: 'keep it to one page unless you are very senior',
    twoPages: 'two pages is the accepted length',
    attestedCertificates: 'certificates should be attested and ready to produce',
    workAuthorization: 'state your visa or work-authorisation status explicitly',
    referencesOnRequest: 'references can be listed as available on request',
    localContactDetails: 'use a local phone number and city rather than a full street address',
    languageLevels: 'give language levels (A1–C2) instead of vague labels',
    reverseChronological: 'roles in reverse-chronological order, with no unexplained gaps',
  },

  credentialKind: {
    registration: 'registration',
    licence: 'licence',
    certification: 'certification',
    qualification: 'qualification',
    attestation: 'attestation',
  },

  credentialProof: (name, kind, city) => {
    const detail =
      kind === 'registration' || kind === 'licence'
        ? 'the issuing body, your number and the expiry date'
        : kind === 'certification'
          ? 'the issuing body and the date you gained it'
          : kind === 'attestation'
            ? 'what has been attested, and when'
            : 'the awarding body and the year you completed it';
    return `${city ? `Employers in ${city} look for ` : 'Employers look for '}${name} before anything else, so put ${detail} on the CV itself rather than in an attachment.`;
  },

  categoryProof: {
    healthcare:
      'Registration bodies differ by country, so name yours, your registration number and its expiry date near the top of the CV.',
    technology:
      'There is no licence to show in tech, so recruiters read your stack, your shipped work and the numbers behind it.',
    education:
      'Teaching qualifications are checked early, so state the qualification, the curricula you have taught and your clearance status up front.',
    finance:
      'Qualifications and reporting standards are the first filter, so name both — including exams still in progress.',
    creative:
      'Creative shortlists are decided by the portfolio, so the CV’s job is to get it opened.',
    business:
      'Nothing here is licensed, so evidence of scope — budget, headcount and results — has to do that work instead.',
    engineering:
      'Chartered status decides which work you can sign off, so list your registration, discipline and the standards you design to.',
    trades:
      'Your card or licence is the first thing a contractor checks, so lead with its class, number and expiry.',
  },

  genericProof:
    'Recruiters skim for evidence: what you ran, at what scale and what changed because of it.',

  introSkillCity: [
    (c) =>
      `Employers across ${list(c.sectors.slice(0, 2))} in ${c.city} recruit for ${c.skill} roles year-round, and most vacancies are advertised on ${c.boards}. ${c.proof} Our free CV builder turns those details into a clean, ATS-friendly ${c.skill} CV you can download as a PDF in minutes.`,
    (c) =>
      `${c.skill} vacancies in ${c.city} cluster around ${c.anchors}. ${c.proof} Put that evidence at the top of your ${c.skill} CV — ${c.norms[0]} — and export it as a polished PDF, free and without an account.`,
    (c) =>
      `A CV that works for ${c.skill} roles in ${c.city} is not the document you would send elsewhere: ${c.norms[0]}, and ${c.norms[1]}. ${c.proof} Our free builder handles the layout so you can concentrate on the content.`,
  ],

  introSkill: [
    (c) =>
      `Strong ${c.skill} CVs are built on evidence, not adjectives. ${c.proof} Our free CV builder walks you through each section — summary, experience, skills, education — and exports an ATS-friendly PDF in minutes.`,
    (c) =>
      `Most ${c.skill} applications are rejected on the first skim, before anyone reads the detail. ${c.proof} Use our free builder to put the decisive information in the first third of page one, then download your CV as a PDF.`,
    (c) =>
      `Recruiters compare ${c.skill} CVs against a shortlist of things they must find. ${c.proof} Our free online builder gives you a structure that surfaces them, with three professional templates and instant PDF export.`,
  ],

  introCity: [
    (c) =>
      `Hiring in ${c.city} is driven by ${list(c.sectors)}, with openings concentrated around ${c.anchors}. ${c.proof} Our free CV builder gives you a professional, ATS-friendly CV — ${c.norms[0]} — ready to download as a PDF.`,
    (c) =>
      `Job seekers in ${c.city} compete against candidates who already follow the local conventions: ${c.norms[0]}, and ${c.norms[1]}. ${c.proof} Build a CV that matches them in a few minutes, free and with no sign-up.`,
    (c) =>
      `Most ${c.city} vacancies are advertised on ${c.boards}, and recruiters there screen dozens of CVs per role. ${c.proof} Our free online CV builder helps you produce a focused, well-structured PDF that survives that first pass.`,
  ],

  categoryTips: {
    healthcare: [
      'Put your registration body, number and expiry date at the top — it is checked before anything else is read.',
      'List clinical settings and rotations (ICU, theatre, community) with bed numbers or patient loads so your seniority is obvious.',
      'Keep mandatory training (BLS/ALS, manual handling, safeguarding) in its own block so compliance staff can tick it off.',
      'State your shift availability and earliest start date — rostering is what stalls most clinical applications.',
    ],
    technology: [
      'Open with a stack line — languages, frameworks, cloud and tooling — so keyword screens match you on the first pass.',
      'Describe systems by scale: requests per second, data volume, users served, or the latency and cost you cut.',
      'Link a repository or a live project; hiring managers open it more often than they finish the summary.',
      'Show ownership — what you designed, what broke, and what you changed — rather than the team’s roadmap.',
    ],
    education: [
      'Name the age ranges, subjects and curricula you have taught (national curriculum, IB, AP) in the first section.',
      'Quantify outcomes: attainment gains, cohort sizes, pass rates — not a list of daily duties.',
      'List safeguarding and child-protection training with clearance status; schools screen for it early.',
      'Include clubs, tutoring and pastoral responsibilities — they carry real weight in teaching shortlists.',
    ],
    finance: [
      'Name the standards and systems you work in — IFRS, GAAP, SAP, Oracle, NetSuite — because filters are built on them.',
      'Size your work: budgets owned, portfolio value, month-end close times, audit scope.',
      'Show progress on your professional qualification, including exam stage and expected completion date.',
      'Separate technical accounting from analysis and stakeholder work so a reviewer can skim both.',
    ],
    creative: [
      'Put the portfolio link in the header — a creative CV without one rarely gets a second look.',
      'Describe results rather than deliverables: reach, conversion, retention or revenue moved by the work.',
      'Group the tools and platforms you genuinely own (Figma, Adobe CC, CMS, analytics) into one scannable block.',
      'Choose three to five pieces that match the role and say exactly what your part in each was.',
    ],
    business: [
      'Frame every role as a mandate: what you owned, the budget or headcount, and the outcome.',
      'Use metrics a hiring manager can benchmark — cycle time, pipeline, retention, cost saved.',
      'List the methods and tools you actually run (Agile, PRINCE2, Salesforce, Jira, SQL) instead of every buzzword.',
      'Show stakeholder scope: the teams, regions, executives and partners you worked across.',
    ],
    engineering: [
      'Put your registration status and discipline at the top — it decides which work you can sign off.',
      'List projects with value, scale and your actual role: design, site supervision, approvals.',
      'Name the codes, standards and software you work to (Eurocodes, AS/NZS, AutoCAD, Revit, ETABS).',
      'Include site safety and quality certifications; contractors screen for them before interview.',
    ],
    trades: [
      'Lead with your licence or card: class, number and expiry date.',
      'List the installation types you have worked on — domestic, commercial, industrial, solar, HV — with voltages.',
      'Add testing and safety certifications, plus driving licence and own-tools status.',
      'Include site-manager references; in the trades they outweigh any summary paragraph.',
    ],
  },

  genericTips: [
    'Mirror the advert’s wording for the job title and core skills — screening tools match on exact phrases.',
    'Open with a four-line summary naming your field, your years of experience and the outcome you deliver.',
    'Quantify what you can: numbers survive skim-reading, adjectives do not.',
    'Keep a separate CV per role type; a general CV loses to a targeted one almost every time.',
  ],

  localTip: (c) =>
    c.city
      ? `Follow ${c.city} conventions: ${c.norms[0]}, and ${c.norms[1]}.`
      : 'Match the CV conventions of the country you are applying in — length, photo and personal details differ widely.',

  localTitle: (c) =>
    c.skill && c.city
      ? `What ${c.city} employers expect in ${c.skill} CVs`
      : c.city
        ? `What ${c.city} employers expect in a CV`
        : `What employers expect in ${c.skill} CVs`,

  localLines: (c) => {
    const lines: string[] = [c.proof];
    if (c.norms.length > 0) {
      lines.push(`Local CV convention: ${list(c.norms)}.`);
    }
    if (c.sectors.length > 0 && c.anchors) {
      lines.push(
        `Demand is concentrated in ${list(c.sectors)} — around ${c.anchors} — so mirror that vocabulary in your summary and skills.`,
      );
    }
    if (c.boards) {
      lines.push(
        `Roles are advertised mainly on ${c.boards}; keep a tailored PDF ready before you apply.`,
      );
    }
    return lines;
  },

  faqs: (c) => {
    const entries = [];

    entries.push({
      q:
        c.skill && c.city
          ? `What should ${c.skill} CVs include for jobs in ${c.city}?`
          : c.skill
            ? `What should ${c.skill} CVs include?`
            : `What should a CV include for jobs in ${c.city}?`,
      a: `${c.credential ? `Start with ${c.credential}, then` : 'Start with a four-line summary, then'} experience written as measurable results, education, and a skills block that matches the advert.${
        c.norms.length > 0 ? ` Local convention: ${list(c.norms)}.` : ''
      }`,
    });

    if (c.credential) {
      entries.push({
        q: `Do I need ${c.credential} to apply${c.city ? ` in ${c.city}` : ''}?`,
        a: `It is what local employers ask for in most ${c.skill ?? 'professional'} roles, and it is usually verified before an offer is confirmed. If yours is not finished yet, say so on the CV: name it and add "in progress" with the date you expect to complete — that reads far better than leaving it out.`,
      });
    } else {
      entries.push({
        q: `How long should ${c.skill ?? 'professional'} CVs be${c.city ? ` in ${c.city}` : ''}?`,
        a: `${c.lengthNorm ? `${c.lengthNorm.charAt(0).toUpperCase()}${c.lengthNorm.slice(1)}.` : 'One to two pages.'} Anything longer is skimmed rather than read, so cut older roles down to a single line each.`,
      });
    }

    if (c.city && c.boards) {
      entries.push({
        q: `Where are ${c.skill ? `${c.skill} ` : ''}jobs advertised in ${c.city}?`,
        a: `Mostly on ${c.boards}${c.anchors ? `, with the largest employers around ${c.anchors}` : ''}. Applications there are screened automatically first, so keep the job title and core skills worded as they appear in the advert.`,
      });
    } else {
      entries.push({
        q: `Will this CV pass an ATS screen?`,
        a: `Our templates use a single-column, text-based layout with standard section headings, which is what applicant tracking systems parse most reliably. Keep your job titles and skills in the same words the advert uses.`,
      });
    }

    entries.push({
      q: `Is CV Builder Pro free?`,
      a: `Yes — completely free, with no sign-up and no hidden fees. Fill in your details, pick a template and download your CV as a PDF straight away.`,
    });

    return entries;
  },
};
