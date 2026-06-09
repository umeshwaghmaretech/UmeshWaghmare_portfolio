import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { PortfolioDataService } from '../../../../core/services/portfolio-data.service';
import { UiSectionTitleComponent } from '../../../../shared/ui/section-title/ui-section-title.component';
import { UiSkeletonComponent } from '../../../../shared/ui/skeleton/ui-skeleton.component';
import { CareerBarChartComponent } from '../../../../shared/charts/career-bar-chart/career-bar-chart.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-about-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage,
    UiSectionTitleComponent,
    UiSkeletonComponent,
    CareerBarChartComponent,
    ScrollRevealDirective,
  ],
  template: `
    <section id="about" class="section" aria-labelledby="about-heading">
      <div class="section__inner">
        <ui-section-title
          eyebrow="About Me"
          heading="Full Stack engineer building enterprise applications"
          subtitle="6+ years delivering scalable web solutions across finance, education, travel, and AI."
          sectionId="about-heading"
        />

        @if (data.loading()) {
          <ui-skeleton height="8rem" />
        } @else if (profile(); as p) {
          <div class="about__grid" appScrollReveal>
            <div class="about__story">
              @if (p.profileImageUrl) {
                <img
                  [ngSrc]="p.profileImageUrl"
                  [alt]="p.name"
                  width="120"
                  height="120"
                  class="about__photo"
                />
              }
              <p>{{ p.careerNarrative }}</p>
              <div class="about__timeline-labels">
                @for (m of p.timeline; track m.id) {
                  <div class="about__milestone">
                    <strong>{{ m.title }}</strong>
                    <span>{{ m.period }}</span>
                    <p>{{ m.description }}</p>
                  </div>
                }
              </div>
            </div>
            <div class="about__chart">
              <h3 class="visually-hidden">Career progression</h3>
              <app-career-bar-chart [items]="p.timeline" />
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .about__grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-2xl);
    }

    @media (min-width: 768px) {
      .about__grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .about__photo {
      width: 120px;
      height: 120px;
      object-fit: cover;
      border-radius: var(--radius-full);
      border: 2px solid var(--color-border);
      box-shadow: var(--shadow-card);
      margin-bottom: var(--space-lg);
    }

    .about__story p {
      font-size: var(--text-lg);
      color: var(--color-text-muted);
      line-height: 1.7;
    }

    .about__timeline-labels {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
      margin-top: var(--space-xl);
    }

    .about__milestone {
      padding-left: var(--space-md);
      border-left: 3px solid var(--color-accent);

      strong {
        display: block;
        font-size: var(--text-base);
      }

      span {
        font-size: var(--text-sm);
        color: var(--color-accent);
        font-weight: 600;
      }

      p {
        font-size: var(--text-sm);
        color: var(--color-text-muted);
        margin-top: var(--space-xs);
      }
    }

    .about__chart {
      container-type: inline-size;
      padding: var(--space-lg);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
    }

    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      border: 0;
    }
  `,
})
export class AboutSectionComponent {
  private readonly dataService = inject(PortfolioDataService);
  readonly data = this.dataService;
  readonly profile = this.dataService.profile;
}
