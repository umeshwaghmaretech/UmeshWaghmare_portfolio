import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ExperienceItem } from '../../../core/models/portfolio.models';

@Component({
  selector: 'ui-timeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ui-timeline">
      @for (item of items(); track item.id) {
        <article class="ui-timeline__item">
          <div class="ui-timeline__marker" aria-hidden="true"></div>
          <div class="ui-timeline__content">
            <div class="ui-timeline__meta">
              <span class="ui-timeline__period">{{ item.period }}</span>
              <span class="ui-timeline__type">{{ item.type }}</span>
            </div>
            <h3>{{ item.role }}</h3>
            <p class="ui-timeline__company">{{ item.company }}</p>
            @if (item.location) {
              <p class="ui-timeline__location">{{ item.location }}</p>
            }
            <div class="ui-timeline__section">
              <h4>Responsibilities</h4>
              <ul>
                @for (r of item.responsibilities; track r) {
                  <li>{{ r }}</li>
                }
              </ul>
            </div>
            <div class="ui-timeline__section">
              <h4>Achievements</h4>
              <ul>
                @for (a of item.achievements; track a) {
                  <li>{{ a }}</li>
                }
              </ul>
            </div>
          </div>
        </article>
      }
    </div>
  `,
  styles: `
    .ui-timeline {
      position: relative;
      padding-left: var(--space-xl);

      &::before {
        content: '';
        position: absolute;
        left: 0.375rem;
        top: 0;
        bottom: 0;
        width: 2px;
        background: var(--color-border);
        animation: draw-line 1s ease forwards;
        transform-origin: top;
        animation-timeline: view();
        animation-range: entry 0% cover 50%;
      }
    }

    .ui-timeline__item {
      position: relative;
      padding-bottom: var(--space-2xl);

      &:last-child {
        padding-bottom: 0;
      }
    }

    .ui-timeline__marker {
      position: absolute;
      left: calc(-1 * var(--space-xl) + 0.125rem);
      top: 0.375rem;
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      background: var(--color-accent);
      box-shadow: 0 0 0 4px var(--color-accent-subtle);
    }

    .ui-timeline__content {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      box-shadow: var(--shadow-card);
      transition: transform var(--transition-base);

      &:hover {
        transform: translateX(4px);
      }
    }

    .ui-timeline__meta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-sm);
      margin-bottom: var(--space-sm);
    }

    .ui-timeline__period {
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--color-accent);
    }

    .ui-timeline__type {
      font-size: var(--text-xs);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      background: var(--color-bg-muted);
      color: var(--color-text-muted);
    }

    h3 {
      font-size: var(--text-xl);
      margin-bottom: var(--space-xs);
    }

    .ui-timeline__company {
      font-weight: 500;
      color: var(--color-text-muted);
      margin-bottom: var(--space-xs);
    }

    .ui-timeline__location {
      font-size: var(--text-sm);
      color: var(--color-text-subtle);
      margin-bottom: var(--space-md);
    }

    .ui-timeline__section {
      margin-top: var(--space-md);

      h4 {
        font-size: var(--text-sm);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-text-muted);
        margin-bottom: var(--space-sm);
      }

      ul {
        margin: 0;
        padding-left: var(--space-lg);
        color: var(--color-text-muted);
        font-size: var(--text-sm);

        li {
          margin-bottom: var(--space-xs);
        }
      }
    }

    @keyframes draw-line {
      from {
        transform: scaleY(0);
      }
      to {
        transform: scaleY(1);
      }
    }
  `,
})
export class UiTimelineComponent {
  readonly items = input.required<ExperienceItem[]>();
}
