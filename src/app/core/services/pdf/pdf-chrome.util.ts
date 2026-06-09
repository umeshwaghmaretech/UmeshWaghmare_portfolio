export const PDF_CHROME_SELECTORS = [
  'app-header',
  'app-floating-action-button',
  'app-command-palette',
  'app-ai-assistant-panel',
  'app-mobile-nav-drawer',
  'app-business-card',
  '.skip-link',
  '.resume-page__header',
];

export function hidePdfChrome(): void {
  PDF_CHROME_SELECTORS.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add('pdf-export-hidden');
    });
  });
  document.body.classList.add('pdf-export-mode');
}

export function showPdfChrome(): void {
  document.querySelectorAll('.pdf-export-hidden').forEach((el) => {
    el.classList.remove('pdf-export-hidden');
  });
  document.body.classList.remove('pdf-export-mode');
}
