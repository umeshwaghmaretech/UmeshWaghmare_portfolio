import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { UiButtonComponent } from '../../shared/ui/button/ui-button.component';
import { UiChipComponent } from '../../shared/ui/chip/ui-chip.component';
import { UiCardComponent } from '../../shared/ui/card/ui-card.component';

@Component({
  selector: 'app-project-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage,
    UiButtonComponent,
    UiChipComponent,
    UiCardComponent,
  ],
  template: `
    <div class="project-detail">
      <header class="project-detail__header">
        <ui-button variant="ghost" (clicked)="goHome()">← Back</ui-button>
      </header>

      @if (project(); as p) {
        <article>
          <img [ngSrc]="p.image" [alt]="p.title" width="800" height="400" class="project-detail__hero" />
          <h1>{{ p.title }}</h1>
          <p class="project-detail__subtitle">{{ p.subtitle }}</p>
          <p class="project-detail__desc">{{ p.description }}</p>

          <div class="project-detail__stack">
            @for (tech of p.techStack; track tech) {
              <ui-chip [accent]="true">{{ tech }}</ui-chip>
            }
          </div>

          <div class="project-detail__grid">
            <ui-card variant="solid">
              <h2>Features</h2>
              <ul>
                @for (f of p.features; track f) {
                  <li>{{ f }}</li>
                }
              </ul>
            </ui-card>
            <ui-card variant="solid">
              <h2>Challenges</h2>
              <ul>
                @for (c of p.challenges; track c) {
                  <li>{{ c }}</li>
                }
              </ul>
            </ui-card>
            <ui-card variant="solid">
              <h2>Learnings</h2>
              <ul>
                @for (l of p.learnings; track l) {
                  <li>{{ l }}</li>
                }
              </ul>
            </ui-card>
          </div>
        </article>
      } @else {
        <div class="project-detail__not-found">
          <h1>Project not found</h1>
          <ui-button (clicked)="goHome()">Return home</ui-button>
        </div>
      }
    </div>
  `,
  styles: `
    .project-detail {
      max-width: var(--container-max);
      margin-inline: auto;
      padding: var(--space-2xl) var(--space-lg);
    }

    .project-detail__header {
      margin-bottom: var(--space-xl);
    }

    .project-detail__hero {
      width: 100%;
      height: auto;
      max-height: 400px;
      object-fit: cover;
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-xl);
    }

    h1 {
      font-size: var(--text-3xl);
    }

    .project-detail__subtitle {
      font-size: var(--text-lg);
      color: var(--color-accent);
      font-weight: 600;
      margin: var(--space-sm) 0 var(--space-md);
    }

    .project-detail__desc {
      font-size: var(--text-lg);
      color: var(--color-text-muted);
      line-height: 1.7;
      margin-bottom: var(--space-xl);
    }

    .project-detail__stack {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-sm);
      margin-bottom: var(--space-2xl);
    }

    .project-detail__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
      gap: var(--space-lg);

      h2 {
        font-size: var(--text-base);
        margin-bottom: var(--space-md);
      }

      ul {
        margin: 0;
        padding-left: var(--space-lg);
        font-size: var(--text-sm);
        color: var(--color-text-muted);

        li {
          margin-bottom: var(--space-xs);
        }
      }
    }

    .project-detail__not-found {
      text-align: center;
      padding: var(--space-2xl);
    }
  `,
})
export class ProjectDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly dataService = inject(PortfolioDataService);
  private readonly router = inject(Router);

  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    { initialValue: '' },
  );

  readonly project = computed(() => {
    const s = this.slug();
    return s ? this.dataService.getProjectBySlug(s) : undefined;
  });

  goHome(): void {
    void this.router.navigate(['/']);
  }
}
