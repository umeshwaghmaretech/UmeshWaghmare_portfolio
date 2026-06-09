import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';
import { PortfolioDataService } from '../portfolio-data.service';
import { BusinessCardService } from '../business-card.service';
import { PdfCaptureService } from './pdf-capture.service';
import { hidePdfChrome, showPdfChrome } from './pdf-chrome.util';
import { ThemeMode } from '../../models/portfolio.models';

const THEME_FILENAME_LABELS: Record<ThemeMode, string> = {
  professional: 'Professional',
  'modern-ai': 'Modern-AI',
  compact: 'Compact',
};

@Injectable({ providedIn: 'root' })
export class ResumePdfExportService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly theme = inject(ThemeService);
  private readonly data = inject(PortfolioDataService);
  private readonly businessCard = inject(BusinessCardService);
  private readonly capture = inject(PdfCaptureService);

  async export(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    this.businessCard.close();

    if (!this.isResumePage()) {
      await this.router.navigate(['/resume']);
      await this.capture.wait(300);
    }

    await this.waitForResumeContent();

    const target = document.querySelector('.resume-page__content');
    if (!target || !(target instanceof HTMLElement)) {
      throw new Error('Resume content not found');
    }

    window.scrollTo(0, 0);
    await this.capture.wait(200);

    hidePdfChrome();

    try {
      await this.capture.captureElementToPdf(target, this.getFilename());
    } finally {
      showPdfChrome();
    }
  }

  private isResumePage(): boolean {
    return this.router.url.split('?')[0].split('#')[0] === '/resume';
  }

  private getFilename(): string {
    const label = THEME_FILENAME_LABELS[this.theme.theme()];
    return `Umesh-Waghmare-Resume-${label}.pdf`;
  }

  private async waitForResumeContent(): Promise<void> {
    const maxAttempts = 30;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const content = document.querySelector('article.resume-content');
      const skeleton = document.querySelector('.resume-page__content ui-skeleton');
      const loading = this.data.loading();

      if (content && !skeleton && !loading) {
        await this.capture.waitForImages(content as HTMLElement);
        return;
      }

      await this.capture.wait(100);
    }

    throw new Error('Resume content did not load in time');
  }
}
