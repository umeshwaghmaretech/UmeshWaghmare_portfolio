import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PdfExportFacadeService } from '../../../../core/services/pdf/pdf-export.facade';
import { UiSectionTitleComponent } from '../../../../shared/ui/section-title/ui-section-title.component';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { UiCardComponent } from '../../../../shared/ui/card/ui-card.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { ResumeContentComponent } from '../../../resume/resume-content.component';

@Component({
  selector: 'app-resume-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiSectionTitleComponent,
    UiButtonComponent,
    UiCardComponent,
    ScrollRevealDirective,
    ResumeContentComponent,
  ],
  template: `
    <section id="resume" class="section" aria-labelledby="resume-heading">
      <div class="section__inner">
        <ui-section-title
          eyebrow="Resume"
          heading="Professional credentials"
          subtitle="Preview, download, or view the full resume online."
          sectionId="resume-heading"
        />

        <div class="resume__grid" appScrollReveal>
          <ui-card variant="elevated" class="resume__preview">
            <app-resume-content />
          </ui-card>
          <div class="resume__actions">
            <ui-button (clicked)="viewOnline()">View Online</ui-button>
            <ui-button
              variant="outline"
              [loading]="pdfExport.exporting()"
              (clicked)="downloadPdf()"
            >
              Download PDF
            </ui-button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
      background: var(--color-bg-subtle);
    }

    .resume__grid {
      display: grid;
      gap: var(--space-xl);
    }

    @media (min-width: 768px) {
      .resume__grid {
        grid-template-columns: 2fr 1fr;
        align-items: start;
      }
    }

    .resume__preview {
      container-type: inline-size;
      overflow: hidden;
    }

    .resume__actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
  `,
})
export class ResumeSectionComponent {
  private readonly router = inject(Router);
  readonly pdfExport = inject(PdfExportFacadeService);

  viewOnline(): void {
    void this.router.navigate(['/resume']);
  }

  downloadPdf(): void {
    void this.pdfExport.downloadPdf();
  }
}
