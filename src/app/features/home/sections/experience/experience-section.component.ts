import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioDataService } from '../../../../core/services/portfolio-data.service';
import { UiSectionTitleComponent } from '../../../../shared/ui/section-title/ui-section-title.component';
import { UiTimelineComponent } from '../../../../shared/ui/timeline/ui-timeline.component';
import { UiSkeletonComponent } from '../../../../shared/ui/skeleton/ui-skeleton.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-experience-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiSectionTitleComponent,
    UiTimelineComponent,
    UiSkeletonComponent,
    ScrollRevealDirective,
  ],
  template: `
    <section id="experience" class="section" aria-labelledby="experience-heading">
      <div class="section__inner">
        <ui-section-title
          eyebrow="Experience"
          heading="Professional journey"
          subtitle="From retail leadership to business analysis and product growth."
          sectionId="experience-heading"
        />

        @if (data.loading()) {
          <ui-skeleton height="400px" />
        } @else {
          <div appScrollReveal>
            <ui-timeline [items]="experiences()" />
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
      background: var(--color-bg-subtle);
    }
  `,
})
export class ExperienceSectionComponent {
  private readonly dataService = inject(PortfolioDataService);
  readonly data = this.dataService;
  readonly experiences = this.dataService.experiences;
}
