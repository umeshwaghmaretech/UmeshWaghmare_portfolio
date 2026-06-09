import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioDataService } from '../../../../core/services/portfolio-data.service';
import { UiSectionTitleComponent } from '../../../../shared/ui/section-title/ui-section-title.component';
import { UiCardComponent } from '../../../../shared/ui/card/ui-card.component';
import { UiBadgeComponent } from '../../../../shared/ui/badge/ui-badge.component';
import { UiSkeletonComponent } from '../../../../shared/ui/skeleton/ui-skeleton.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-certifications-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiSectionTitleComponent,
    UiCardComponent,
    UiBadgeComponent,
    UiSkeletonComponent,
    ScrollRevealDirective,
  ],
  template: `
    <section id="certifications" class="section" aria-labelledby="certifications-heading">
      <div class="section__inner">
        <ui-section-title
          eyebrow="Education"
          heading="Academic background"
          subtitle="Formal education and professional training."
          sectionId="certifications-heading"
        />

        @if (data.loading()) {
          <div class="certs__skeleton">
            @for (i of [1, 2, 3]; track i) {
              <ui-skeleton height="120px" />
            }
          </div>
        } @else {
          <div class="certs__grid" appScrollReveal>
            @for (cert of certifications(); track cert.id) {
              <ui-card variant="solid">
                <div class="cert__header">
                  <h3>{{ cert.name }}</h3>
                  <ui-badge variant="accent">{{ cert.date }}</ui-badge>
                </div>
                <p class="cert__issuer">{{ cert.issuer }}</p>
                @if (cert.credentialId) {
                  <p class="cert__id">ID: {{ cert.credentialId }}</p>
                }
                @if (cert.verificationUrl) {
                  <a [href]="cert.verificationUrl" target="_blank" rel="noopener" class="cert__link">
                    Verify credential →
                  </a>
                }
              </ui-card>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .certs__skeleton,
    .certs__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
      gap: var(--space-lg);
    }

    .cert__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-md);

      h3 {
        font-size: var(--text-base);
      }
    }

    .cert__issuer {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      margin-top: var(--space-sm);
    }

    .cert__id {
      font-size: var(--text-xs);
      color: var(--color-text-subtle);
      font-family: var(--font-mono);
    }

    .cert__link {
      display: inline-block;
      margin-top: var(--space-md);
      font-size: var(--text-sm);
      font-weight: 600;
    }
  `,
})
export class CertificationsSectionComponent {
  private readonly dataService = inject(PortfolioDataService);
  readonly data = this.dataService;
  readonly certifications = this.dataService.certifications;
}
