import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';
import { BusinessCardService } from '../business-card.service';
import { PdfCaptureService } from './pdf-capture.service';
import { hidePdfChrome, showPdfChrome } from './pdf-chrome.util';
import { ThemeMode } from '../../models/portfolio.models';

const DEFER_SECTION_IDS = [
  'hero',
  'about',
  'skills',
  'experience',
  'projects',
  'github',
  'work-with-me',
  'certifications',
  'contact',
];

const THEME_FILENAME_LABELS: Record<ThemeMode, string> = {
  professional: 'Professional',
  'modern-ai': 'Modern-AI',
  compact: 'Compact',
};

@Injectable({ providedIn: 'root' })
export class PortfolioPdfExportService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly theme = inject(ThemeService);
  private readonly businessCard = inject(BusinessCardService);
  private readonly capture = inject(PdfCaptureService);

  async export(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    this.businessCard.close();

    if (!this.isHomePage()) {
      await this.router.navigate(['/']);
      await this.capture.wait(300);
    }

    await this.preparePage();

    const target = document.getElementById('portfolio-export-root');
    if (!target) {
      throw new Error('Portfolio export target not found');
    }

    hidePdfChrome();

    try {
      await this.capture.captureElementToPdf(target, this.getFilename());
    } finally {
      showPdfChrome();
    }
  }

  private isHomePage(): boolean {
    const path = this.router.url.split('?')[0].split('#')[0];
    return path === '/' || path === '';
  }

  private getFilename(): string {
    const label = THEME_FILENAME_LABELS[this.theme.theme()];
    return `Umesh-Waghmare-Portfolio-${label}.pdf`;
  }

  private async preparePage(): Promise<void> {
    window.scrollTo(0, 0);

    for (const id of DEFER_SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: 'start' });
        await this.capture.wait(150);
      }
    }

    document.querySelectorAll('.defer-placeholder').forEach((el) => {
      el.scrollIntoView({ block: 'center' });
    });
    await this.capture.wait(200);

    window.scrollTo(0, 0);
    await this.capture.wait(300);
  }
}
