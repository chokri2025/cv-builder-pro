import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { printElement } from '../lib/print-pdf';
import { CVData, TemplateType } from '../types/cv';
import MinimalTemplate from './templates/MinimalTemplate';
import ModernTemplate from './templates/ModernTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import EuropassTemplate from './templates/EuropassTemplate';

interface Props {
  data: CVData;
  template: TemplateType;
}

export default function CVPreview({ data, template }: Props) {
  const previewRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const [exporting, setExporting] = useState(false);

  /**
   * Both actions run the same path: the browser's print pipeline, which emits
   * real vector text with embedded fonts. The previous html2canvas export
   * produced a JPEG of the CV — nothing an applicant tracking system can read.
   */
  const handleExport = async () => {
    const element = previewRef.current;
    if (!element || exporting) return;

    setExporting(true);
    try {
      await printElement(element, data.personal.fullName);
    } finally {
      setExporting(false);
    }
  };

  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
      case 'europass':
        return <EuropassTemplate data={data} />;
      default:
        return <MinimalTemplate data={data} />;
    }
  };

  return (
    <div className="preview-panel">
      <div className="preview-toolbar">
        <span className="preview-label">{t('preview.livePreview')}</span>
        <div className="preview-actions">
          <button className="print-btn" onClick={handleExport} disabled={exporting}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t('preview.print')}
          </button>
          <button className="pdf-btn" onClick={handleExport} disabled={exporting}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t('preview.downloadPdf')}
          </button>
          <span className="preview-hint">{t('preview.pdfHint')}</span>
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
