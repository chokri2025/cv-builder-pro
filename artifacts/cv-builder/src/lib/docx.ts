import type { CVData } from '../types/cv';
import { createZip } from './zip';

/**
 * Word (.docx) export of the CV.
 *
 * Many applicant tracking systems parse .docx more reliably than PDF, and several
 * European employers ask for the Europass CV in Word specifically — so this is the
 * format to hand over when the CV has to survive a machine.
 *
 * It deliberately ignores the chosen visual template. The point of this file is to
 * be read by a parser, and reproducing a sidebar or a two-column hero would work
 * against that: what comes out is one column, standard heading styles, real text,
 * no tables and no text boxes, in the order a reader expects.
 */

export interface DocxLabels {
  profile: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  projects: string;
  present: string;
}

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const W_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

interface ParagraphOptions {
  style?: 'Title' | 'Heading1' | 'Heading2' | 'Normal';
  bold?: boolean;
  /** Right-to-left paragraph and run direction, for Arabic. */
  rtl?: boolean;
  spacingAfter?: number;
}

/**
 * One paragraph. `xml:space="preserve"` matters: without it Word collapses the
 * spaces around the separators between a job title and its employer.
 */
function paragraph(text: string, options: ParagraphOptions = {}): string {
  const { style = 'Normal', bold = false, rtl = false, spacingAfter } = options;

  const paraProps = [
    style !== 'Normal' ? `<w:pStyle w:val="${style}"/>` : '',
    rtl ? '<w:bidi/>' : '',
    spacingAfter !== undefined ? `<w:spacing w:after="${spacingAfter}"/>` : '',
  ].join('');

  const runProps = [bold ? '<w:b/>' : '', rtl ? '<w:rtl/>' : ''].join('');

  return (
    `<w:p>${paraProps ? `<w:pPr>${paraProps}</w:pPr>` : ''}` +
    `<w:r>${runProps ? `<w:rPr>${runProps}</w:rPr>` : ''}` +
    `<w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`
  );
}

/** Blank line, used to separate blocks the way a reader expects. */
function emptyParagraph(): string {
  return '<w:p/>';
}

/**
 * Named styles, so section titles are real headings rather than bold text.
 *
 * Parsers that look at document structure use these to find where a section
 * starts; those that only read text still get the words.
 */
function stylesXml(): string {
  const heading = (id: string, size: number, outline: number) =>
    `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${id}"/>` +
    `<w:basedOn w:val="Normal"/><w:qFormat/>` +
    `<w:pPr><w:outlineLvl w:val="${outline}"/><w:spacing w:before="240" w:after="120"/></w:pPr>` +
    `<w:rPr><w:b/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr></w:style>`;

  return (
    `${XML_HEADER}<w:styles xmlns:w="${W_NS}">` +
    `<w:docDefaults><w:rPrDefault><w:rPr>` +
    `<w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Arial"/>` +
    `<w:sz w:val="22"/><w:szCs w:val="22"/>` +
    `</w:rPr></w:rPrDefault></w:docDefaults>` +
    `<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>` +
    `<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:qFormat/>` +
    `<w:pPr><w:spacing w:after="60"/></w:pPr><w:rPr><w:b/><w:sz w:val="40"/><w:szCs w:val="40"/></w:rPr></w:style>` +
    heading('Heading1', 28, 0) +
    heading('Heading2', 24, 1) +
    `</w:styles>`
  );
}

/** A4 with 2 cm margins, in twentieths of a point. */
function sectionProperties(rtl: boolean): string {
  return (
    `<w:sectPr>${rtl ? '<w:bidi/>' : ''}` +
    `<w:pgSz w:w="11906" w:h="16838"/>` +
    `<w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/>` +
    `</w:sectPr>`
  );
}

function formatPeriod(start: string, end: string, current: boolean, presentLabel: string): string {
  if (!start) return '';
  return `${start} – ${current ? presentLabel : end || presentLabel}`;
}

/** Builds word/document.xml for the given CV. */
export function buildDocumentXml(data: CVData, labels: DocxLabels, rtl = false): string {
  const { personal, summary, experience, education, skills, languages, projects } = data;
  const body: string[] = [];

  const p = (text: string, options: ParagraphOptions = {}) =>
    body.push(paragraph(text, { ...options, rtl }));

  p(personal.fullName || 'CV', { style: 'Title' });
  if (personal.jobTitle) p(personal.jobTitle);

  // Contact details on one line: a parser reads them together, and it keeps the
  // top of the document compact.
  const contact = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.portfolio,
  ].filter(Boolean);
  if (contact.length > 0) p(contact.join(' | '));

  if (summary) {
    p(labels.profile, { style: 'Heading1' });
    p(summary);
  }

  if (experience.length > 0) {
    p(labels.experience, { style: 'Heading1' });
    for (const item of experience) {
      const heading = [item.jobTitle, item.company, item.location].filter(Boolean).join(' — ');
      p(heading, { style: 'Heading2' });
      const period = formatPeriod(item.startDate, item.endDate, item.current, labels.present);
      if (period) p(period);
      if (item.description) p(item.description);
    }
  }

  if (education.length > 0) {
    p(labels.education, { style: 'Heading1' });
    for (const item of education) {
      p([item.degree, item.school].filter(Boolean).join(' — '), { style: 'Heading2' });
      if (item.year) p(item.year);
      if (item.description) p(item.description);
    }
  }

  if (skills.length > 0) {
    p(labels.skills, { style: 'Heading1' });
    p(skills.map((s) => s.name).join(', '));
  }

  if (languages.length > 0) {
    p(labels.languages, { style: 'Heading1' });
    for (const lang of languages) {
      p([lang.language, lang.level].filter(Boolean).join(' — '));
    }
  }

  if (projects.length > 0) {
    p(labels.projects, { style: 'Heading1' });
    for (const project of projects) {
      p(project.name, { style: 'Heading2' });
      if (project.description) p(project.description);
      if (project.link) p(project.link);
    }
  }

  body.push(emptyParagraph());

  return (
    `${XML_HEADER}<w:document xmlns:w="${W_NS}"><w:body>` +
    body.join('') +
    sectionProperties(rtl) +
    `</w:body></w:document>`
  );
}

const CONTENT_TYPES =
  `${XML_HEADER}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
  `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
  `<Default Extension="xml" ContentType="application/xml"/>` +
  `<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>` +
  `<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>` +
  `</Types>`;

const ROOT_RELS =
  `${XML_HEADER}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
  `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>` +
  `</Relationships>`;

const DOCUMENT_RELS =
  `${XML_HEADER}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
  `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
  `</Relationships>`;

/** Packages the CV as a .docx archive. */
export function buildDocx(data: CVData, labels: DocxLabels, rtl = false): Uint8Array {
  const encoder = new TextEncoder();
  const part = (name: string, xml: string) => ({ name, data: encoder.encode(xml) });

  // [Content_Types].xml goes first: readers expect to find it without scanning.
  return createZip([
    part('[Content_Types].xml', CONTENT_TYPES),
    part('_rels/.rels', ROOT_RELS),
    part('word/document.xml', buildDocumentXml(data, labels, rtl)),
    part('word/_rels/document.xml.rels', DOCUMENT_RELS),
    part('word/styles.xml', stylesXml()),
  ]);
}

export const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

/** Builds the file and hands it to the browser as a download. */
export function downloadDocx(
  data: CVData,
  labels: DocxLabels,
  fileName: string,
  rtl = false,
): void {
  const blob = new Blob([buildDocx(data, labels, rtl) as BlobPart], { type: DOCX_MIME });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.docx`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}
