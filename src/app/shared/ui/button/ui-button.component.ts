import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

export type ButtonVariant = 'primary' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [class]="classes()"
      [type]="type()"
      [disabled]="disabled() || loading()"
      [attr.aria-busy]="loading()"
      (click)="clicked.emit($event)"
    >
      @if (loading()) {
        <span class="ui-btn__loader" aria-hidden="true"></span>
      }
      <span class="ui-btn__content" [class.ui-btn__content--hidden]="loading()">
        <ng-content />
      </span>
    </button>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    button {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      font-family: inherit;
      font-weight: 600;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition:
        background var(--transition-fast),
        color var(--transition-fast),
        border-color var(--transition-fast),
        transform var(--transition-fast),
        box-shadow var(--transition-fast);
      border: 1px solid transparent;

      &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      &:not(:disabled):hover {
        transform: translateY(-1px);
      }

      &:not(:disabled):active {
        transform: translateY(0);
      }
    }

    .ui-btn--sm {
      padding: var(--space-xs) var(--space-md);
      font-size: var(--text-sm);
    }

    .ui-btn--md {
      padding: var(--space-sm) var(--space-lg);
      font-size: var(--text-base);
    }

    .ui-btn--lg {
      padding: var(--space-md) var(--space-xl);
      font-size: var(--text-lg);
    }

    .ui-btn--primary {
      background: var(--gradient-accent);
      color: var(--color-accent-text);
      box-shadow: var(--shadow-sm);

      &:not(:disabled):hover {
        box-shadow: var(--shadow-card);
      }
    }

    .ui-btn--ghost {
      background: transparent;
      color: var(--color-text);

      &:not(:disabled):hover {
        background: var(--color-accent-subtle);
      }
    }

    .ui-btn--outline {
      background: transparent;
      color: var(--color-accent);
      border-color: var(--color-border-strong);

      &:not(:disabled):hover {
        border-color: var(--color-accent);
        background: var(--color-accent-subtle);
      }
    }

    .ui-btn__loader {
      position: absolute;
      width: 1rem;
      height: 1rem;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    .ui-btn__content--hidden {
      visibility: hidden;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class UiButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly clicked = output<MouseEvent>();

  classes(): string {
    return `ui-btn--${this.variant()} ui-btn--${this.size()}`;
  }
}
