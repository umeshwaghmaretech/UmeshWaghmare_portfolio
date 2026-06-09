import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { GithubService } from '../../../../core/services/github.service';
import { UiSectionTitleComponent } from '../../../../shared/ui/section-title/ui-section-title.component';
import { UiSkeletonComponent } from '../../../../shared/ui/skeleton/ui-skeleton.component';
import { GithubProfileStatsComponent } from '../../../../shared/github/github-profile-stats.component';
import { GithubRepoCardComponent } from '../../../../shared/github/github-repo-card.component';
import { GithubLinkButtonComponent } from '../../../../shared/github/github-link-button.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-github-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiSectionTitleComponent,
    UiSkeletonComponent,
    GithubProfileStatsComponent,
    GithubRepoCardComponent,
    GithubLinkButtonComponent,
    ScrollRevealDirective,
  ],
  template: `
    <section id="github" class="section" aria-labelledby="github-heading">
      <div class="section__inner">
        <ui-section-title
          eyebrow="GitHub"
          heading="Projects & Technical Work"
          subtitle="Open-source projects, experiments, and continuous learning — from Angular and .NET to business analysis and product thinking."
          sectionId="github-heading"
        />

        @if (github.loading()) {
          <div class="github__skeleton">
            <ui-skeleton height="120px" />
            <div class="github__skeleton-grid">
              @for (i of [1, 2, 3, 4]; track i) {
                <ui-skeleton height="200px" />
              }
            </div>
          </div>
        } @else {
          <div appScrollReveal>
            <github-profile-stats
              [user]="github.user()"
              [stats]="github.stats()"
              [profileUrl]="github.profileUrl()"
            />

            @if (github.error() && !github.repos().length) {
              <div class="github__fallback">
                <p>{{ github.error() }}</p>
                <github-link-button
                  [href]="github.profileUrl()"
                  label="View Full Profile on GitHub"
                  variant="primary"
                />
              </div>
            } @else if (github.categorizedRepos().length) {
              @if (github.categoryGroups().length > 1) {
                <div class="github__filters" role="tablist" aria-label="Repository categories">
                  <button
                    type="button"
                    role="tab"
                    [class.active]="activeFilter() === 'all'"
                    [attr.aria-selected]="activeFilter() === 'all'"
                    (click)="activeFilter.set('all')"
                  >
                    All
                  </button>
                  @for (group of github.categoryGroups(); track group.id) {
                    <button
                      type="button"
                      role="tab"
                      [class.active]="activeFilter() === group.id"
                      [attr.aria-selected]="activeFilter() === group.id"
                      (click)="activeFilter.set(group.id)"
                    >
                      {{ group.label }}
                    </button>
                  }
                </div>
              }

              <div class="github__bento">
                @for (repo of filteredRepos(); track repo.repo.id) {
                  <github-repo-card [item]="repo" />
                }
              </div>
            }

            <div class="github__cta">
              <github-link-button
                [href]="github.profileUrl()"
                label="View Full Profile on GitHub"
                variant="primary"
              />
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .github__skeleton {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .github__skeleton-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-lg);
    }

    .github__fallback {
      margin-top: var(--space-xl);
      padding: var(--space-xl);
      text-align: center;
      background: var(--color-bg-muted);
      border-radius: var(--radius-lg);

      p {
        margin: 0 0 var(--space-md);
        color: var(--color-text-muted);
      }
    }

    .github__filters {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-sm);
      margin: var(--space-xl) 0 var(--space-lg);

      button {
        padding: var(--space-xs) var(--space-md);
        font-size: var(--text-sm);
        font-weight: 600;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-full);
        background: var(--color-surface);
        color: var(--color-text-muted);
        cursor: pointer;
        transition: all var(--transition-fast);

        &.active,
        &:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          background: var(--color-accent-subtle);
        }

        &:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }
      }
    }

    .github__bento {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-lg);
    }

    .github__cta {
      display: flex;
      justify-content: center;
      margin-top: var(--space-2xl);
    }
  `,
})
export class GithubSectionComponent implements OnInit {
  readonly github = inject(GithubService);
  readonly activeFilter = signal('all');

  ngOnInit(): void {
    this.github.load();
  }

  filteredRepos() {
    const filter = this.activeFilter();
    const repos = this.github.categorizedRepos();
    if (filter === 'all') return repos;
    return repos.filter((r) => r.categoryId === filter);
  }
}
