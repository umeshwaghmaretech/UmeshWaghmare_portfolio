import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  buildResolvedThemeCss,
  inlineAllComputedStyles,
  suspendGlobalStylesheets,
} from './pdf-clone-sanitize.util';

type Html2CanvasFn = (
  element: HTMLElement,
  options?: Record<string, unknown>,
) => Promise<HTMLCanvasElement>;

@Injectable({ providedIn: 'root' })
export class PdfCaptureService {
  private readonly platformId = inject(PLATFORM_ID);

  async captureElementToPdf(target: HTMLElement, filename: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    await this.waitForImages(target);

    const html2canvas = await this.loadHtml2Canvas();
    const { jsPDF } = await import('jspdf');

    const restoreStylesheets = suspendGlobalStylesheets();

    try {
      const canvas = await this.captureInIsolatedFrame(target, html2canvas);
      this.saveCanvasAsPdf(canvas, jsPDF, filename);
    } finally {
      restoreStylesheets();
    }
  }

  private async loadHtml2Canvas(): Promise<Html2CanvasFn> {
    const mod = await import('html2canvas-pro');
    return mod.default as Html2CanvasFn;
  }

  private async captureInIsolatedFrame(
    target: HTMLElement,
    html2canvas: Html2CanvasFn,
  ): Promise<HTMLCanvasElement> {
    const theme = document.documentElement.getAttribute('data-theme') ?? 'professional';
    const bgColor =
      getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim() ||
      '#ffffff';

    const iframe = document.createElement('iframe');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.cssText = [
      'position:fixed',
      'left:-10000px',
      'top:0',
      'border:0',
      'visibility:hidden',
      `width:${target.scrollWidth}px`,
      `height:${target.scrollHeight}px`,
    ].join(';');

    document.body.appendChild(iframe);

    try {
      const iframeDoc = iframe.contentDocument;
      if (!iframeDoc) {
        throw new Error('Could not create PDF capture frame');
      }

      const html = iframeDoc.createElement('html');
      const head = iframeDoc.createElement('head');
      const body = iframeDoc.createElement('body');
      html.appendChild(head);
      html.appendChild(body);
      iframeDoc.replaceChild(html, iframeDoc.documentElement);

      iframeDoc.documentElement.setAttribute('data-theme', theme);

      const style = iframeDoc.createElement('style');
      style.textContent = buildResolvedThemeCss(theme);
      iframeDoc.head.appendChild(style);

      const clone = iframeDoc.importNode(target, true) as HTMLElement;
      iframeDoc.body.appendChild(clone);
      inlineAllComputedStyles(target, clone);
      await this.waitForImages(clone);

      return await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: bgColor,
        logging: false,
        width: target.scrollWidth,
        height: target.scrollHeight,
        windowWidth: target.scrollWidth,
        windowHeight: target.scrollHeight,
      });
    } finally {
      iframe.remove();
    }
  }

  private saveCanvasAsPdf(
    canvas: HTMLCanvasElement,
    jsPDF: typeof import('jspdf').jsPDF,
    filename: string,
  ): void {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = pageHeight - margin * 2;

    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/jpeg', 0.92);

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
    heightLeft -= contentHeight;

    while (heightLeft > 0) {
      position = margin - (imgHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
      heightLeft -= contentHeight;
    }

    pdf.save(filename);
  }

  async waitForImages(element: HTMLElement): Promise<void> {
    const images = Array.from(element.querySelectorAll('img'));
    await Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) {
              resolve();
              return;
            }
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }),
      ),
    );
  }

  wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
