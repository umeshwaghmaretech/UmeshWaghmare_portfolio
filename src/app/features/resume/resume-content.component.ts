import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { UiTimelineComponent } from '../../shared/ui/timeline/ui-timeline.component';
import { UiSkeletonComponent } from '../../shared/ui/skeleton/ui-skeleton.component';
import { LinkedinIconComponent } from '../../shared/social/linkedin-icon.component';

@Component({
  selector: 'app-resume-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, UiTimelineComponent, UiSkeletonComponent, LinkedinIconComponent],
  template: `
    @if (data.loading()) {
      <ui-skeleton height="600px" />
    } @else if (profile(); as p) {
      <article class="resume-content">
        <header class="resume-content__profile">
          <div class="resume-content__profile-row">
            @if (p.profileImageUrl) {
              <img
                [ngSrc]="p.profileImageUrl"
                [alt]="p.name"
                width="100"
                height="80"
                class="resume-content__photo"
              />
            }
            <div>
              <h1>{{ p.name }}</h1>
              <p class="resume-content__title">{{ p.title }}</p>
            </div>
          </div>
          <div class="resume-content__contact">
            <span>{{ p.email }}</span>
            @if (p.phone) {
              <a [href]="'tel:' + p.phone.replace(/\s/g, '')">{{ p.phone }}</a>
            }
            @if (p.location) {
              <span>{{ p.location }}</span>
            }
            <a [href]="p.linkedIn" target="_blank" rel="noopener" class="resume-content__social">
              <linkedin-icon [size]="14" />
              LinkedIn
            </a>
            @if (p.github) {
              <a [href]="p.github" target="_blank" rel="noopener">GitHub</a>
            }
          </div>
        </header>

        <section>
          <h2>Summary</h2>
          <p>{{ p.summary }}</p>
        </section>

        <section>
          <h2>Career Narrative</h2>
          <p>{{ p.careerNarrative }}</p>
        </section>

        <section>
          <h2>Experience</h2>
          <ui-timeline [items]="experiences()" />
        </section>

        <section>
          <h2>Skills</h2>
          @for (cat of skillCategories(); track cat.id) {
            <div class="resume-content__skill-cat">
              <h3>{{ cat.name }}</h3>
              <p>
                @for (s of cat.skills; track s.id; let last = $last) {
                  {{ s.name }}@if (!last) { · }
                }
              </p>
            </div>
          }
        </section>
      </article>
    }
  `,
  styles: `
    .resume-content__profile-row {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      margin-bottom: var(--space-md);
    }

    .resume-content__photo {
      width: 100px;
      height: 80px;
      object-fit: cover;
      border-radius: var(--radius-full);
      border: 2px solid var(--color-border);
      flex-shrink: 0;
    }

    .resume-content__profile {
      border-bottom: 2px solid var(--color-border);
      padding-bottom: var(--space-xl);
      margin-bottom: var(--space-xl);

      h1 {
        font-size: var(--text-3xl);
      }
    }

    .resume-content__title {
      font-size: var(--text-xl);
      color: var(--color-accent);
      font-weight: 600;
    }

    .resume-content__contact {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-md);
      margin-top: var(--space-md);
      font-size: var(--text-sm);
      color: var(--color-text-muted);
    }

    .resume-content__social {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
    }

    section {
      margin-bottom: var(--space-2xl);

      h2 {
        font-size: var(--text-xl);
        margin-bottom: var(--space-md);
        color: var(--color-accent);
      }

      p {
        color: var(--color-text-muted);
        line-height: 1.7;
      }
    }

    .resume-content__skill-cat {
      margin-bottom: var(--space-md);

      h3 {
        font-size: var(--text-base);
        margin-bottom: var(--space-xs);
      }

      p {
        font-size: var(--text-sm);
      }
    }
  `,
})
export class ResumeContentComponent {
  private readonly dataService = inject(PortfolioDataService);
  readonly data = this.dataService;
  readonly profile = this.dataService.profile;
  readonly experiences = this.dataService.experiences;
  readonly skillCategories = this.dataService.skillCategories;
}
