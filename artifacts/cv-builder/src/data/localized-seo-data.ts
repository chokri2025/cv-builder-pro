import { SeoSkill, SeoCity, SeoPageData, buildSlug } from './seo-data';
import { buildDifferentiatedCopy } from './market-copy';

type LangCode = 'en' | 'fr' | 'es' | 'ar' | 'tr' | 'pt';

export const LOCALIZED_SEO_SLUGS: Record<LangCode, { prefix: string }> = {
  en: { prefix: 'cv-builder' },
  fr: { prefix: 'cv-createur' },
  es: { prefix: 'cv-creador' },
  ar: { prefix: 'cv-builder' },
  tr: { prefix: 'cv-olusturucu' },
  pt: { prefix: 'cv-criador' },
};

/** Fields each per-language builder supplies; the rest comes from the market copy. */
type PageBase = Omit<SeoPageData, 'intro' | 'tips' | 'faqs' | 'localTitle' | 'localLines'>;

/** Google truncates search snippets past roughly this width. */
export const MAX_META_DESCRIPTION = 155;

/** Titles wider than this are truncated in search results. */
export const MAX_TITLE = 60;

const BRAND_SUFFIX = ' | CV Builder Pro';

/**
 * Appends the brand to a page title, but only when the result still fits.
 *
 * Appending it unconditionally pushed 84% of titles past the width Google renders
 * — worst in Turkish, where "San Francisco'de Marketing Managerlar için Ücretsiz
 * CV Oluşturucu" already fills the line before the brand is added. The page's own
 * keywords are worth more of that width than a brand a search result already shows
 * as the domain.
 */
export function clampTitle(core: string, max: number = MAX_TITLE): string {
  const withBrand = `${core}${BRAND_SUFFIX}`;
  return withBrand.length <= max ? withBrand : core;
}

/**
 * Keeps a meta description inside the width Google renders. Whole trailing
 * sentences are dropped first so the snippet still ends cleanly; only if that is
 * not enough do we cut at a word boundary.
 */
export function clampMetaDescription(text: string, max: number = MAX_META_DESCRIPTION): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;

  const sentences = trimmed.match(/[^.!?۔؟]+[.!?۔؟]*\s*/g) ?? [trimmed];
  let kept = '';
  for (const sentence of sentences) {
    if ((kept + sentence).trim().length > max) break;
    kept += sentence;
  }
  kept = kept.trim();
  if (kept.length > 0) return kept;

  const cut = trimmed.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  const base = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[\s,;:.،؛]+$/, '')}…`;
}

/**
 * Attaches the differentiated body copy (rotating intro, category tips, local
 * requirements and page-specific FAQs) to a page's title/heading block, so no two
 * of the ~1,000 landing pages share the same body text.
 */
function withMarketCopy(base: PageBase, lang: LangCode): SeoPageData {
  const copy = buildDifferentiatedCopy(lang, base.slug, base.skill, base.city);

  return {
    ...base,
    pageTitle: clampTitle(base.pageTitle),
    metaDescription: clampMetaDescription(base.metaDescription),
    intro: copy.intro,
    tips: copy.tips,
    faqs: copy.faqs,
    localTitle: copy.localTitle,
    localLines: copy.localLines,
  };
}

export function buildLocalizedSeoPageData(
  skill: SeoSkill | null,
  city: SeoCity | null,
  lang: LangCode,
): SeoPageData {
  if (lang === 'fr') return buildFrSeoPageData(skill, city);
  if (lang === 'es') return buildEsSeoPageData(skill, city);
  if (lang === 'ar') return buildArSeoPageData(skill, city);
  if (lang === 'tr') return buildTrSeoPageData(skill, city);
  if (lang === 'pt') return buildPtSeoPageData(skill, city);
  return buildEnSeoPageData(skill, city);
}

function buildEnSeoPageData(skill: SeoSkill | null, city: SeoCity | null): SeoPageData {
  const skillLabel = skill?.label ?? 'Professional';
  const cityLabel = city ? `${city.label}, ${city.country}` : null;
  const jobTitle = skill?.title ?? 'Professional';

  const pageTitle = city
    ? skill
      ? `Free CV Builder for ${skillLabel}s in ${city.label}`
      : `Free CV Builder in ${city.label}`
    : `Free ${skillLabel} CV Builder & Resume Template`;

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

  return withMarketCopy(
    {
      slug: buildSlug(skill, city),
      skill,
      city,
      pageTitle,
      metaDescription,
      h1,
      h2,
      prefilledJobTitle: jobTitle,
    },
    'en',
  );
}

function buildFrSeoPageData(skill: SeoSkill | null, city: SeoCity | null): SeoPageData {
  const skillLabel = skill?.label ?? 'Professionnel';
  const cityLabel = city ? `${city.label}, ${city.country}` : null;
  const jobTitle = skill?.title ?? 'Professionnel';

  const pageTitle = city
    ? skill
      ? `Créateur de CV gratuit pour ${skillLabel}s à ${city.label}`
      : `Créateur de CV gratuit à ${city.label}`
    : `Créateur de CV ${skillLabel} gratuit`;

  const metaDescription = city
    ? skill
      ? `Créez un CV professionnel de ${skillLabel} adapté aux emplois à ${cityLabel}. Téléchargez en PDF en quelques minutes. Gratuit, sans inscription.`
      : `Créez un CV professionnel pour les chercheurs d'emploi à ${cityLabel}. 3 modèles, export PDF, créateur de CV gratuit en ligne.`
    : `Créez un CV de ${skillLabel} remarquable avec notre outil gratuit en ligne. Choisissez parmi 3 modèles et téléchargez en PDF instantanément.`;

  const h1 = city
    ? skill
      ? `Créateur de CV gratuit pour ${skillLabel}s à ${city.label}`
      : `Créateur de CV gratuit pour les chercheurs d'emploi à ${city.label}`
    : `Créateur de CV ${skillLabel} gratuit`;

  const h2 = city
    ? skill
      ? `Décrochez votre prochain poste de ${skillLabel} à ${city.label} avec un CV professionnel`
      : `Démarquez-vous sur le marché de l'emploi à ${city.label} avec un CV professionnel`
    : `Créez un CV de ${skillLabel} professionnel en quelques minutes`;

  return withMarketCopy(
    {
      slug: buildSlug(skill, city),
      skill,
      city,
      pageTitle,
      metaDescription,
      h1,
      h2,
      prefilledJobTitle: jobTitle,
    },
    'fr',
  );
}

