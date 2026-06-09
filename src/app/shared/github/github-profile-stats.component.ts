import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GithubUser, GithubStats } from '../../core/models/github.models';
import { GithubLinkButtonComponent } from './github-link-button.component';

@Component({
  selector: 'github-profile-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GithubLinkButtonComponent],
  template: `
    <div class="gh-stats">
      @if (user(); as u) {
        <img
          [src]="u.avatar_url"
          [alt]="u.name ?? u.login + ' GitHub avatar'"
          width="80"
          height="80"
          class="gh-stats__avatar"
          loading="lazy"
        />
        <div class="gh-stats__info">
          <h3 class="gh-stats__name">{{ u.name ?? u.login }}</h3>
          @if (u.bio) {
            <p class="gh-stats__bio">{{ u.bio }}</p>
          }
          @if (stats(); as s) {
            <div class="gh-stats__counts">
              <span><strong>{{ s.publicRepos }}</strong> repos</span>
              <span><strong>{{ s.followers }}</strong> followers</span>
              @if (s.topLanguages.length) {
                <span class="gh-stats__langs">
                  @for (lang of s.topLanguages.slice(0, 3); track lang.name) {
                    <span>{{ lang.name }}</span>
                  }
                </span>
              }
            </div>
          }
        </div>
      } @else {
        <div class="gh-stats__fallback">
          <p>Explore my open-source work, experiments, and learning projects on GitHub.</p>
        </div>
      }
      <github-link-button
        [href]="profileUrl()"
        label="View Profile"
        variant="outline"
      />
    </div>
  `,
  styles: `
    .gh-stats {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-lg);
      padding: var(--space-xl);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
    }

    .gh-stats__avatar {
      width: 5rem;
      height: 5rem;
      border-radius: var(--radius-full);
      border: 2px solid var(--color-border);
      object-fit: cover;
    }

    .gh-stats__info {
      flex: 1;
      min-width: 200px;
    }

    .gh-stats__name {
      font-size: var(--text-lg);
      margin: 0 0 var(--space-xs);
    }

    .gh-stats__bio {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      margin: 0 0 var(--space-sm);
    }

    .gh-stats__counts {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-md);
      font-size: var(--text-sm);
      color: var(--color-text-muted);

      strong {
        color: var(--color-text);
      }
    }

    .gh-stats__langs {
      display: flex;
      gap: var(--space-xs);

      span {
        padding: 2px var(--space-xs);
        background: var(--color-accent-subtle);
        color: var(--color-accent);
        border-radius: var(--radius-sm);
        font-size: var(--text-xs);
        font-weight: 600;
      }
    }

    .gh-stats__fallback {
      flex: 1;

      p {
        margin: 0;
        color: var(--color-text-muted);
      }
    }
  `,
})
export class GithubProfileStatsComponent {
  readonly user = input<GithubUser | null>(null);
  readonly stats = input<GithubStats | null>(null);
  readonly profileUrl = input.required<string>();
}
