import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeVariant = 'default' | 'success' | 'accent';

@Component({
  selector: 'ui-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [class]="classes()"><ng-content /></span>`,
  styles: `
    span {
      display: inline-flex;
      align-items: center;
      padding: 0.125rem var(--space-sm);
      font-size: var(--text-xs);
      font-weight: 600;
      border-radius: var(--radius-sm);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .ui-badge--default {
      background: var(--color-bg-muted);
      color: var(--color-text-muted);
    }

    .ui-badge--success {
      background: color-mix(in srgb, var(--color-success) 15%, transparent);
      color: var(--color-success);
    }

    .ui-badge--accent {
      background: var(--color-accent-subtle);
      color: var(--color-accent);
    }
  `,
})
export class UiBadgeComponent {
  readonly variant = input<BadgeVariant>('default');

  classes(): string {
    return `ui-badge--${this.variant()}`;
  }
}
