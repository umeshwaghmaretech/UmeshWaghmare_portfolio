import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ResumePdfExportService } from './resume-pdf-export.service';

@Injectable({ providedIn: 'root' })
export class PdfExportFacadeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly resumeExport = inject(ResumePdfExportService);

  readonly exporting = signal(false);
  readonly exportError = signal<string | null>(null);

  private inFlight = false;
  private errorTimer: ReturnType<typeof setTimeout> | null = null;

  async downloadPdf(): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || this.inFlight) return;

    this.inFlight = true;
    this.exporting.set(true);
    this.clearError();

    try {
      await this.resumeExport.export();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'PDF export failed. Please try again.';
      console.error('[PdfExport]', err);
      this.setError(message);
      alert(message);
    } finally {
      this.inFlight = false;
      this.exporting.set(false);
    }
  }

  private setError(message: string): void {
    this.exportError.set(message);
    if (this.errorTimer) clearTimeout(this.errorTimer);
    this.errorTimer = setTimeout(() => this.clearError(), 4000);
  }

  private clearError(): void {
    this.exportError.set(null);
    if (this.errorTimer) {
      clearTimeout(this.errorTimer);
      this.errorTimer = null;
    }
  }
}
