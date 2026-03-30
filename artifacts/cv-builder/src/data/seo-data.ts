export interface SeoSkill {
  slug: string;
  label: string;
  title: string;
}

export interface SeoCity {
  slug: string;
  label: string;
  country: string;
}

export const SEO_SKILLS: SeoSkill[] = [
  { slug: 'software-engineer', label: 'Software Engineer', title: 'Software Engineer' },
  { slug: 'web-developer', label: 'Web Developer', title: 'Web Developer' },
  { slug: 'data-analyst', label: 'Data Analyst', title: 'Data Analyst' },
  { slug: 'project-manager', label: 'Project Manager', title: 'Project Manager' },
  { slug: 'graphic-designer', label: 'Graphic Designer', title: 'Graphic Designer' },
  { slug: 'marketing-manager', label: 'Marketing Manager', title: 'Marketing Manager' },
  { slug: 'accountant', label: 'Accountant', title: 'Accountant' },
  { slug: 'nurse', label: 'Nurse', title: 'Nurse' },
  { slug: 'teacher', label: 'Teacher', title: 'Teacher' },
  { slug: 'sales-manager', label: 'Sales Manager', title: 'Sales Manager' },
  { slug: 'ux-designer', label: 'UX Designer', title: 'UX Designer' },
  { slug: 'product-manager', label: 'Product Manager', title: 'Product Manager' },
  { slug: 'devops-engineer', label: 'DevOps Engineer', title: 'DevOps Engineer' },
  { slug: 'business-analyst', label: 'Business Analyst', title: 'Business Analyst' },
  { slug: 'hr-manager', label: 'HR Manager', title: 'HR Manager' },
  { slug: 'financial-analyst', label: 'Financial Analyst', title: 'Financial Analyst' },
  { slug: 'content-writer', label: 'Content Writer', title: 'Content Writer' },
  { slug: 'customer-service', label: 'Customer Service', title: 'Customer Service Representative' },
  { slug: 'electrician', label: 'Electrician', title: 'Electrician' },
  { slug: 'civil-engineer', label: 'Civil Engineer', title: 'Civil Engineer' },
];

export const SEO_CITIES: SeoCity[] = [
  { slug: 'new-york', label: 'New York', country: 'USA' },
  { slug: 'london', label: 'London', country: 'UK' },
  { slug: 'paris', label: 'Paris', country: 'France' },
  { slug: 'toronto', label: 'Toronto', country: 'Canada' },
  { slug: 'sydney', label: 'Sydney', country: 'Australia' },
  { slug: 'berlin', label: 'Berlin', country: 'Germany' },
  { slug: 'dubai', label: 'Dubai', country: 'UAE' },
  { slug: 'singapore', label: 'Singapore', country: 'Singapore' },
  { slug: 'chicago', label: 'Chicago', country: 'USA' },
  { slug: 'san-francisco', label: 'San Francisco', country: 'USA' },
  { slug: 'los-angeles', label: 'Los Angeles', country: 'USA' },
  { slug: 'amsterdam', label: 'Amsterdam', country: 'Netherlands' },
  { slug: 'madrid', label: 'Madrid', country: 'Spain' },
  { slug: 'melbourne', label: 'Melbourne', country: 'Australia' },
  { slug: 'montreal', label: 'Montreal', country: 'Canada' },
];

export interface SeoPageData {
  slug: string;
  skill: SeoSkill | null;
  city: SeoCity | null;
  pageTitle: string;
  metaDescription: string;
  h1: string;
  h2: string;
  intro: string;
  tips: string[];
  faqs: Array<{ q: string; a: string }>;
  prefilledJobTitle: string;
}

