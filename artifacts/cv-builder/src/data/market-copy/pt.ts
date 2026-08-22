import type { MarketPhrasebook } from './types';

function list(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;
}

function capitalize(s: string): string {
  return s ? `${s.charAt(0).toUpperCase()}${s.slice(1)}` : s;
}

export const pt: MarketPhrasebook = {
  sector: {
    finance: 'a finança',
    technology: 'a tecnologia',
    healthcare: 'a saúde',
    education: 'a educação',
    media: 'os media',
    tourism: 'o turismo e a hotelaria',
    logistics: 'a logística',
    energy: 'a energia',
    publicSector: 'o setor público',
    manufacturing: 'a indústria',
    research: 'a investigação',
    retail: 'o retalho',
    construction: 'a construção',
    startups: 'as startups',
    legal: 'os serviços jurídicos',
  },

  norm: {
    noPhoto: 'sem fotografia, data de nascimento ou estado civil',
    photoCommon: 'a fotografia profissional continua a ser normal e muitas vezes esperada',
    onePage: 'uma única página, exceto em perfis muito séniores',
    twoPages: 'duas páginas é a extensão aceite',
    attestedCertificates: 'certificados autenticados e prontos a apresentar',
    workAuthorization: 'indique explicitamente o seu visto ou autorização de trabalho',
    referencesOnRequest: 'as referências podem ficar como «disponíveis mediante pedido»',
    localContactDetails: 'um número local e a cidade, em vez da morada completa',
    languageLevels: 'níveis de língua concretos (A1–C2) em vez de rótulos vagos',
    reverseChronological: 'ordem cronológica inversa, sem lacunas por explicar',
  },

  credentialKind: {
    registration: 'inscrição',
    licence: 'licença',
    certification: 'certificação',
    qualification: 'qualificação',
    attestation: 'autenticação',
  },

  credentialProof: (name, kind, city) => {
    const detail =
      kind === 'registration' || kind === 'licence'
        ? 'a entidade, o seu número e a data de validade'
        : kind === 'certification'
          ? 'a entidade emissora e a data em que a obteve'
          : kind === 'attestation'
            ? 'o que está autenticado e desde quando'
            : 'a instituição e o ano de conclusão';
    return `${city ? `Os empregadores em ${city} verificam ` : 'Os empregadores verificam '}${name} antes de tudo o resto: coloque ${detail} no próprio CV e não num anexo.`;
  },

  categoryProof: {
    healthcare:
      'As entidades de inscrição variam entre países: indique a sua, o número de cédula e a respetiva validade no topo do CV.',
    technology:
      'Na tecnologia não há licença a mostrar: os recrutadores leem a sua stack, o que colocou em produção e os números por trás disso.',
    education:
      'As habilitações para a docência são verificadas cedo: indique a habilitação, os currículos que lecionou e o registo criminal desde o início.',
    finance:
      'As qualificações e as normas de relato são o primeiro filtro: mencione ambas, incluindo exames ainda em curso.',
    creative:
      'As pré-seleções criativas decidem-se pelo portefólio: a função do CV é conseguir que o abram.',
    business:
      'Nada aqui é regulado: são as provas de âmbito — orçamento, equipa, resultados — que fazem esse trabalho.',
    engineering:
      'A inscrição na ordem determina o que pode assinar: indique o registo, a especialidade e as normas com que projeta.',
    trades:
      'A sua licença é a primeira coisa que um empreiteiro confirma: comece pela categoria, número e validade.',
  },

  genericProof:
    'Os recrutadores procuram provas: o que geriu, a que escala e o que mudou por causa disso.',

  introSkillCity: [
    (c) =>
      `Os empregadores de ${list(c.sectors.slice(0, 2))} em ${c.city} recrutam perfis de ${c.skill} durante todo o ano e a maioria das vagas é anunciada em ${c.boards}. ${c.proof} O nosso criador de CV gratuito transforma esses dados num CV de ${c.skill} limpo e compatível com ATS, para descarregar em PDF em minutos.`,
    (c) =>
      `As vagas de ${c.skill} em ${c.city} concentram-se em torno de ${c.anchors}. ${c.proof} Construa um CV de ${c.skill} que coloque essas provas à frente — ${c.norms[0]} — e exporte-o em PDF, grátis e sem conta.`,
    (c) =>
      `Um CV de ${c.skill} que funciona em ${c.city} não é o documento que enviaria para outro país: ${c.norms[0]}, e ${c.norms[1]}. ${c.proof} A nossa ferramenta gratuita trata da formatação para que se concentre no conteúdo.`,
  ],

  introSkill: [
    (c) =>
      `Um bom CV de ${c.skill} constrói-se com provas, não com adjetivos. ${c.proof} O nosso criador de CV gratuito guia-o secção a secção — resumo, experiência, competências, formação — e exporta um PDF compatível com ATS em minutos.`,
    (c) =>
      `A maioria das candidaturas de ${c.skill} é excluída logo na primeira leitura, antes do detalhe. ${c.proof} Use a nossa ferramenta gratuita para colocar o decisivo no primeiro terço da página e descarregue o CV em PDF.`,
    (c) =>
      `Os recrutadores comparam CV de ${c.skill} com uma lista do que têm mesmo de encontrar. ${c.proof} O nosso criador online gratuito dá-lhe uma estrutura que destaca esses pontos, com três modelos profissionais e exportação imediata para PDF.`,
  ],

  introCity: [
    (c) =>
      `A contratação em ${c.city} é puxada por ${list(c.sectors)}, com vagas concentradas em torno de ${c.anchors}. ${c.proof} O nosso criador de CV gratuito dá-lhe um CV profissional e compatível com ATS — ${c.norms[0]} — pronto a descarregar em PDF.`,
    (c) =>
      `Em ${c.city} concorre com candidatos que já seguem as convenções locais: ${c.norms[0]}, e ${c.norms[1]}. ${c.proof} Crie em minutos um CV que as respeite, grátis e sem registo.`,
    (c) =>
      `A maior parte das ofertas em ${c.city} é publicada em ${c.boards}, onde cada vaga recebe dezenas de CV. ${c.proof} O nosso criador de CV gratuito ajuda-o a produzir um PDF claro e bem estruturado que passa esse primeiro filtro.`,
  ],

  categoryTips: {
    healthcare: [
      'Coloque a entidade de inscrição, o número de cédula e a validade no topo: é verificado antes de qualquer leitura.',
      'Detalhe serviços e estágios (UCI, bloco operatório, cuidados domiciliários) com número de camas ou doentes para tornar a senioridade evidente.',
      'Agrupe a formação obrigatória (SBV/SAV, mobilização de doentes, proteção de menores) num bloco próprio.',
      'Indique a disponibilidade de turnos e a data de início: as escalas são o que trava a maioria das candidaturas clínicas.',
    ],
    technology: [
      'Comece por uma linha de stack — linguagens, frameworks, cloud, ferramentas — para passar os filtros por palavras-chave à primeira.',
      'Descreva os sistemas pela escala: pedidos por segundo, volume de dados, utilizadores servidos, latência ou custo reduzidos.',
      'Ligue um repositório ou um projeto em produção: os responsáveis técnicos abrem-no mais vezes do que acabam de ler o resumo.',
      'Mostre o que foi seu — o que desenhou, o que falhou e o que mudou — em vez do roadmap da equipa.',
    ],
    education: [
      'Indique na primeira secção os ciclos, disciplinas e currículos que lecionou (currículo nacional, IB, ensino profissional).',
      'Quantifique resultados: evolução das notas, dimensão das turmas, taxas de aprovação — não uma lista de tarefas.',
      'Inclua formação em proteção de menores e o registo criminal: as escolas verificam-no cedo.',
      'Acrescente clubes, apoio ao estudo e direção de turma: pesam realmente nas pré-seleções docentes.',
    ],
    finance: [
      'Nomeie as normas e os sistemas que domina — IFRS, SNC, SAP, Oracle, NetSuite —, porque é sobre eles que os filtros são construídos.',
      'Dê grandezas: orçamentos geridos, valor de carteira, prazos de fecho mensal, âmbito de auditoria.',
      'Mostre o progresso da sua qualificação profissional, com a fase de exames e a data prevista de conclusão.',
      'Separe a componente técnica contabilística da análise e da relação com clientes, para que ambas se leiam em diagonal.',
    ],
    creative: [
      'Coloque o link do portefólio no cabeçalho: um CV criativo sem ele raramente tem segunda leitura.',
      'Descreva resultados e não entregáveis: alcance, conversão, retenção ou receita gerada pelo trabalho.',
      'Agrupe as ferramentas que domina mesmo (Figma, Adobe CC, CMS, analytics) num bloco legível.',
      'Escolha três a cinco trabalhos alinhados com a vaga e diga exatamente qual foi a sua parte em cada um.',
    ],
    business: [
      'Apresente cada função como um mandato: o que geria, com que orçamento ou equipa e com que resultado.',
      'Use métricas comparáveis: tempos de ciclo, pipeline, retenção, poupança obtida.',
      'Liste os métodos e ferramentas que usa mesmo (Agile, PRINCE2, Salesforce, Jira, SQL) em vez de uma lista de palavras da moda.',
      'Mostre o âmbito: equipas, regiões, quadros superiores e parceiros com quem trabalhou.',
    ],
    engineering: [
      'Coloque no topo a situação de inscrição na ordem e a sua especialidade: determinam o que pode assinar.',
      'Liste os projetos com valor, escala e o seu papel real: projeto, fiscalização, licenciamento.',
      'Cite as normas e o software com que trabalha (Eurocódigos, RGEU, AutoCAD, Revit, ETABS).',
      'Inclua certificações de segurança e qualidade em obra: os empreiteiros verificam-nas antes da entrevista.',
    ],
    trades: [
      'Comece pela licença: categoria, número e data de validade.',
      'Enumere os tipos de instalação em que trabalhou — habitação, serviços, indústria, fotovoltaico, alta tensão — com as tensões.',
      'Acrescente certificações de ensaio e segurança, além da carta de condução e se leva ferramenta própria.',
      'Inclua referências de diretores de obra: nos ofícios valem mais do que qualquer parágrafo de apresentação.',
    ],
  },

  genericTips: [
    'Reaproveite as palavras do anúncio para o título da função e as competências-chave: os filtros procuram correspondências exatas.',
    'Abra com um resumo de quatro linhas que diga a sua área, os anos de experiência e o resultado que entrega.',
    'Quantifique o que puder: os números sobrevivem à leitura rápida, os adjetivos não.',
    'Mantenha um CV por tipo de função: um CV genérico perde quase sempre para um CV dirigido.',
  ],

  localTip: (c) =>
    c.city
      ? `Siga as convenções de ${c.city}: ${c.norms[0]}, e ${c.norms[1]}.`
      : 'Adapte-se às convenções do país a que se candidata: extensão, fotografia e dados pessoais variam muito.',

  localTitle: (c) =>
    c.skill && c.city
      ? `O que os empregadores de ${c.city} esperam num CV de ${c.skill}`
      : c.city
        ? `O que os empregadores de ${c.city} esperam num CV`
        : `O que os empregadores esperam num CV de ${c.skill}`,

  localLines: (c) => {
    const lines: string[] = [c.proof];
    if (c.norms.length > 0) {
      lines.push(`Convenções locais do CV: ${list(c.norms)}.`);
    }
    if (c.sectors.length > 0 && c.anchors) {
      lines.push(
        `A procura concentra-se em ${list(c.sectors)} — em torno de ${c.anchors} —, por isso use esse vocabulário no resumo e nas competências.`,
      );
    }
    if (c.boards) {
      lines.push(
        `As vagas são anunciadas sobretudo em ${c.boards}: tenha um PDF adaptado pronto antes de se candidatar.`,
      );
    }
    return lines;
  },

  faqs: (c) => {
    const entries = [];

    entries.push({
      q:
        c.skill && c.city
          ? `O que deve incluir um CV de ${c.skill} para empregos em ${c.city}?`
          : c.skill
            ? `O que deve incluir um CV de ${c.skill}?`
            : `O que deve incluir um CV para empregos em ${c.city}?`,
      a: `${c.credential ? `Comece por ${c.credential} e siga com` : 'Comece por um resumo de quatro linhas e siga com'} a experiência escrita como resultados mensuráveis, a formação e um bloco de competências alinhado com o anúncio.${
        c.norms.length > 0 ? ` Convenções locais: ${list(c.norms)}.` : ''
      }`,
    });

    if (c.credential) {
      entries.push({
        q: `É preciso ${c.credential} para me candidatar${c.city ? ` em ${c.city}` : ''}?`,
        a: `É o que os empregadores locais pedem na maioria das funções de ${c.skill ?? 'este tipo'} e costuma ser verificado antes da contratação. Se o processo estiver a decorrer, diga-o: mencione-o com «em curso» e a data prevista; funciona muito melhor do que omitir.`,
      });
    } else {
      entries.push({
        q: `Que extensão deve ter um CV de ${c.skill ?? 'profissional'}${c.city ? ` em ${c.city}` : ''}?`,
        a: `${c.lengthNorm ? `${capitalize(c.lengthNorm)}.` : 'Uma a duas páginas.'} Acima disso o CV é folheado em vez de lido: reduza as funções antigas a uma linha cada.`,
      });
    }

    if (c.city && c.boards) {
      entries.push({
        q: `Onde são anunciadas as vagas${c.skill ? ` de ${c.skill}` : ''} em ${c.city}?`,
        a: `Sobretudo em ${c.boards}${c.anchors ? `, com os maiores empregadores em torno de ${c.anchors}` : ''}. Aí as candidaturas são primeiro filtradas automaticamente: mantenha o título da função e as competências com as palavras do anúncio.`,
      });
    } else {
      entries.push({
        q: `Este CV passa nos filtros ATS?`,
        a: `Os nossos modelos usam um layout de uma coluna, com texto real e cabeçalhos de secção padrão, que é o que os sistemas de recrutamento interpretam de forma mais fiável. Mantenha nos títulos e competências as palavras do anúncio.`,
      });
    }

    entries.push({
      q: `O CV Builder Pro é gratuito?`,
      a: `Sim — totalmente gratuito, sem registo e sem custos escondidos. Preencha os seus dados, escolha um modelo e descarregue o CV em PDF de imediato.`,
    });

    return entries;
  },
};
