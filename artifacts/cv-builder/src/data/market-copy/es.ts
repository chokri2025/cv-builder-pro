import type { MarketPhrasebook } from './types';

function list(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}

function capitalize(s: string): string {
  return s ? `${s.charAt(0).toUpperCase()}${s.slice(1)}` : s;
}

export const es: MarketPhrasebook = {
  sector: {
    finance: 'las finanzas',
    technology: 'la tecnología',
    healthcare: 'la sanidad',
    education: 'la educación',
    media: 'los medios',
    tourism: 'el turismo y la hostelería',
    logistics: 'la logística',
    energy: 'la energía',
    publicSector: 'el sector público',
    manufacturing: 'la industria',
    research: 'la investigación',
    retail: 'el comercio',
    construction: 'la construcción',
    startups: 'las startups',
    legal: 'los servicios jurídicos',
  },

  norm: {
    noPhoto: 'sin foto, fecha de nacimiento ni estado civil',
    photoCommon: 'la foto profesional sigue siendo habitual y suele esperarse',
    onePage: 'una sola página, salvo perfiles muy sénior',
    twoPages: 'dos páginas es la extensión aceptada',
    attestedCertificates: 'títulos legalizados y listos para presentar',
    workAuthorization: 'indica de forma explícita tu visado o permiso de trabajo',
    referencesOnRequest: 'las referencias pueden figurar como «disponibles a petición»',
    localContactDetails: 'un teléfono local y la ciudad, en lugar de la dirección completa',
    languageLevels: 'niveles de idioma concretos (A1–C2) en vez de etiquetas vagas',
    reverseChronological: 'orden cronológico inverso, sin huecos sin explicar',
  },

  credentialKind: {
    registration: 'colegiación',
    licence: 'licencia',
    certification: 'certificación',
    qualification: 'titulación',
    attestation: 'legalización',
  },

  credentialProof: (name, kind, city) => {
    const detail =
      kind === 'registration' || kind === 'licence'
        ? 'el organismo, tu número y la fecha de caducidad'
        : kind === 'certification'
          ? 'la entidad emisora y la fecha de obtención'
          : kind === 'attestation'
            ? 'qué documentos están legalizados y desde cuándo'
            : 'el centro y el año en que la obtuviste';
    return `${city ? `Los empleadores de ${city} comprueban ` : 'Los empleadores comprueban '}${name} antes que nada: incluye ${detail} en el propio CV, no en un adjunto.`;
  },

  categoryProof: {
    healthcare:
      'Los organismos de registro cambian según el país: indica el tuyo, tu número de colegiación y su vigencia en la parte superior del CV.',
    technology:
      'En tecnología no hay licencia que mostrar: los reclutadores leen tu stack, lo que has puesto en producción y las cifras que lo respaldan.',
    education:
      'La titulación docente se verifica pronto: indica el título, los currículos que has impartido y tus certificados de antecedentes desde el principio.',
    finance:
      'Las titulaciones y las normas contables son el primer filtro: menciona ambas, incluidos los exámenes en curso.',
    creative:
      'Las preselecciones creativas se deciden por el portfolio: la función del CV es conseguir que lo abran.',
    business:
      'Aquí no hay nada regulado: las pruebas de alcance —presupuesto, equipo, resultados— son las que trabajan por ti.',
    engineering:
      'La colegiación determina qué proyectos puedes firmar: indica tu registro, tu especialidad y las normas con las que diseñas.',
    trades:
      'Tu carné o licencia es lo primero que revisa una contrata: empieza por su categoría, número y vigencia.',
  },

  genericProof:
    'Los reclutadores buscan pruebas: qué gestionaste, a qué escala y qué cambió gracias a ello.',

  introSkillCity: [
    (c) =>
      `Las empresas de ${list(c.sectors.slice(0, 2))} en ${c.city} contratan perfiles de ${c.skill} todo el año, y la mayoría de las vacantes se publican en ${c.boards}. ${c.proof} Nuestro creador de CV gratuito convierte esos datos en un CV de ${c.skill} limpio y compatible con ATS, descargable en PDF en minutos.`,
    (c) =>
      `Las vacantes de ${c.skill} en ${c.city} se concentran alrededor de ${c.anchors}. ${c.proof} Crea un CV de ${c.skill} que ponga esas pruebas por delante — ${c.norms[0]} — y expórtalo en PDF, gratis y sin cuenta.`,
    (c) =>
      `Un CV de ${c.skill} que funciona en ${c.city} no es el mismo documento que enviarías a otro país: ${c.norms[0]}, y ${c.norms[1]}. ${c.proof} Nuestra herramienta gratuita se ocupa del formato para que tú te ocupes del contenido.`,
  ],

  introSkill: [
    (c) =>
      `Un buen CV de ${c.skill} se construye con pruebas, no con adjetivos. ${c.proof} Nuestro creador de CV gratuito te guía sección a sección —resumen, experiencia, habilidades, formación— y exporta un PDF compatible con ATS en minutos.`,
    (c) =>
      `La mayoría de las candidaturas de ${c.skill} se descartan en la primera lectura, antes de llegar al detalle. ${c.proof} Usa nuestra herramienta gratuita para colocar lo decisivo en el primer tercio de la página y descarga tu CV en PDF.`,
    (c) =>
      `Los reclutadores comparan los CV de ${c.skill} con una lista de cosas que deben encontrar sí o sí. ${c.proof} Nuestro creador online gratuito te da una estructura que las destaca, con tres plantillas profesionales y exportación inmediata a PDF.`,
  ],

  introCity: [
    (c) =>
      `La contratación en ${c.city} la mueven ${list(c.sectors)}, con vacantes concentradas en ${c.anchors}. ${c.proof} Nuestro creador de CV gratuito te da un CV profesional y compatible con ATS — ${c.norms[0]} — listo para descargar en PDF.`,
    (c) =>
      `En ${c.city} compites con candidatos que ya siguen las convenciones locales: ${c.norms[0]}, y ${c.norms[1]}. ${c.proof} Crea en minutos un CV que las respete, gratis y sin registro.`,
    (c) =>
      `La mayoría de las ofertas de ${c.city} se publican en ${c.boards}, y allí cada puesto recibe decenas de CV. ${c.proof} Nuestro creador de CV gratuito te ayuda a producir un PDF claro y bien estructurado que supera ese primer filtro.`,
  ],

  categoryTips: {
    healthcare: [
      'Coloca el organismo de colegiación, tu número y la fecha de vigencia arriba del todo: se comprueba antes de leer nada más.',
      'Detalla servicios y rotaciones (UCI, quirófano, atención domiciliaria) con número de camas o pacientes para que se vea tu nivel.',
      'Agrupa la formación obligatoria (SVB/SVA, movilización de pacientes, protección de menores) en un bloque propio.',
      'Indica tu disponibilidad de turnos y fecha de incorporación: los cuadrantes son lo que frena la mayoría de las candidaturas sanitarias.',
    ],
    technology: [
      'Empieza con una línea de stack —lenguajes, frameworks, cloud, herramientas— para superar los filtros por palabras clave a la primera.',
      'Describe los sistemas por su escala: peticiones por segundo, volumen de datos, usuarios atendidos, latencia o coste reducidos.',
      'Enlaza un repositorio o un proyecto en producción: los responsables técnicos lo abren más a menudo de lo que terminan el resumen.',
      'Muestra lo que fue tuyo —qué diseñaste, qué se rompió y qué cambiaste— en lugar de la hoja de ruta del equipo.',
    ],
    education: [
      'Indica en la primera sección las edades, materias y currículos que has impartido (currículo nacional, IB, bachillerato).',
      'Cuantifica resultados: mejora de calificaciones, tamaño de los grupos, tasas de aprobados — no un listado de tareas.',
      'Incluye la formación en protección de menores y tu certificado de delitos sexuales: los centros lo revisan pronto.',
      'Añade actividades extraescolares, refuerzo y tutoría: pesan de verdad en las preselecciones docentes.',
    ],
    finance: [
      'Nombra las normas y sistemas con los que trabajas —NIIF, plan general contable, SAP, Oracle, NetSuite—: los filtros se construyen sobre ellos.',
      'Da magnitudes: presupuestos gestionados, volumen de cartera, tiempos de cierre mensual, alcance de auditoría.',
      'Muestra el avance de tu titulación profesional, con la fase de exámenes y la fecha prevista de obtención.',
      'Separa la parte técnica contable del análisis y la relación con clientes para que ambas se lean en diagonal.',
    ],
    creative: [
      'Pon el enlace al portfolio en la cabecera: un CV creativo sin portfolio rara vez recibe una segunda lectura.',
      'Describe resultados, no entregables: alcance, conversión, retención o ingresos generados por el trabajo.',
      'Agrupa las herramientas que realmente dominas (Figma, Adobe CC, CMS, analítica) en un bloque legible.',
      'Elige de tres a cinco trabajos alineados con el puesto y explica exactamente cuál fue tu parte en cada uno.',
    ],
    business: [
      'Plantea cada puesto como un mandato: qué gestionabas, con qué presupuesto o equipo y con qué resultado.',
      'Usa métricas comparables: tiempos de ciclo, pipeline, retención, ahorro conseguido.',
      'Enumera los métodos y herramientas que usas de verdad (Agile, PRINCE2, Salesforce, Jira, SQL) en vez de una lista de palabras de moda.',
      'Muestra tu alcance: equipos, regiones, directivos y socios con los que trabajaste.',
    ],
    engineering: [
      'Pon arriba tu situación de colegiación y tu especialidad: determinan qué proyectos puedes firmar.',
      'Lista los proyectos con importe, escala y tu papel real: diseño, dirección de obra, licencias.',
      'Cita las normas y el software con los que trabajas (Eurocódigos, CTE, AutoCAD, Revit, ETABS).',
      'Incluye certificaciones de seguridad y calidad en obra: las contratas las revisan antes de la entrevista.',
    ],
    trades: [
      'Empieza por tu licencia o carné: categoría, número y fecha de caducidad.',
      'Enumera los tipos de instalación en los que has trabajado —vivienda, terciario, industrial, fotovoltaica, alta tensión— con tensiones.',
      'Añade certificaciones de prueba y seguridad, además del carné de conducir y si aportas herramienta propia.',
      'Incluye referencias de jefes de obra: en los oficios pesan más que cualquier párrafo de presentación.',
    ],
  },

  genericTips: [
    'Reutiliza las palabras del anuncio para el título del puesto y las competencias clave: los filtros buscan coincidencias exactas.',
    'Abre con un resumen de cuatro líneas que diga tu especialidad, tus años de experiencia y el resultado que aportas.',
    'Cuantifica lo que puedas: los números sobreviven a la lectura rápida, los adjetivos no.',
    'Mantén un CV por tipo de puesto: un CV genérico pierde casi siempre frente a uno dirigido.',
  ],

  localTip: (c) =>
    c.city
      ? `Sigue las convenciones de ${c.city}: ${c.norms[0]}, y ${c.norms[1]}.`
      : 'Adáptate a las convenciones del país al que te presentas: extensión, foto y datos personales varían mucho.',

  localTitle: (c) =>
    c.skill && c.city
      ? `Qué esperan los empleadores de ${c.city} en un CV de ${c.skill}`
      : c.city
        ? `Qué esperan los empleadores de ${c.city} en un CV`
        : `Qué esperan los empleadores en un CV de ${c.skill}`,

  localLines: (c) => {
    const lines: string[] = [c.proof];
    if (c.norms.length > 0) {
      lines.push(`Convenciones locales del CV: ${list(c.norms)}.`);
    }
    if (c.sectors.length > 0 && c.anchors) {
      lines.push(
        `La demanda se concentra en ${list(c.sectors)} —alrededor de ${c.anchors}—, así que usa ese vocabulario en tu resumen y tus habilidades.`,
      );
    }
    if (c.boards) {
      lines.push(
        `Las ofertas se publican sobre todo en ${c.boards}: ten un PDF adaptado listo antes de inscribirte.`,
      );
    }
    return lines;
  },

  faqs: (c) => {
    const entries = [];

    entries.push({
      q:
        c.skill && c.city
          ? `¿Qué debe incluir un CV de ${c.skill} para empleos en ${c.city}?`
          : c.skill
            ? `¿Qué debe incluir un CV de ${c.skill}?`
            : `¿Qué debe incluir un CV para empleos en ${c.city}?`,
      a: `${c.credential ? `Empieza por ${c.credential} y sigue con` : 'Empieza por un resumen de cuatro líneas y sigue con'} la experiencia redactada como resultados medibles, la formación y un bloque de habilidades alineado con el anuncio.${
        c.norms.length > 0 ? ` Convenciones locales: ${list(c.norms)}.` : ''
      }`,
    });

    if (c.credential) {
      entries.push({
        q: `¿Hace falta ${c.credential} para presentarse${c.city ? ` en ${c.city}` : ''}?`,
        a: `Es lo que piden los empleadores locales en la mayoría de los puestos de ${c.skill ?? 'este tipo'}, y suele verificarse antes de la contratación. Si el trámite está en curso, dilo: menciónalo con «en trámite» y la fecha prevista; funciona mucho mejor que omitirlo.`,
      });
    } else {
      entries.push({
        q: `¿Cuánto debe ocupar un CV de ${c.skill ?? 'profesional'}${c.city ? ` en ${c.city}` : ''}?`,
        a: `${c.lengthNorm ? `${capitalize(c.lengthNorm)}.` : 'Entre una y dos páginas.'} Más allá de eso el CV se ojea en vez de leerse: reduce los puestos antiguos a una línea cada uno.`,
      });
    }

    if (c.city && c.boards) {
      entries.push({
        q: `¿Dónde se publican las ofertas${c.skill ? ` de ${c.skill}` : ''} en ${c.city}?`,
        a: `Sobre todo en ${c.boards}${c.anchors ? `, con los mayores empleadores alrededor de ${c.anchors}` : ''}. Allí las candidaturas se filtran primero de forma automática: mantén el título del puesto y las competencias con las mismas palabras del anuncio.`,
      });
    } else {
      entries.push({
        q: `¿Este CV pasa los filtros ATS?`,
        a: `Nuestras plantillas usan un diseño de una columna, con texto real y encabezados de sección estándar, que es lo que mejor interpretan los sistemas de selección. Conserva en tus títulos y habilidades las palabras del anuncio.`,
      });
    }

    entries.push({
      q: `¿CV Builder Pro es gratis?`,
      a: `Sí — completamente gratis, sin registro ni cargos ocultos. Rellena tus datos, elige una plantilla y descarga tu CV en PDF al instante.`,
    });

    return entries;
  },
};
