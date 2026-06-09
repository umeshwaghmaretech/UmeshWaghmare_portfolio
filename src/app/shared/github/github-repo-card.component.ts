import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CategorizedRepo } from '../../core/models/github.models';
import { UiCardComponent } from '../ui/card/ui-card.component';
import { UiChipComponent } from '../ui/chip/ui-chip.component';
import { GithubIconComponent } from './github-icon.component';

@Component({
  selector: 'github-repo-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiCardComponent, UiChipComponent, GithubIconComponent],
  template: `
    @if (item(); as r) {
      <a
        [href]="r.repo.html_url"
        target="_blank"
        rel="noopener noreferrer"
        class="repo-card__link"
        [attr.aria-label]="'View ' + r.repo.name + ' on GitHub'"
      >
        <ui-card
          [variant]="'glass'"
          [badge]="r.pinned ? 'Pinned' : r.featured ? 'Featured' : null"
          class="repo-card"
        >
          <div class="repo-card__header">
            <github-icon [size]="16" />
            <h3 class="repo-card__name">{{ r.repo.name }}</h3>
          </div>
          @if (r.repo.description) {
            <p class="repo-card__desc">{{ r.repo.description }}</p>
          }
          <div class="repo-card__meta">
            @if (r.repo.language) {
              <span class="repo-card__lang">
                <span class="repo-card__lang-dot" aria-hidden="true"></span>
                {{ r.repo.language }}
              </span>
            }
            @if (r.repo.stargazers_count > 0) {
              <span class="repo-card__stars">★ {{ r.repo.stargazers_count }}</span>
            }
          </div>
          @if (r.repo.topics.length) {
            <div class="repo-card__topics">
              @for (topic of r.repo.topics.slice(0, 4); track topic) {
                <ui-chip>{{ topic }}</ui-chip>
              }
            </div>
          }
        </ui-card>
      </a>
    }
  `,
  styles: `
    .repo-card__link {
      display: block;
      text-decoration: none;
      color: inherit;
    }

    .repo-card {
      height: 100%;
      transition:
        transform var(--transition-base),
        box-shadow var(--transition-base);

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg), var(--shadow-glow);
      }
    }

    .repo-card__header {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      color: var(--color-accent);
    }

    .repo-card__name {
      font-size: var(--text-base);
      font-weight: 600;
      margin: 0;
      color: var(--color-text);
    }

    .repo-card__desc {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }

    .repo-card__meta {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    .repo-card__lang {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .repo-card__lang-dot {
      width: 0.625rem;
      height: 0.625rem;
      border-radius: 50%;
      background: var(--color-accent);
    }

    .repo-card__topics {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-xs);
    }
  `,
})
export class GithubRepoCardComponent {
  readonly item = input.required<CategorizedRepo>();
}