function buildEsSeoPageData(skill: SeoSkill | null, city: SeoCity | null): SeoPageData {
  const skillLabel = skill?.label ?? 'Profesional';
  const cityLabel = city ? `${city.label}, ${city.country}` : null;
  const jobTitle = skill?.title ?? 'Profesional';

  const pageTitle = city
    ? skill
      ? `Creador de CV gratis para ${skillLabel}s en ${city.label}`
      : `Creador de CV gratis en ${city.label}`
    : `Creador de CV de ${skillLabel} gratis`;

  const metaDescription = city
    ? skill
      ? `Crea un CV profesional de ${skillLabel} adaptado a empleos en ${cityLabel}. Descarga en PDF en minutos. Gratis, sin registro.`
      : `Crea un CV profesional para buscadores de empleo en ${cityLabel}. 3 plantillas, exportación PDF, creador de CV gratis online.`
    : `Crea un CV de ${skillLabel} destacado con nuestra herramienta gratuita online. Elige entre 3 plantillas y descarga en PDF al instante.`;

  const h1 = city
    ? skill
      ? `Creador de CV gratis para ${skillLabel}s en ${city.label}`
      : `Creador de CV gratis para buscadores de empleo en ${city.label}`
    : `Creador de CV de ${skillLabel} gratis`;

  const h2 = city
    ? skill
      ? `Consigue tu próximo puesto de ${skillLabel} en ${city.label} con un CV profesional`
      : `Destaca en el mercado laboral de ${city.label} con un CV profesional`
    : `Crea un CV profesional de ${skillLabel} en minutos`;

  return withMarketCopy(
    {
      slug: buildSlug(skill, city),
      skill,
      city,
      pageTitle,
      metaDescription,
      h1,
      h2,
      prefilledJobTitle: jobTitle,
    },
    'es',
  );
}

function buildArSeoPageData(skill: SeoSkill | null, city: SeoCity | null): SeoPageData {
  const skillLabel = skill?.label ?? 'محترف';
  const cityLabel = city ? `${city.label}` : null;
  const jobTitle = skill?.title ?? 'محترف';

  const pageTitle = city
    ? skill
      ? `منشئ سيرة ذاتية مجاني لـ ${skillLabel} في ${city.label}`
      : `منشئ سيرة ذاتية مجاني في ${city.label}`
    : `منشئ سيرة ذاتية ${skillLabel} مجاني`;

  const metaDescription = city
    ? skill
      ? `أنشئ سيرة ذاتية احترافية لـ ${skillLabel} مناسبة للوظائف في ${cityLabel}. حمّل بصيغة PDF في دقائق. مجاني، دون تسجيل.`
      : `أنشئ سيرة ذاتية احترافية للباحثين عن عمل في ${cityLabel}. 3 قوالب، تصدير PDF، منشئ سيرة ذاتية مجاني عبر الإنترنت.`
    : `أنشئ سيرة ذاتية متميزة لـ ${skillLabel} باستخدام أداتنا المجانية عبر الإنترنت. اختر من 3 قوالب وحمّل بصيغة PDF فوراً.`;

  const h1 = city
    ? skill
      ? `منشئ سيرة ذاتية مجاني لـ ${skillLabel} في ${city.label}`
      : `منشئ سيرة ذاتية مجاني للباحثين عن عمل في ${city.label}`
    : `منشئ سيرة ذاتية ${skillLabel} مجاني`;

  const h2 = city
    ? skill
      ? `احصل على وظيفتك القادمة كـ ${skillLabel} في ${city.label} بسيرة ذاتية احترافية`
      : `تميز في سوق العمل في ${city.label} بسيرة ذاتية احترافية`
    : `أنشئ سيرة ذاتية ${skillLabel} احترافية في دقائق`;

  return withMarketCopy(
    {
      slug: buildSlug(skill, city),
      skill,
      city,
      pageTitle,
      metaDescription,
      h1,
      h2,
      prefilledJobTitle: jobTitle,
    },
    'ar',
  );
}

