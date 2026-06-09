import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="classes()" [style.width]="width()" [style.height]="height()"></div>`,
  styles: `
    div {
      border-radius: var(--radius-md);
      background: linear-gradient(
        90deg,
        var(--color-bg-muted) 25%,
        var(--color-bg-subtle) 50%,
        var(--color-bg-muted) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    .ui-skeleton--circle {
      border-radius: 50%;
    }

    .ui-skeleton--text {
      height: 1rem;
      margin-bottom: var(--space-sm);
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `,
})
export class UiSkeletonComponent {
  readonly width = input('100%');
  readonly height = input('1rem');
  readonly variant = input<'rect' | 'circle' | 'text'>('rect');

  classes(): string {
    return this.variant() !== 'rect' ? `ui-skeleton--${this.variant()}` : '';
  }
}
