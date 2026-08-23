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
  /** Heading for the "what local employers expect" block. */
  localTitle: string;
  /** Credential, CV-convention, sector and job-board lines for this city/role. */
  localLines: string[];
  prefilledJobTitle: string;
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
  const skill = SEO_SKILLS.find((s) => s.slug === slug) ?? null;
  if (skill) return { skill, city: null };
  const city = SEO_CITIES.find((c) => c.slug === slug) ?? null;
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