function buildTrSeoPageData(skill: SeoSkill | null, city: SeoCity | null): SeoPageData {
  const skillLabel = skill?.label ?? 'Profesyonel';
  const cityLabel = city ? `${city.label}` : null;
  const jobTitle = skill?.title ?? 'Profesyonel';

  const pageTitle = city
    ? skill
      ? `${city.label}'de ${skillLabel}lar için Ücretsiz CV Oluşturucu`
      : `${city.label}'de Ücretsiz CV Oluşturucu`
    : `Ücretsiz ${skillLabel} CV Oluşturucu`;

  const metaDescription = city
    ? skill
      ? `${cityLabel}'deki işler için özelleştirilmiş profesyonel ${skillLabel} CV'si oluşturun. PDF olarak dakikalar içinde indirin. Ücretsiz, kayıt gerekmez.`
      : `${cityLabel}'deki iş arayanlar için profesyonel CV oluşturun. 3 şablon, PDF dışa aktarma, ücretsiz çevrimiçi CV oluşturucu.`
    : `Ücretsiz çevrimiçi aracımızla öne çıkan bir ${skillLabel} CV'si oluşturun. 3 şablondan birini seçin ve PDF'yi anında indirin.`;

  const h1 = city
    ? skill
      ? `${city.label}'de ${skillLabel}lar için Ücretsiz CV Oluşturucu`
      : `${city.label}'de İş Arayanlar için Ücretsiz CV Oluşturucu`
    : `Ücretsiz ${skillLabel} CV Oluşturucu`;

  const h2 = city
    ? skill
      ? `Profesyonel bir CV ile ${city.label}'de ${skillLabel} kariyerinize adım atın`
      : `Profesyonel bir CV ile ${city.label} iş piyasasında öne çıkın`
    : `Dakikalar içinde profesyonel bir ${skillLabel} CV'si oluşturun`;

  return withMarketCopy(
    {
      slug: buildSlug(skill, city),
      skill,
      city,
      pageTitle,
      metaDescription,
      h1,
      h2,
      prefilledJobTitle: jobTitle,
    },
    'tr',
  );
}

function buildPtSeoPageData(skill: SeoSkill | null, city: SeoCity | null): SeoPageData {
  const skillLabel = skill?.label ?? 'Profissional';
  const cityLabel = city ? `${city.label}` : null;
  const jobTitle = skill?.title ?? 'Profissional';

  const pageTitle = city
    ? skill
      ? `Criador de CV grátis para ${skillLabel}s em ${city.label}`
      : `Criador de CV grátis em ${city.label}`
    : `Criador de CV de ${skillLabel} grátis`;

  const metaDescription = city
    ? skill
      ? `Crie um CV profissional de ${skillLabel} adaptado para empregos em ${cityLabel}. Descarregue em PDF em minutos. Grátis, sem registo.`
      : `Crie um CV profissional para candidatos em ${cityLabel}. 3 modelos, exportação PDF, criador de CV gratuito online.`
    : `Crie um CV de ${skillLabel} de destaque com a nossa ferramenta gratuita online. Escolha entre 3 modelos e descarregue em PDF instantaneamente.`;

  const h1 = city
    ? skill
      ? `Criador de CV grátis para ${skillLabel}s em ${city.label}`
      : `Criador de CV grátis para candidatos em ${city.label}`
    : `Criador de CV de ${skillLabel} grátis`;

  const h2 = city
    ? skill
      ? `Conquiste o seu próximo cargo de ${skillLabel} em ${city.label} com um CV profissional`
      : `Destaque-se no mercado de trabalho de ${city.label} com um CV profissional`
    : `Crie um CV profissional de ${skillLabel} em minutos`;

  return withMarketCopy(
    {
      slug: buildSlug(skill, city),
      skill,
      city,
      pageTitle,
      metaDescription,
      h1,
      h2,
      prefilledJobTitle: jobTitle,
    },
    'pt',
  );
}
