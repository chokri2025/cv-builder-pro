# CV Builder Pro

A full-featured CV/Resume Builder web application built with React + Vite in a pnpm monorepo.

## Project Structure

```
artifacts/
  cv-builder/         - Main React + Vite SPA (previewPath: /)
  api-server/         - Express API server (not used by CV builder, placeholder)
  mockup-sandbox/     - Vite component preview server for canvas mockups
```

## CV Builder Features

- **All CV sections**: Personal info (with photo upload), Professional Summary, Work Experience, Education, Skills (tag input), Languages, Projects
- **Live preview**: Edits reflect instantly in the CV preview panel
- **3 Templates**:
  - **Minimal**: Clean horizontal layout, border-bottom dividers
  - **Modern**: Dark sidebar with main content area (two-column)
  - **Creative**: Gradient header with two-column body
- **PDF Download**: Uses html2pdf.js with A4 format
- **Print**: Opens print window with full CV styles inlined
- **Auto-save**: localStorage persistence (`cv-builder-data`, `cv-builder-template` keys)
- **Save button**: Manual save with `✓ Saved` confirmation feedback

## Design System

- **Builder UI**: Dark mechanical blue (#0b1d2e, #0f2540, #06111e) + sky blue accents (#38bdf8, #0ea5e9)
- **CV Output**: White/light professional backgrounds, suitable for printing
- **Fonts**: Inter (body), Merriweather (available for serif templates)

## Key Files

```
artifacts/cv-builder/src/
  App.tsx                           - Root component
  main.tsx                          - Entry point
  index.css                         - Global styles + all template CSS classes
  types/cv.ts                       - TypeScript types (CVData, TemplateType, etc.)
  hooks/useCV.ts                    - CV state + localStorage persistence hook
  pages/CVBuilderPage.tsx           - Main layout (form left, preview right)
  components/
    FormPanel.tsx                   - Left panel: all form sections
    CVPreview.tsx                   - Right panel: template switcher + PDF/print
    templates/
      MinimalTemplate.tsx           - Minimal clean template
      ModernTemplate.tsx            - Modern sidebar template
      CreativeTemplate.tsx          - Creative gradient template
```

## Dependencies

- `react`, `react-dom`, `typescript`, `vite`
- `html2pdf.js` - PDF generation from HTML
- No backend required — purely client-side with localStorage

## Ports

- CV Builder: 22723 (dev), served at path `/`
- API Server: 8080
- Mockup Sandbox: 8081
