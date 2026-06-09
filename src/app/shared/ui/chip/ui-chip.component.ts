import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [class]="classes()"><ng-content /></span>`,
  styles: `
    span {
      display: inline-flex;
      align-items: center;
      padding: var(--space-xs) var(--space-sm);
      font-size: var(--text-xs);
      font-weight: 500;
      border-radius: var(--radius-full);
      background: var(--color-bg-muted);
      color: var(--color-text-muted);
      border: 1px solid var(--color-border);
      transition: background var(--transition-fast);
    }

    .ui-chip--accent {
      background: var(--color-accent-subtle);
      color: var(--color-accent);
      border-color: transparent;
    }
  `,
})
export class UiChipComponent {
  readonly accent = input(false);

  classes(): string {
    return this.accent() ? 'ui-chip--accent' : '';
  }
}
