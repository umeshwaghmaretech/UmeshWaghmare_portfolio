import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { PdfExportFacadeService } from '../../core/services/pdf/pdf-export.facade';
import { UiButtonComponent } from '../../shared/ui/button/ui-button.component';
import { ResumeContentComponent } from './resume-content.component';

@Component({
  selector: 'app-resume-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiButtonComponent, ResumeContentComponent],
  template: `
    <div class="resume-page">
      <header class="resume-page__header">
        <ui-button variant="ghost" (clicked)="goHome()">← Back to Portfolio</ui-button>
        <ui-button
          variant="outline"
          [loading]="pdfExport.exporting()"
          (clicked)="downloadPdf()"
        >
          Download PDF
        </ui-button>
      </header>

      <div class="resume-page__content">
        <app-resume-content />
      </div>
    </div>
  `,
  styles: `
    .resume-page {
      max-width: var(--container-max);
      margin-inline: auto;
      padding: var(--space-2xl) var(--space-lg);
    }

    .resume-page__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-2xl);
    }
  `,
})
export class ResumePage {
  private readonly router = inject(Router);
  readonly pdfExport = inject(PdfExportFacadeService);

  downloadPdf(): void {
    void this.pdfExport.downloadPdf();
  }

  goHome(): void {
    void this.router.navigate(['/']);
  }
}