export function buildSeoPageData(
  skill: SeoSkill | null,
  city: SeoCity | null
): SeoPageData {
  const skillLabel = skill?.label ?? 'Professional';
  const cityLabel = city ? `${city.label}, ${city.country}` : null;
  const cityShort = city?.label ?? null;
  const jobTitle = skill?.title ?? 'Professional';

  const pageTitle = city
    ? skill
      ? `Free CV Builder for ${skillLabel}s in ${city.label} | CV Builder Pro`
      : `Free CV Builder in ${city.label} | CV Builder Pro`
    : `Free ${skillLabel} CV Builder & Resume Template | CV Builder Pro`;

  const metaDescription = city
    ? skill
      ? `Create a professional ${skillLabel} CV tailored for jobs in ${cityLabel}. Download as PDF in minutes. Free, no sign-up required.`
      : `Build a professional CV for job seekers in ${cityLabel}. 3 templates, PDF export, free online CV maker.`
    : `Build a standout ${skillLabel} resume or CV with our free online builder. Choose from 3 templates and download as PDF instantly.`;

  const h1 = city
    ? skill
      ? `Free CV Builder for ${skillLabel}s in ${city.label}`
      : `Free CV Builder for Job Seekers in ${city.label}`
    : `Free ${skillLabel} CV Builder`;

  const h2 = city
    ? skill
      ? `Land your next ${skillLabel} role in ${city.label} with a professional CV`
      : `Stand out in ${city.label}'s job market with a professional CV`
    : `Create a professional ${skillLabel} resume in minutes`;

  const intro = city
    ? skill
      ? `The job market for ${skillLabel}s in ${cityLabel} is competitive. A polished, well-structured CV is your first step to standing out. Our free CV builder lets you create a professional ${skillLabel} resume in minutes — with templates designed to impress ${city.label} hiring managers.`
      : `Looking for work in ${cityLabel}? A strong CV is the difference between getting an interview and being ignored. Our free online CV builder gives you professional templates and PDF export — completely free, no account needed.`
    : `Building a great ${skillLabel} CV doesn't have to be hard. Our free online tool walks you through every section — experience, skills, education and more — and produces a polished, ATS-friendly PDF in minutes.`;

  const tips = skill
    ? [
        `Tailor your CV summary to highlight your ${skillLabel} expertise`,
        `List measurable achievements, not just duties`,
        `Include relevant technical skills and tools for ${skillLabel} roles`,
        `Keep your CV to 1–2 pages and use a clean, readable layout`,
        `Add a LinkedIn URL and portfolio link if you have one`,
      ]
    : [
        `Match your CV keywords to the job description`,
        `Lead with a strong professional summary`,
        `Quantify your achievements with numbers and results`,
        `Keep formatting consistent and avoid dense blocks of text`,
        `Proofread carefully — typos cost interviews`,
      ];

  const faqs: Array<{ q: string; a: string }> = [
    {
      q: city && skill
        ? `What should a ${skillLabel} CV include for jobs in ${city.label}?`
        : skill
        ? `What should a ${skillLabel} CV include?`
        : `What sections should a CV include?`,
      a: `A strong CV should include a professional summary, work experience with measurable results, education, skills, and contact details. ${city ? `For ${city.label} employers, keep it concise — typically 1–2 pages.` : 'Keep it to 1–2 pages.'}`,
    },
    {
      q: `Is this CV builder really free?`,
      a: `Yes — completely free. No sign-up, no hidden fees. Fill in your details and download your CV as a PDF instantly.`,
    },
    {
      q: `Can I download my CV as a PDF?`,
      a: `Absolutely. Click "Download PDF" and your CV is saved to your device, ready to send to employers.`,
    },
    {
      q: city
        ? `Are these CV templates accepted by ${cityShort} employers?`
        : `Are these CV templates ATS-friendly?`,
      a: `Our templates are designed to be clean and readable — compatible with applicant tracking systems (ATS) used by recruiters worldwide.`,
    },
  ];

  return {
    slug: buildSlug(skill, city),
    skill,
    city,
    pageTitle,
    metaDescription,
    h1,
    h2,
    intro,
    tips,
    faqs,
    prefilledJobTitle: jobTitle,
  };
}

export function buildSlug(skill: SeoSkill | null, city: SeoCity | null): string {
  if (skill && city) return `${skill.slug}-${city.slug}`;
  if (skill) return skill.slug;
  if (city) return city.slug;
  return '';
}

export function parseSlug(slug: string): { skill: SeoSkill | null; city: SeoCity | null } {
  for (const skill of SEO_SKILLS) {
    for (const city of SEO_CITIES) {
      if (slug === `${skill.slug}-${city.slug}`) return { skill, city };
    }
  }
  const skill = SEO_SKILLS.find(s => s.slug === slug) ?? null;
  if (skill) return { skill, city: null };
  const city = SEO_CITIES.find(c => c.slug === slug) ?? null;
  if (city) return { skill: null, city };
  return { skill: null, city: null };
}

export function getAllSlugs(): string[] {
  const slugs: string[] = [];
  for (const skill of SEO_SKILLS) {
    slugs.push(skill.slug);
    for (const city of SEO_CITIES) {
      slugs.push(`${skill.slug}-${city.slug}`);
    }
  }
  for (const city of SEO_CITIES) {
    slugs.push(city.slug);
  }
  return slugs;
}
