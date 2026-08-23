import type { MarketPhrasebook } from './types';

function list(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} et ${items[items.length - 1]}`;
}

function capitalize(s: string): string {
  return s ? `${s.charAt(0).toUpperCase()}${s.slice(1)}` : s;
}

export const fr: MarketPhrasebook = {
  sector: {
    finance: 'la finance',
    technology: 'la tech',
    healthcare: 'la santé',
    education: "l'éducation",
    media: 'les médias',
    tourism: "le tourisme et l'hôtellerie",
    logistics: 'la logistique',
    energy: "l'énergie",
    publicSector: 'le secteur public',
    manufacturing: "l'industrie",
    research: 'la recherche',
    retail: 'la distribution',
    construction: 'le BTP',
    startups: 'les startups',
    legal: 'les services juridiques',
  },

  norm: {
    noPhoto: 'ni photo, ni date de naissance, ni situation familiale',
    photoCommon: 'la photo professionnelle reste courante et souvent attendue',
    onePage: 'une seule page, sauf profil très expérimenté',
    twoPages: 'deux pages est la longueur admise',
    attestedCertificates: 'des diplômes attestés, prêts à être présentés',
    workAuthorization: 'indiquez explicitement votre visa ou autorisation de travail',
    referencesOnRequest: 'les références peuvent être mentionnées « disponibles sur demande »',
    localContactDetails: 'un numéro local et la ville, plutôt qu’une adresse complète',
    languageLevels: 'des niveaux de langue précis (A1–C2) plutôt que des mentions vagues',
    reverseChronological: 'un ordre antéchronologique, sans trou inexpliqué',
  },

  credentialKind: {
    registration: 'inscription',
    licence: 'licence',
    certification: 'certification',
    qualification: 'qualification',
    attestation: 'attestation',
  },

  credentialProof: (name, kind, city) => {
    const detail =
      kind === 'registration' || kind === 'licence'
        ? 'l’organisme, votre numéro et la date d’expiration'
        : kind === 'certification'
          ? 'l’organisme émetteur et la date d’obtention'
          : kind === 'attestation'
            ? 'ce qui a été attesté et à quelle date'
            : 'l’établissement et l’année d’obtention';
    return `${city ? `Les employeurs à ${city} vérifient ` : 'Les employeurs vérifient '}${name} avant tout le reste : faites figurer ${detail} sur le CV lui-même, pas en pièce jointe.`;
  },

  categoryProof: {
    healthcare:
      'Les organismes d’inscription varient selon les pays : indiquez le vôtre, votre numéro et sa date d’expiration en haut du CV.',
    technology:
      'Aucune licence à présenter dans la tech : les recruteurs lisent votre stack, vos projets livrés et les chiffres associés.',
    education:
      'Les qualifications d’enseignement sont vérifiées très tôt : précisez le diplôme, les programmes enseignés et vos habilitations dès le début.',
    finance:
      'Les qualifications et les référentiels comptables constituent le premier filtre : citez-les, y compris les examens en cours.',
    creative:
      'Les présélections créatives se jouent sur le portfolio : le rôle du CV est de le faire ouvrir.',
    business:
      'Rien n’est réglementé ici : ce sont les preuves de périmètre — budget, effectifs, résultats — qui font le travail.',
    engineering:
      'Le statut d’ingénieur habilité détermine ce que vous pouvez valider : indiquez votre inscription, votre spécialité et les normes que vous appliquez.',
    trades:
      'Votre habilitation est la première chose vérifiée par une entreprise : commencez par sa catégorie, son numéro et sa validité.',
  },

  genericProof:
    'Les recruteurs cherchent des preuves : ce que vous avez piloté, à quelle échelle et ce que cela a changé.',

  introSkillCity: [
    (c) =>
      `Les employeurs de ${list(c.sectors.slice(0, 2))} à ${c.city} recrutent des profils de ${c.skill} toute l’année, et la plupart des offres passent par ${c.boards}. ${c.proof} Notre créateur de CV gratuit transforme ces éléments en un CV de ${c.skill} clair et compatible ATS, téléchargeable en PDF en quelques minutes.`,
    (c) =>
      `Les postes de ${c.skill} à ${c.city} se concentrent autour de ${c.anchors}. ${c.proof} Construisez un CV de ${c.skill} qui met ces preuves en avant — ${c.norms[0]} — puis exportez-le en PDF, gratuitement et sans compte.`,
    (c) =>
      `Un CV de ${c.skill} efficace à ${c.city} n’est pas celui que vous enverriez ailleurs : ${c.norms[0]}, et ${c.norms[1]}. ${c.proof} Notre outil gratuit gère la mise en page pour que vous vous concentriez sur le contenu.`,
  ],

  introSkill: [
    (c) =>
      `Un bon CV de ${c.skill} repose sur des preuves, pas sur des adjectifs. ${c.proof} Notre créateur de CV gratuit vous guide section par section — résumé, expérience, compétences, formation — et exporte un PDF compatible ATS en quelques minutes.`,
    (c) =>
      `La plupart des candidatures de ${c.skill} sont écartées dès la première lecture, avant même le détail. ${c.proof} Utilisez notre outil gratuit pour placer l’information décisive dans le premier tiers de la page, puis téléchargez votre CV en PDF.`,
    (c) =>
      `Les recruteurs comparent les CV de ${c.skill} à une liste d’éléments qu’ils doivent absolument trouver. ${c.proof} Notre créateur en ligne gratuit vous donne une structure qui les met en évidence, avec trois modèles professionnels et un export PDF immédiat.`,
  ],

  introCity: [
    (c) =>
      `Le recrutement à ${c.city} est porté par ${list(c.sectors)}, avec des postes concentrés autour de ${c.anchors}. ${c.proof} Notre créateur de CV gratuit vous donne un CV professionnel et compatible ATS — ${c.norms[0]} — prêt à télécharger en PDF.`,
    (c) =>
      `À ${c.city}, vous êtes en concurrence avec des candidats qui respectent déjà les conventions locales : ${c.norms[0]}, et ${c.norms[1]}. ${c.proof} Créez un CV conforme en quelques minutes, gratuitement et sans inscription.`,
    (c) =>
      `La plupart des offres à ${c.city} sont publiées sur ${c.boards}, et les recruteurs y trient des dizaines de CV par poste. ${c.proof} Notre créateur de CV gratuit vous aide à produire un PDF clair et structuré qui passe ce premier filtre.`,
  ],

  categoryTips: {
    healthcare: [
      'Placez votre organisme d’inscription, votre numéro et la date d’expiration en haut du CV : c’est vérifié avant toute lecture.',
      'Détaillez vos services et rotations (réanimation, bloc, domicile) avec le nombre de lits ou de patients pour rendre votre niveau évident.',
      'Regroupez les formations obligatoires (AFGSU, gestes d’urgence, hygiène, protection des personnes) dans un bloc dédié.',
      'Précisez vos disponibilités horaires et votre date de prise de poste : les plannings bloquent la plupart des recrutements soignants.',
    ],
    technology: [
      'Commencez par une ligne de stack — langages, frameworks, cloud, outillage — pour passer les filtres par mots-clés dès la première lecture.',
      'Décrivez les systèmes par leur échelle : requêtes par seconde, volumétrie, utilisateurs servis, latence ou coûts réduits.',
      'Ajoutez un lien vers un dépôt ou un projet en ligne : les recruteurs techniques l’ouvrent plus souvent qu’ils ne finissent le résumé.',
      'Montrez ce que vous avez porté — ce que vous avez conçu, ce qui a cassé, ce que vous avez corrigé — plutôt que la feuille de route de l’équipe.',
    ],
    education: [
      'Indiquez dès la première section les niveaux, matières et programmes enseignés (programme national, IB, options).',
      'Chiffrez les résultats : progression des élèves, effectifs de classe, taux de réussite — pas une liste de tâches.',
      'Mentionnez les formations à la protection de l’enfance et vos habilitations : les établissements les contrôlent tôt.',
      'Ajoutez les clubs, le tutorat et les responsabilités de vie scolaire : ils pèsent réellement dans les présélections.',
    ],
    finance: [
      'Nommez les référentiels et outils que vous maîtrisez — IFRS, normes locales, SAP, Oracle, NetSuite : les filtres sont bâtis dessus.',
      'Donnez des ordres de grandeur : budgets pilotés, encours, délais de clôture, périmètre d’audit.',
      'Précisez l’avancement de votre qualification professionnelle : unités validées et date d’obtention prévue.',
      'Séparez la technique comptable de l’analyse et de la relation client pour que les deux se lisent en diagonale.',
    ],
    creative: [
      'Mettez le lien du portfolio dans l’en-tête : un CV créatif sans portfolio est rarement relu.',
      'Décrivez des résultats plutôt que des livrables : audience, conversion, rétention, chiffre d’affaires généré.',
      'Regroupez les outils que vous maîtrisez vraiment (Figma, Adobe CC, CMS, analytics) dans un bloc lisible.',
      'Choisissez trois à cinq réalisations en lien avec le poste et précisez exactement votre part dans chacune.',
    ],
    business: [
      'Présentez chaque poste comme un mandat : ce que vous pilotiez, le budget ou l’effectif, et le résultat obtenu.',
      'Utilisez des indicateurs comparables : délais, pipeline, rétention, économies réalisées.',
      'Listez les méthodes et outils que vous pratiquez réellement (Agile, PRINCE2, Salesforce, Jira, SQL) plutôt qu’une liste de mots-clés.',
      'Montrez votre périmètre : équipes, régions, dirigeants et partenaires avec lesquels vous avez travaillé.',
    ],
    engineering: [
      'Indiquez en haut votre statut d’inscription et votre spécialité : ils déterminent ce que vous pouvez valider.',
      'Listez les projets avec leur montant, leur ampleur et votre rôle réel : conception, suivi de chantier, autorisations.',
      'Citez les normes et logiciels que vous appliquez (Eurocodes, DTU, AutoCAD, Revit, ETABS).',
      'Ajoutez vos certifications sécurité et qualité : les entreprises les vérifient avant l’entretien.',
    ],
    trades: [
      'Commencez par votre habilitation : catégorie, numéro et date de validité.',
      'Listez les types d’installations réalisées — résidentiel, tertiaire, industriel, photovoltaïque, HT — avec les tensions.',
      'Ajoutez les certifications de contrôle et de sécurité, ainsi que le permis de conduire et l’outillage personnel.',
      'Incluez des références de conducteurs de travaux : dans les métiers techniques, elles valent plus qu’un paragraphe de présentation.',
    ],
  },

  genericTips: [
    'Reprenez les mots de l’annonce pour l’intitulé du poste et les compétences clés : les filtres comparent des expressions exactes.',
    'Ouvrez par un résumé de quatre lignes qui nomme votre métier, vos années d’expérience et le résultat que vous apportez.',
    'Chiffrez tout ce qui peut l’être : les nombres survivent à la lecture en diagonale, pas les adjectifs.',
    'Gardez un CV par type de poste : un CV généraliste perd presque toujours face à un CV ciblé.',
  ],

  localTip: (c) =>
    c.city
      ? `Respectez les usages de ${c.city} : ${c.norms[0]}, et ${c.norms[1]}.`
      : 'Adaptez-vous aux conventions du pays visé : longueur, photo et informations personnelles varient fortement.',

  localTitle: (c) =>
    c.skill && c.city
      ? `Ce que les employeurs de ${c.city} attendent d’un CV de ${c.skill}`
      : c.city
        ? `Ce que les employeurs de ${c.city} attendent d’un CV`
        : `Ce que les employeurs attendent d’un CV de ${c.skill}`,

  localLines: (c) => {
    const lines: string[] = [c.proof];
    if (c.norms.length > 0) {
      lines.push(`Conventions locales du CV : ${list(c.norms)}.`);
    }
    if (c.sectors.length > 0 && c.anchors) {
      lines.push(
        `La demande se concentre dans ${list(c.sectors)} — autour de ${c.anchors} — reprenez ce vocabulaire dans votre résumé et vos compétences.`,
      );
    }
    if (c.boards) {
      lines.push(
        `Les offres passent surtout par ${c.boards} : gardez un PDF adapté prêt avant de postuler.`,
      );
    }
    return lines;
  },

  faqs: (c) => {
    const entries = [];

    entries.push({
      q:
        c.skill && c.city
          ? `Que doit contenir un CV de ${c.skill} pour les emplois à ${c.city} ?`
          : c.skill
            ? `Que doit contenir un CV de ${c.skill} ?`
            : `Que doit contenir un CV pour les emplois à ${c.city} ?`,
      a: `${c.credential ? `Commencez par ${c.credential}, puis` : 'Commencez par un résumé de quatre lignes, puis'} une expérience rédigée en résultats mesurables, la formation et un bloc de compétences aligné sur l’annonce.${
        c.norms.length > 0 ? ` Conventions locales : ${list(c.norms)}.` : ''
      }`,
    });

    if (c.credential) {
      entries.push({
        q: `Faut-il ${c.credential} pour postuler${c.city ? ` à ${c.city}` : ''} ?`,
        a: `C’est ce que demandent les employeurs locaux pour la plupart des postes de ${c.skill ?? 'ce type'}, et c’est généralement vérifié avant l’embauche. Si votre démarche est en cours, indiquez-le : mentionnez-la avec « en cours » et la date prévue, ce qui vaut bien mieux que l’omission.`,
      });
    } else {
      entries.push({
        q: `Quelle longueur pour un CV de ${c.skill ?? 'professionnel'}${c.city ? ` à ${c.city}` : ''} ?`,
        a: `${c.lengthNorm ? `${capitalize(c.lengthNorm)}.` : 'Une à deux pages.'} Au-delà, le CV est survolé : réduisez les postes anciens à une ligne chacun.`,
      });
    }

    if (c.city && c.boards) {
      entries.push({
        q: `Où sont publiées les offres${c.skill ? ` de ${c.skill}` : ''} à ${c.city} ?`,
        a: `Principalement sur ${c.boards}${c.anchors ? `, les plus gros employeurs se trouvant autour de ${c.anchors}` : ''}. Les candidatures y sont d’abord filtrées automatiquement : reprenez l’intitulé et les compétences tels qu’ils figurent dans l’annonce.`,
      });
    } else {
      entries.push({
        q: `Ce CV passe-t-il les filtres ATS ?`,
        a: `Nos modèles utilisent une mise en page en une colonne, en texte réel, avec des intitulés de sections standard — c’est ce que les logiciels de recrutement analysent le plus fiablement. Gardez les mots de l’annonce pour vos intitulés et compétences.`,
      });
    }

    entries.push({
      q: `CV Builder Pro est-il gratuit ?`,
      a: `Oui — entièrement gratuit, sans inscription ni frais cachés. Remplissez vos informations, choisissez un modèle et téléchargez votre CV en PDF immédiatement.`,
    });

    return entries;
  },
};
