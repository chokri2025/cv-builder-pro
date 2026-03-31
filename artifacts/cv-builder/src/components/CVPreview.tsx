import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CVData, TemplateType } from '../types/cv';
import MinimalTemplate from './templates/MinimalTemplate';
import ModernTemplate from './templates/ModernTemplate';
import CreativeTemplate from './templates/CreativeTemplate';

interface Props {
  data: CVData;
  template: TemplateType;
}

export default function CVPreview({ data, template }: Props) {
  const previewRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const handleDownloadPDF = async () => {
    const element = previewRef.current;
    if (!element) return;

    const htmlToPdf = (await import('html2pdf.js')).default;
    const opt = {
      margin: 0,
      filename: `${data.personal.fullName || 'cv'}-resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
    htmlToPdf().set(opt).from(element).save();
  };

  const handlePrint = () => {
    const element = previewRef.current;
    if (!element) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const allStyles = Array.from(document.styleSheets)
      .map(sheet => {
        try {
          return Array.from(sheet.cssRules).map(r => r.cssText).join('\n');
        } catch { return ''; }
      })
      .join('\n');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>CV - ${data.personal.fullName || 'Resume'}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          * { box-sizing: border-box; }
          body { margin: 0; padding: 0; background: #fff; }
          @page { size: A4; margin: 0; }
          ${allStyles}
        </style>
      </head>
      <body>${element.outerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 800);
  };

  const renderTemplate = () => {
    switch (template) {
      case 'modern': return <ModernTemplate data={data} />;
      case 'creative': return <CreativeTemplate data={data} />;
      default: return <MinimalTemplate data={data} />;
    }
  };

  return (
    <div className="preview-panel">
      <div className="preview-toolbar">
        <span className="preview-label">{t('preview.livePreview')}</span>
        <div className="preview-actions">
          <button className="print-btn" onClick={handlePrint}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {t('preview.print')}
          </button>
          <button className="pdf-btn" onClick={handleDownloadPDF}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {t('preview.downloadPdf')}
          </button>
        </div>
      </div>
      <div className="preview-scroll-area">
        <div className="cv-page-wrapper">
          <div className="cv-page" ref={previewRef} id="cv-preview-content">
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
}
