/**
 * PDF export for the CV.
 *
 * The previous export ran the preview through html2canvas and embedded the result
 * as a JPEG, so the downloaded file was a *picture* of a CV: zero text operators,
 * no embedded fonts, nothing for an applicant tracking system to parse. Measured
 * on a real export — 0 text blocks, 2 JPEG images — an ATS reading it sees an
 * empty document, which makes the site's ATS-friendly promise false.
 *
 * The browser's own print pipeline produces the opposite: real vector text with
 * embedded subset fonts and ToUnicode tables (the part that lets a parser map
 * glyphs back to characters). So the export routes through print instead, and the
 * heavy html2canvas/jsPDF dependency is gone.
 *
 * The page is printed from a hidden same-origin iframe rather than a popup —
 * `window.open` is blocked by default in many browsers, which silently broke the
 * old print button.
 */

/** How long to wait for fonts/layout before printing, and before cleaning up. */
const FONT_TIMEOUT_MS = 3000;
const CLEANUP_DELAY_MS = 1000;

/** Collects the app's own stylesheets so the printed document looks identical. */
function collectStyles(): string {
  return Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join('\n');
      } catch {
        // Cross-origin sheet (Google Fonts): unreadable here, re-linked below.
        return '';
      }
    })
    .join('\n');
}

/** Font stylesheets we cannot inline because they are cross-origin. */
function collectFontLinks(): string {
  return Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))
    .filter((link) => link.href.includes('fonts.googleapis.com'))
    .map((link) => `<link rel="stylesheet" href="${link.href}">`)
    .join('\n');
}

/**
 * Builds the standalone print document.
 *
 * `title` becomes the PDF's default filename in the browser's save dialog, so a
 * download lands as "Amina-Benali-CV.pdf" rather than "document.pdf".
 */
export function buildPrintDocument(cvHtml: string, title: string, styles: string, fontLinks = '') {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  ${fontLinks}
  <style>
    ${styles}

    /* These come last on purpose: the app stylesheet above styles the CV for a
       panel inside the builder UI (scaled down, on a coloured backdrop), and its
       rules would otherwise win over the print reset and paint the page. */
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: #fff !important;
      width: 210mm;
    }
    @page { size: A4; margin: 0; }
    .cv-page {
      box-shadow: none !important;
      transform: none !important;
      margin: 0 !important;
      width: 210mm !important;
      min-height: auto !important;
      background: #fff;
    }
  </style>
</head>
<body>${cvHtml}</body>
</html>`;
}

/** Filename stem for the exported CV, safe for every filesystem. */
export function buildFileName(fullName: string): string {
  const cleaned = fullName
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
  return cleaned ? `${cleaned}-CV` : 'CV';
}

/**
 * Prints the given element through a hidden iframe.
 *
 * Resolves once the print dialog has been dismissed (or immediately, in browsers
 * that do not block on `print()`), after which the iframe is removed.
 */
export async function printElement(element: HTMLElement, fullName: string): Promise<void> {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  const win = iframe.contentWindow;
  if (!doc || !win) {
    iframe.remove();
    throw new Error('Could not open a print document');
  }

  doc.open();
  doc.write(
    buildPrintDocument(
      element.outerHTML,
      buildFileName(fullName),
      collectStyles(),
      collectFontLinks(),
    ),
  );
  doc.close();

  // Printing before webfonts resolve falls back to system fonts and shifts the
  // layout, so wait for them — but never hang if the font request stalls.
  await Promise.race([
    doc.fonts?.ready ?? Promise.resolve(),
    new Promise((resolve) => setTimeout(resolve, FONT_TIMEOUT_MS)),
  ]);

  win.focus();
  win.print();

  // Safari resolves print() immediately while the dialog is still open, so the
  // iframe is torn down on a delay rather than synchronously.
  setTimeout(() => iframe.remove(), CLEANUP_DELAY_MS);
}
