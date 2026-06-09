import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type CardVariant = 'solid' | 'glass' | 'elevated';

@Component({
  selector: 'ui-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article [class]="classes()">
      @if (badge()) {
        <span class="ui-card__badge">{{ badge() }}</span>
      }
      <div class="ui-card__body">
        <ng-content />
      </div>
    </article>
  `,
  styles: `
    :host {
      display: block;
      container-type: inline-size;
    }

    article {
      position: relative;
      border-radius: var(--radius-lg);
      padding: var(--card-padding);
      transition:
        transform var(--transition-base),
        box-shadow var(--transition-base),
        border-color var(--transition-base);

      &:hover {
        transform: translateY(-2px);
      }
    }

    .ui-card--solid {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-card);
    }

    .ui-card--glass {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      box-shadow: var(--shadow-card);
    }

    .ui-card--elevated {
      background: var(--color-surface-elevated);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-lg);
    }

    article:has(.ui-card__badge) {
      padding-top: calc(var(--card-padding) + var(--space-sm));
    }

    .ui-card__badge {
      position: absolute;
      top: var(--space-md);
      right: var(--space-md);
      font-size: var(--text-xs);
      font-weight: 600;
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      background: var(--color-accent-subtle);
      color: var(--color-accent);
    }

    .ui-card__body {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    @container (max-width: 280px) {
      .ui-card__body {
        gap: var(--space-sm);
      }
    }
  `,
})
export class UiCardComponent {
  readonly variant = input<CardVariant>('solid');
  readonly badge = input<string | null>(null);
  readonly hoverable = input(true);

  classes(): string {
    return `ui-card--${this.variant()}`;
  }
}
