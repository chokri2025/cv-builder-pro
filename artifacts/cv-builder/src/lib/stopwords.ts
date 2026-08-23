/**
 * Stopwords per supported locale.
 *
 * A job ad is mostly connective tissue — "we are looking for a candidate who is
 * able to work with our team" — and matching a CV against those words would score
 * every CV highly. Dropping them is what leaves the terms that actually decide a
 * shortlist: the skills, tools, credentials and domain nouns.
 *
 * These lists cover function words plus the recruiting boilerplate that appears in
 * almost every advert ("candidate", "role", "company"), which carries no signal
 * about whether a particular CV fits.
 */

const EN =
  `a an the and or but if then than that this these those of in on at to for from by with without
about into over under again further once here there all any both each few more most other some such no nor not
only own same so too very can will just should now i you he she it we they them his her its our your their
is are was were be been being have has had having do does did doing would could may might must shall
who whom which what when where why how as also per via within across between during before after
we are looking seeking candidate candidates applicant applicants role roles position positions job jobs
work working works experience experienced years year team teams company companies opportunity opportunities
you will your ability able strong good excellent required requirement requirements responsibilities
please apply application successful ideal preferred plus bonus etc including include includes
join joining knowledge familiarity understanding proven demonstrable relevant various key new`
    .split(/\s+/)
    .filter(Boolean);

const FR =
  `le la les un une des du de d au aux et ou mais si alors que qui quoi dont où ce cet cette ces
son sa ses leur leurs notre nos votre vos mon ma mes ton ta tes il elle ils elles nous vous je tu on
est sont était étaient être été avoir a ont avait avaient faire fait fais peut peuvent pourra devra doit
dans sur sous pour par avec sans chez vers entre pendant avant après plus moins très tout tous toute toutes
autre autres même aussi ainsi donc car afin lors dès selon
nous recherchons recherche candidat candidats candidate poste postes emploi emplois mission missions
travail travailler entreprise société équipe équipes expérience expériences an ans année années
profil compétences requis requises exigences responsabilités vous serez votre capacité capable
merci postuler candidature idéal souhaité apprécié notamment dont inclus`
    .split(/\s+/)
    .filter(Boolean);

const ES =
  `el la los las un una unos unas de del al y o pero si entonces que quien cual cuyo donde este esta
estos estas ese esa su sus nuestro nuestra vuestro mi tu él ella ellos ellas nosotros vosotros yo
es son era eran ser sido estar está están haber ha han había tener tiene tienen hacer hace puede pueden
en sobre bajo para por con sin hacia entre durante antes después más menos muy todo todos toda todas
otro otros mismo también así pues porque para según desde
buscamos busca candidato candidatos candidata puesto puestos empleo empleos trabajo trabajar
empresa empresas equipo equipos experiencia experiencias año años perfil competencias requisitos
requerido requeridos responsabilidades serás tu capacidad capaz gracias postular candidatura ideal valorable`
    .split(/\s+/)
    .filter(Boolean);

const PT =
  `o a os as um uma uns umas de do da dos das no na nos nas ao aos e ou mas se então que quem qual
cujo onde este esta estes estas esse essa seu sua seus suas nosso nossa vosso meu teu ele ela eles elas nós vós eu tu
é são era eram ser sido estar está estão haver há tem têm ter fazer faz pode podem
em sobre sob para por com sem entre durante antes depois mais menos muito todo todos toda todas
outro outros mesmo também assim pois porque conforme desde
procuramos procura candidato candidatos candidata vaga vagas emprego empregos trabalho trabalhar
empresa empresas equipa equipas experiência experiências ano anos perfil competências requisitos
necessário necessários responsabilidades serás sua capacidade capaz obrigado candidatura ideal valorizado`
    .split(/\s+/)
    .filter(Boolean);

const TR =
  `ve veya ama ancak eğer ise ki bu şu o bunlar şunlar onlar bir birçok her hangi kim ne nerede nasıl
için ile olarak gibi kadar sonra önce üzere göre daha en çok az tüm bütün diğer aynı ayrıca yani çünkü
olan olarak olduğu var yok değil ben sen biz siz onun bizim sizin benim senin
arıyoruz aranıyor aday adaylar pozisyon pozisyonlar iş işler görev görevler çalışma çalışmak
şirket şirketler ekip ekibi deneyim deneyimli yıl yıllık profil yetkinlik yetkinlikler gereksinim
gerekli sorumluluklar olacaksınız yeteneği yetenekli başvuru başvurun ideal tercihen artı`
    .split(/\s+/)
    .filter(Boolean);

const AR =
  `في من على الى إلى عن مع هذا هذه ذلك تلك التي الذي الذين ما ماذا أين كيف متى لماذا و أو لكن إذا
ثم كل بعض غير نفس أيضا كذلك لأن حتى بين خلال قبل بعد أكثر أقل جدا هو هي هم هن نحن أنت أنتم أنا
هل يكون تكون كان كانت يوجد ليس لا نعم قد سوف عند لدى
نبحث مطلوب مرشح مرشحون وظيفة وظائف منصب مناصب عمل العمل شركة شركات فريق خبرة خبرات سنة سنوات
مهارات المهارات متطلبات المتطلبات مسؤوليات المسؤوليات قدرة القدرة التقديم التقدم مثالي يفضل`
    .split(/\s+/)
    .filter(Boolean);

const BY_LANG: Record<string, string[]> = { en: EN, fr: FR, es: ES, pt: PT, tr: TR, ar: AR };

/**
 * Stopwords for a locale, always including the English list: job ads in every
 * market mix in English terms, and an ad written in French still says "manager".
 */
export function stopwordsFor(lang: string): Set<string> {
  const local = BY_LANG[lang] ?? [];
  return new Set([...EN, ...local]);
}
