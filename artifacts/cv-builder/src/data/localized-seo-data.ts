import { SeoSkill, SeoCity, SeoPageData, buildSlug } from './seo-data';

type LangCode = 'en' | 'fr' | 'es' | 'ar' | 'tr' | 'pt';

export const LOCALIZED_SEO_SLUGS: Record<LangCode, { prefix: string }> = {
  en: { prefix: 'cv-builder' },
  fr: { prefix: 'cv-createur' },
  es: { prefix: 'cv-creador' },
  ar: { prefix: 'cv-builder' },
  tr: { prefix: 'cv-olusturucu' },
  pt: { prefix: 'cv-criador' },
};

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
      q:
        city && skill
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

function buildFrSeoPageData(skill: SeoSkill | null, city: SeoCity | null): SeoPageData {
  const skillLabel = skill?.label ?? 'Professionnel';
  const cityLabel = city ? `${city.label}, ${city.country}` : null;
  const cityShort = city?.label ?? null;
  const jobTitle = skill?.title ?? 'Professionnel';

  const pageTitle = city
    ? skill
      ? `Créateur de CV gratuit pour ${skillLabel}s à ${city.label} | CV Builder Pro`
      : `Créateur de CV gratuit à ${city.label} | CV Builder Pro`
    : `Créateur de CV ${skillLabel} gratuit | CV Builder Pro`;

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

  const intro = city
    ? skill
      ? `Le marché de l'emploi pour les ${skillLabel}s à ${cityLabel} est très concurrentiel. Un CV soigné et bien structuré est votre premier pas pour vous démarquer. Notre créateur de CV gratuit vous permet de créer un CV de ${skillLabel} professionnel en quelques minutes.`
      : `Vous cherchez du travail à ${cityLabel} ? Un bon CV fait la différence entre obtenir un entretien et être ignoré. Notre créateur de CV gratuit en ligne vous propose des modèles professionnels et l'export PDF — entièrement gratuit, sans compte requis.`
    : `Créer un excellent CV de ${skillLabel} n'a pas à être difficile. Notre outil gratuit vous guide à travers chaque section — expérience, compétences, formation et plus — pour produire un PDF professionnel et compatible ATS en quelques minutes.`;

  const tips = skill
    ? [
        `Adaptez le résumé de votre CV pour mettre en valeur votre expertise en ${skillLabel}`,
        `Listez des réalisations mesurables, pas seulement des tâches`,
        `Incluez les compétences techniques pertinentes pour les postes de ${skillLabel}`,
        `Limitez votre CV à 1–2 pages et utilisez une mise en page claire`,
        `Ajoutez votre URL LinkedIn et un lien portfolio si vous en avez un`,
      ]
    : [
        `Adaptez les mots-clés de votre CV à l'offre d'emploi`,
        `Commencez par un résumé professionnel percutant`,
        `Quantifiez vos réalisations avec des chiffres et des résultats`,
        `Maintenez une mise en forme cohérente et évitez les blocs de texte denses`,
        `Relisez attentivement — les fautes d'orthographe coûtent des entretiens`,
      ];

  const faqs: Array<{ q: string; a: string }> = [
    {
      q:
        city && skill
          ? `Que doit contenir un CV de ${skillLabel} pour les emplois à ${city.label} ?`
          : skill
            ? `Que doit contenir un CV de ${skillLabel} ?`
            : `Quelles sections doit contenir un CV ?`,
      a: `Un bon CV doit inclure un résumé professionnel, une expérience professionnelle avec des résultats mesurables, la formation, les compétences et les coordonnées. ${city ? `Pour les employeurs à ${city.label}, soyez concis — généralement 1–2 pages.` : 'Limitez-le à 1–2 pages.'}`,
    },
    {
      q: `Ce créateur de CV est-il vraiment gratuit ?`,
      a: `Oui — entièrement gratuit. Pas d'inscription, pas de frais cachés. Remplissez vos informations et téléchargez votre CV en PDF instantanément.`,
    },
    {
      q: `Puis-je télécharger mon CV en PDF ?`,
      a: `Absolument. Cliquez sur "Télécharger PDF" et votre CV est enregistré sur votre appareil, prêt à être envoyé aux employeurs.`,
    },
    {
      q: city
        ? `Ces modèles de CV sont-ils acceptés par les employeurs à ${cityShort} ?`
        : `Ces modèles de CV sont-ils compatibles ATS ?`,
      a: `Nos modèles sont conçus pour être clairs et lisibles — compatibles avec les systèmes de suivi des candidatures (ATS) utilisés par les recruteurs du monde entier.`,
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

function buildEsSeoPageData(skill: SeoSkill | null, city: SeoCity | null): SeoPageData {
  const skillLabel = skill?.label ?? 'Profesional';
  const cityLabel = city ? `${city.label}, ${city.country}` : null;
  const cityShort = city?.label ?? null;
  const jobTitle = skill?.title ?? 'Profesional';

  const pageTitle = city
    ? skill
      ? `Creador de CV gratis para ${skillLabel}s en ${city.label} | CV Builder Pro`
      : `Creador de CV gratis en ${city.label} | CV Builder Pro`
    : `Creador de CV de ${skillLabel} gratis | CV Builder Pro`;

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

  const intro = city
    ? skill
      ? `El mercado laboral para ${skillLabel}s en ${cityLabel} es muy competitivo. Un CV pulido y bien estructurado es tu primer paso para destacar. Nuestro creador de CV gratuito te permite crear un CV profesional de ${skillLabel} en minutos.`
      : `¿Buscas trabajo en ${cityLabel}? Un buen CV marca la diferencia entre conseguir una entrevista y ser ignorado. Nuestro creador de CV gratuito online te ofrece plantillas profesionales y exportación PDF — completamente gratis, sin cuenta requerida.`
    : `Crear un excelente CV de ${skillLabel} no tiene por qué ser difícil. Nuestra herramienta gratuita te guía a través de cada sección — experiencia, habilidades, formación y más — para producir un PDF profesional y compatible con ATS en minutos.`;

  const tips = skill
    ? [
        `Adapta el resumen de tu CV para destacar tu experiencia en ${skillLabel}`,
        `Lista logros medibles, no solo tareas`,
        `Incluye habilidades técnicas relevantes para puestos de ${skillLabel}`,
        `Limita tu CV a 1–2 páginas y usa un diseño limpio y legible`,
        `Añade tu URL de LinkedIn y enlace de portfolio si los tienes`,
      ]
    : [
        `Adapta las palabras clave de tu CV a la oferta de empleo`,
        `Comienza con un resumen profesional sólido`,
        `Cuantifica tus logros con números y resultados`,
        `Mantén el formato consistente y evita bloques de texto densos`,
        `Revisa cuidadosamente — las erratas cuestan entrevistas`,
      ];

  const faqs: Array<{ q: string; a: string }> = [
    {
      q:
        city && skill
          ? `¿Qué debe incluir un CV de ${skillLabel} para empleos en ${city.label}?`
          : skill
            ? `¿Qué debe incluir un CV de ${skillLabel}?`
            : `¿Qué secciones debe tener un CV?`,
      a: `Un buen CV debe incluir un resumen profesional, experiencia laboral con resultados medibles, formación, habilidades y datos de contacto. ${city ? `Para empleadores en ${city.label}, sé conciso — normalmente 1–2 páginas.` : 'Limítalo a 1–2 páginas.'}`,
    },
    {
      q: `¿Este creador de CV es realmente gratis?`,
      a: `Sí — completamente gratis. Sin registro, sin cargos ocultos. Rellena tus datos y descarga tu CV en PDF al instante.`,
    },
    {
      q: `¿Puedo descargar mi CV en PDF?`,
      a: `Por supuesto. Haz clic en "Descargar PDF" y tu CV se guarda en tu dispositivo, listo para enviar a los empleadores.`,
    },
    {
      q: city
        ? `¿Estas plantillas de CV son aceptadas por empleadores en ${cityShort}?`
        : `¿Estas plantillas de CV son compatibles con ATS?`,
      a: `Nuestras plantillas están diseñadas para ser claras y legibles — compatibles con los sistemas de seguimiento de candidatos (ATS) utilizados por reclutadores en todo el mundo.`,
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

function buildArSeoPageData(skill: SeoSkill | null, city: SeoCity | null): SeoPageData {
  const skillLabel = skill?.label ?? 'محترف';
  const cityLabel = city ? `${city.label}` : null;
  const cityShort = city?.label ?? null;
  const jobTitle = skill?.title ?? 'محترف';

  const pageTitle = city
    ? skill
      ? `منشئ سيرة ذاتية مجاني لـ ${skillLabel} في ${city.label} | CV Builder Pro`
      : `منشئ سيرة ذاتية مجاني في ${city.label} | CV Builder Pro`
    : `منشئ سيرة ذاتية ${skillLabel} مجاني | CV Builder Pro`;

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

  const intro = city
    ? skill
      ? `سوق العمل لـ ${skillLabel} في ${cityLabel} تنافسي للغاية. سيرة ذاتية منظمة ومصقولة هي خطوتك الأولى للتميز. يتيح لك منشئ السيرة الذاتية المجاني إنشاء سيرة ذاتية ${skillLabel} احترافية في دقائق.`
      : `هل تبحث عن عمل في ${cityLabel}؟ السيرة الذاتية القوية هي الفرق بين الحصول على مقابلة والتجاهل. يوفر لك منشئ السيرة الذاتية المجاني قوالب احترافية وتصدير PDF — مجاناً تماماً، دون حساب.`
    : `إنشاء سيرة ذاتية رائعة لـ ${skillLabel} لا يجب أن يكون صعباً. تدلك أداتنا المجانية على كل قسم — الخبرة والمهارات والتعليم والمزيد — لإنتاج PDF احترافي ومتوافق مع ATS في دقائق.`;

  const tips = skill
    ? [
        `صمّم ملخص سيرتك الذاتية لإبراز خبرتك في ${skillLabel}`,
        `اذكر الإنجازات القابلة للقياس، ليس فقط المهام`,
        `أدرج المهارات التقنية ذات الصلة بوظائف ${skillLabel}`,
        `اجعل سيرتك الذاتية من صفحة إلى صفحتين وبتصميم واضح`,
        `أضف رابط LinkedIn والمعرض إن وجد`,
      ]
    : [
        `طابق الكلمات الرئيسية في سيرتك الذاتية مع الوظيفة المُعلنة`,
        `ابدأ بملخص مهني قوي`,
        `حدد إنجازاتك بالأرقام والنتائج`,
        `حافظ على تنسيق متناسق وتجنب كتل النص الكثيفة`,
        `راجع بعناية — الأخطاء الإملائية تُكلّفك المقابلات`,
      ];

  const faqs: Array<{ q: string; a: string }> = [
    {
      q:
        city && skill
          ? `ما الذي يجب أن تتضمنه سيرة ذاتية لـ ${skillLabel} في ${city.label}؟`
          : skill
            ? `ما الذي يجب أن تتضمنه سيرة ذاتية لـ ${skillLabel}؟`
            : `ما الأقسام التي يجب أن يتضمنها السيرة الذاتية؟`,
      a: `يجب أن تتضمن السيرة الذاتية القوية ملخصاً مهنياً وخبرة عملية مع نتائج قابلة للقياس وتعليماً ومهارات ومعلومات الاتصال. ${city ? `للمقابلات في ${city.label}، اجعلها موجزة — عادةً من صفحة إلى صفحتين.` : 'اجعلها من صفحة إلى صفحتين.'}`,
    },
    {
      q: `هل منشئ السيرة الذاتية هذا مجاني حقاً؟`,
      a: `نعم — مجاناً تماماً. بدون تسجيل، بدون رسوم مخفية. أدخل بياناتك وحمّل سيرتك الذاتية بصيغة PDF فوراً.`,
    },
    {
      q: `هل يمكنني تنزيل سيرتي الذاتية بصيغة PDF؟`,
      a: `بالتأكيد. انقر على "تحميل PDF" وسيتم حفظ سيرتك الذاتية على جهازك، جاهزة للإرسال إلى أصحاب العمل.`,
    },
    {
      q: city
        ? `هل تقبل هذه القوالب أصحاب العمل في ${cityShort}؟`
        : `هل هذه القوالب متوافقة مع أنظمة ATS؟`,
      a: `قوالبنا مصممة لتكون واضحة وسهلة القراءة — متوافقة مع أنظمة تتبع المتقدمين (ATS) التي يستخدمها المسؤولون عن التوظيف في جميع أنحاء العالم.`,
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

function buildTrSeoPageData(skill: SeoSkill | null, city: SeoCity | null): SeoPageData {
  const skillLabel = skill?.label ?? 'Profesyonel';
  const cityLabel = city ? `${city.label}` : null;
  const cityShort = city?.label ?? null;
  const jobTitle = skill?.title ?? 'Profesyonel';

  const pageTitle = city
    ? skill
      ? `${city.label}'de ${skillLabel}lar için Ücretsiz CV Oluşturucu | CV Builder Pro`
      : `${city.label}'de Ücretsiz CV Oluşturucu | CV Builder Pro`
    : `Ücretsiz ${skillLabel} CV Oluşturucu | CV Builder Pro`;

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

  const intro = city
    ? skill
      ? `${cityLabel}'deki ${skillLabel} iş piyasası oldukça rekabetçi. Özenle hazırlanmış ve iyi yapılandırılmış bir CV, öne çıkmanın ilk adımıdır. Ücretsiz CV oluşturucumuz, dakikalar içinde profesyonel bir ${skillLabel} CV'si oluşturmanızı sağlar.`
      : `${cityLabel}'de iş mi arıyorsunuz? Güçlü bir CV, mülakat almak ile görmezden gelinmek arasındaki farktır. Ücretsiz çevrimiçi CV oluşturucumuz, profesyonel şablonlar ve PDF dışa aktarma sunar — tamamen ücretsiz, hesap gerekmez.`
    : `Harika bir ${skillLabel} CV'si oluşturmak zor olmak zorunda değil. Ücretsiz aracımız sizi her bölümde — deneyim, beceriler, eğitim ve daha fazlası — yönlendirerek dakikalar içinde cilalı, ATS uyumlu bir PDF üretir.`;

  const tips = skill
    ? [
        `${skillLabel} uzmanlığınızı vurgulamak için CV özetinizi kişiselleştirin`,
        `Sadece görevleri değil, ölçülebilir başarıları listeleyin`,
        `${skillLabel} pozisyonları için ilgili teknik beceri ve araçları ekleyin`,
        `CV'nizi 1–2 sayfada tutun ve temiz, okunabilir bir düzen kullanın`,
        `Varsa LinkedIn URL'si ve portfolio linki ekleyin`,
      ]
    : [
        `CV'nizdeki anahtar kelimeleri iş ilanıyla eşleştirin`,
        `Güçlü bir profesyonel özetle başlayın`,
        `Başarılarınızı sayılar ve sonuçlarla ölçün`,
        `Tutarlı bir format kullanın ve yoğun metin bloklarından kaçının`,
        `Dikkatlice kontrol edin — yazım hataları mülakatları kaybettirir`,
      ];

  const faqs: Array<{ q: string; a: string }> = [
    {
      q:
        city && skill
          ? `${city.label}'deki işler için ${skillLabel} CV'si ne içermeli?`
          : skill
            ? `${skillLabel} CV'si ne içermeli?`
            : `Bir CV hangi bölümleri içermeli?`,
      a: `Güçlü bir CV; profesyonel özet, ölçülebilir sonuçlarla iş deneyimi, eğitim, beceriler ve iletişim bilgilerini içermelidir. ${city ? `${city.label} işverenler için kısa tutun — genellikle 1–2 sayfa.` : '1–2 sayfada tutun.'}`,
    },
    {
      q: `Bu CV oluşturucu gerçekten ücretsiz mi?`,
      a: `Evet — tamamen ücretsiz. Kayıt yok, gizli ücret yok. Bilgilerinizi doldurun ve CV'nizi anında PDF olarak indirin.`,
    },
    {
      q: `CV'mi PDF olarak indirebilir miyim?`,
      a: `Kesinlikle. "PDF İndir"e tıklayın ve CV'niz cihazınıza kaydedilir, işverenlere göndermeye hazır.`,
    },
    {
      q: city
        ? `Bu CV şablonları ${cityShort} işverenleri tarafından kabul ediliyor mu?`
        : `Bu CV şablonları ATS uyumlu mu?`,
      a: `Şablonlarımız temiz ve okunabilir olacak şekilde tasarlanmıştır — dünya genelindeki işe alım uzmanlarının kullandığı başvuru takip sistemleriyle (ATS) uyumludur.`,
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

function buildPtSeoPageData(skill: SeoSkill | null, city: SeoCity | null): SeoPageData {
  const skillLabel = skill?.label ?? 'Profissional';
  const cityLabel = city ? `${city.label}` : null;
  const cityShort = city?.label ?? null;
  const jobTitle = skill?.title ?? 'Profissional';

  const pageTitle = city
    ? skill
      ? `Criador de CV grátis para ${skillLabel}s em ${city.label} | CV Builder Pro`
      : `Criador de CV grátis em ${city.label} | CV Builder Pro`
    : `Criador de CV de ${skillLabel} grátis | CV Builder Pro`;

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

  const intro = city
    ? skill
      ? `O mercado de trabalho para ${skillLabel}s em ${cityLabel} é muito competitivo. Um CV bem elaborado e estruturado é o primeiro passo para se destacar. O nosso criador de CV gratuito permite-lhe criar um CV profissional de ${skillLabel} em minutos.`
      : `À procura de trabalho em ${cityLabel}? Um bom CV faz a diferença entre conseguir uma entrevista e ser ignorado. O nosso criador de CV gratuito online oferece-lhe modelos profissionais e exportação PDF — completamente grátis, sem conta necessária.`
    : `Criar um excelente CV de ${skillLabel} não tem de ser difícil. A nossa ferramenta gratuita guia-o em cada secção — experiência, competências, formação e mais — produzindo um PDF profissional e compatível com ATS em minutos.`;

  const tips = skill
    ? [
        `Adapte o resumo do seu CV para destacar a sua experiência em ${skillLabel}`,
        `Liste realizações mensuráveis, não apenas tarefas`,
        `Inclua competências técnicas relevantes para cargos de ${skillLabel}`,
        `Limite o seu CV a 1–2 páginas e use um layout limpo e legível`,
        `Adicione o URL do LinkedIn e um link de portfolio se tiver`,
      ]
    : [
        `Adapte as palavras-chave do seu CV à oferta de emprego`,
        `Comece com um resumo profissional sólido`,
        `Quantifique as suas realizações com números e resultados`,
        `Mantenha a formatação consistente e evite blocos de texto densos`,
        `Reveja com cuidado — erros tipográficos custam entrevistas`,
      ];

  const faqs: Array<{ q: string; a: string }> = [
    {
      q:
        city && skill
          ? `O que deve incluir um CV de ${skillLabel} para empregos em ${city.label}?`
          : skill
            ? `O que deve incluir um CV de ${skillLabel}?`
            : `Que secções deve ter um CV?`,
      a: `Um bom CV deve incluir um resumo profissional, experiência profissional com resultados mensuráveis, formação, competências e dados de contacto. ${city ? `Para empregadores em ${city.label}, seja conciso — normalmente 1–2 páginas.` : 'Limite-o a 1–2 páginas.'}`,
    },
    {
      q: `Este criador de CV é mesmo gratuito?`,
      a: `Sim — completamente gratuito. Sem registo, sem taxas ocultas. Preencha os seus dados e descarregue o seu CV em PDF instantaneamente.`,
    },
    {
      q: `Posso descarregar o meu CV em PDF?`,
      a: `Absolutamente. Clique em "Descarregar PDF" e o seu CV é guardado no seu dispositivo, pronto para enviar a empregadores.`,
    },
    {
      q: city
        ? `Estes modelos de CV são aceites por empregadores em ${cityShort}?`
        : `Estes modelos de CV são compatíveis com ATS?`,
      a: `Os nossos modelos são concebidos para serem claros e legíveis — compatíveis com os sistemas de rastreamento de candidatos (ATS) utilizados por recrutadores em todo o mundo.`,
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
