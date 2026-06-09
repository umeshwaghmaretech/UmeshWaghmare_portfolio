import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioDataService } from '../../../../core/services/portfolio-data.service';
import { UiSectionTitleComponent } from '../../../../shared/ui/section-title/ui-section-title.component';
import { UiCardComponent } from '../../../../shared/ui/card/ui-card.component';
import { UiChipComponent } from '../../../../shared/ui/chip/ui-chip.component';
import { UiSkeletonComponent } from '../../../../shared/ui/skeleton/ui-skeleton.component';
import { SkillRadarChartComponent } from '../../../../shared/charts/skill-radar-chart/skill-radar-chart.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-skills-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiSectionTitleComponent,
    UiCardComponent,
    UiChipComponent,
    UiSkeletonComponent,
    SkillRadarChartComponent,
    ScrollRevealDirective,
  ],
  template: `
    <section id="skills" class="section" aria-labelledby="skills-heading">
      <div class="section__inner">
        <ui-section-title
          eyebrow="Skills"
          heading="Technical expertise across the full stack"
          subtitle="Frontend, backend, cloud, and architecture skills honed over 6+ years."
          sectionId="skills-heading"
        />

        @if (data.loading()) {
          <div class="skills__skeleton">
            @for (i of [1, 2, 3]; track i) {
              <ui-skeleton height="200px" />
            }
          </div>
        } @else {
          <div class="skills__layout" appScrollReveal>
            <div class="skills__bento">
              @for (cat of categories(); track cat.id) {
                <ui-card variant="glass" class="skills__card">
                  <h3>{{ cat.name }}</h3>
                  <div class="skills__bars">
                    @for (skill of cat.skills; track skill.id) {
                      <div class="skill-bar">
                        <div class="skill-bar__header">
                          <span>{{ skill.name }}</span>
                          <span>{{ skill.level }}%</span>
                        </div>
                        <div class="skill-bar__track">
                          <div
                            class="skill-bar__fill"
                            [style.--level]="skill.level + '%'"
                          ></div>
                        </div>
                      </div>
                    }
                  </div>
                  <div class="skills__chips">
                    @for (skill of cat.skills; track skill.id) {
                      <ui-chip [accent]="skill.level >= 85">{{ skill.name }}</ui-chip>
                    }
                  </div>
                </ui-card>
              }
            </div>
            <div class="skills__radar">
              <app-skill-radar-chart [categories]="categories()" />
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .skills__skeleton {
      display: grid;
      gap: var(--space-lg);
    }

    .skills__layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-2xl);
    }

    @media (min-width: 1024px) {
      .skills__layout {
        grid-template-columns: 2fr 1fr;
        align-items: start;
      }
    }

    .skills__bento {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
      gap: var(--space-lg);
    }

    .skills__card {
      container-type: inline-size;

      h3 {
        font-size: var(--text-lg);
        margin-bottom: var(--space-md);
      }
    }

    .skills__bars {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .skill-bar__header {
      display: flex;
      justify-content: space-between;
      font-size: var(--text-sm);
      margin-bottom: var(--space-xs);

      span:last-child {
        color: var(--color-accent);
        font-weight: 600;
      }
    }

    .skill-bar__track {
      height: 6px;
      background: var(--color-bg-muted);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    @property --level {
      syntax: '<percentage>';
      inherits: false;
      initial-value: 0%;
    }

    .skill-bar__fill {
      height: 100%;
      width: var(--level);
      background: var(--gradient-accent);
      border-radius: var(--radius-full);
      transition: width 1s ease;
    }

    .skills__chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-xs);
      margin-top: var(--space-md);
    }

    .skills__radar {
      display: flex;
      justify-content: center;
      padding: var(--space-lg);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
    }
  `,
})
export class SkillsSectionComponent {
  private readonly dataService = inject(PortfolioDataService);
  readonly data = this.dataService;
  readonly categories = this.dataService.skillCategories;
}
