import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { PortfolioDataService } from '../../../../core/services/portfolio-data.service';
import { Project } from '../../../../core/models/portfolio.models';
import { UiSectionTitleComponent } from '../../../../shared/ui/section-title/ui-section-title.component';
import { UiCardComponent } from '../../../../shared/ui/card/ui-card.component';
import { UiChipComponent } from '../../../../shared/ui/chip/ui-chip.component';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { UiDrawerComponent } from '../../../../shared/ui/drawer/ui-drawer.component';
import { UiSkeletonComponent } from '../../../../shared/ui/skeleton/ui-skeleton.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-projects-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage,
    UiSectionTitleComponent,
    UiCardComponent,
    UiChipComponent,
    UiButtonComponent,
    UiDrawerComponent,
    UiSkeletonComponent,
    ScrollRevealDirective,
  ],
  template: `
    <section id="projects" class="section" aria-labelledby="projects-heading">
      <div class="section__inner">
        <ui-section-title
          eyebrow="Projects"
          heading="Selected work & case studies"
          subtitle="Bento-style showcase of business analysis and product delivery projects."
          sectionId="projects-heading"
        />

        @if (data.loading()) {
          <div class="projects__skeleton">
            @for (i of [1, 2, 3]; track i) {
              <ui-skeleton height="280px" />
            }
          </div>
        } @else {
          <div class="projects__bento" appScrollReveal>
            @for (project of projects(); track project.id) {
              <ui-card
                [variant]="'glass'"
                [badge]="project.featured ? 'Featured' : null"
                [class]="'project-card project-card--' + project.bentoSize"
              >
                <img
                  [ngSrc]="project.image"
                  [alt]="project.title"
                  width="400"
                  height="240"
                  class="project-card__image"
                />
                <div class="project-card__body">
                  <h3>{{ project.title }}</h3>
                  <p class="project-card__subtitle">{{ project.subtitle }}</p>
                  <p class="project-card__desc">{{ project.description }}</p>
                  <div class="project-card__stack">
                    @for (tech of project.techStack; track tech) {
                      <ui-chip [accent]="true">{{ tech }}</ui-chip>
                    }
                  </div>
                  <div class="project-card__actions">
                    <ui-button size="sm" (clicked)="openDrawer(project)">Quick View</ui-button>
                    <ui-button variant="outline" size="sm" (clicked)="goToProject(project.slug)">
                      Full Case Study
                    </ui-button>
                  </div>
                </div>
              </ui-card>
            }
          </div>
        }
      </div>
    </section>

    <ui-drawer
      [open]="drawerOpen()"
      [title]="selectedProject()?.title ?? 'Project'"
      (close)="drawerOpen.set(false)"
    >
      @if (selectedProject(); as p) {
        <div class="drawer-content">
          <p>{{ p.description }}</p>
          <h4>Features</h4>
          <ul>
            @for (f of p.features; track f) {
              <li>{{ f }}</li>
            }
          </ul>
          <h4>Challenges</h4>
          <ul>
            @for (c of p.challenges; track c) {
              <li>{{ c }}</li>
            }
          </ul>
          <h4>Learnings</h4>
          <ul>
            @for (l of p.learnings; track l) {
              <li>{{ l }}</li>
            }
          </ul>
        </div>
      }
    </ui-drawer>
  `,
  styles: `
    .projects__skeleton {
      display: grid;
      gap: var(--space-lg);
    }

    .projects__bento {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: var(--space-lg);
    }

    @supports (grid-template-rows: subgrid) {
      .projects__bento {
        grid-template-rows: masonry;
      }
    }

    .project-card {
      container-type: inline-size;
      overflow: hidden;
      transition:
        transform var(--transition-base),
        box-shadow var(--transition-base);

      &:hover {
        transform: translateY(-4px) scale(1.01);
        box-shadow: var(--shadow-lg), var(--shadow-glow);
      }
    }

    .project-card--large {
      grid-column: span 4;
    }

    .project-card--medium {
      grid-column: span 3;
    }

    .project-card--small {
      grid-column: span 2;
    }

    @media (max-width: 768px) {
      .project-card--large,
      .project-card--medium,
      .project-card--small {
        grid-column: span 6;
      }
    }

    .project-card__image {
      width: 100%;
      height: 180px;
      object-fit: cover;
      border-radius: var(--radius-md);
      margin-bottom: var(--space-md);
    }

    .project-card__subtitle {
      font-size: var(--text-sm);
      color: var(--color-accent);
      font-weight: 600;
      margin-bottom: var(--space-sm);
    }

    .project-card__desc {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .project-card__stack {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-xs);
      margin-top: var(--space-md);
    }

    .project-card__actions {
      display: flex;
      gap: var(--space-sm);
      margin-top: var(--space-md);
    }

    .drawer-content {
      h4 {
        font-size: var(--text-sm);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-text-muted);
        margin: var(--space-md) 0 var(--space-sm);
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
  `,
})
export class ProjectsSectionComponent {
  private readonly dataService = inject(PortfolioDataService);
  private readonly router = inject(Router);
  readonly data = this.dataService;
  readonly projects = this.dataService.projects;

  readonly drawerOpen = signal(false);
  readonly selectedProject = signal<Project | null>(null);

  goToProject(slug: string): void {
    void this.router.navigate(['/projects', slug]);
  }

  openDrawer(project: Project): void {
    this.selectedProject.set(project);
    this.drawerOpen.set(true);
  }
}
