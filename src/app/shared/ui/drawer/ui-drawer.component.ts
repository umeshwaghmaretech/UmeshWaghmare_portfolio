import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  effect,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'ui-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A11yModule],
  template: `
    @if (open()) {
      <div class="ui-drawer__backdrop" (click)="close.emit()" aria-hidden="true"></div>
      <aside
        class="ui-drawer"
        [class.ui-drawer--right]="position() === 'right'"
        [class.ui-drawer--left]="position() === 'left'"
        role="dialog"
        [attr.aria-label]="title()"
        cdkTrapFocus
        cdkTrapFocusAutoCapture
      >
        <header class="ui-drawer__header">
          <h2>{{ title() }}</h2>
          <button type="button" class="ui-drawer__close" (click)="close.emit()" aria-label="Close">
            &times;
          </button>
        </header>
        <div class="ui-drawer__body">
          <ng-content />
        </div>
      </aside>
    }
  `,
  styles: `
    .ui-drawer__backdrop {
      position: fixed;
      inset: 0;
      background: color-mix(in srgb, #000 50%, transparent);
      z-index: var(--z-drawer);
      animation: fade-in 0.2s ease;
    }

    .ui-drawer {
      position: fixed;
      top: 0;
      bottom: 0;
      width: min(420px, 100vw);
      background: var(--color-surface);
      border-left: 1px solid var(--color-border);
      z-index: calc(var(--z-drawer) + 1);
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-lg);
      animation: slide-in 0.3s ease;
    }

    .ui-drawer--right {
      right: 0;
    }

    .ui-drawer--left {
      left: 0;
      border-left: none;
      border-right: 1px solid var(--color-border);
    }

    .ui-drawer__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);

      h2 {
        font-size: var(--text-lg);
      }
    }

    .ui-drawer__close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--color-text-muted);
      line-height: 1;
      padding: var(--space-xs);

      &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }
    }

    .ui-drawer__body {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-lg);
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slide-in {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }
  `,
})
export class UiDrawerComponent {
  private readonly platformId = inject(PLATFORM_ID);

  readonly open = input(false);
  readonly title = input('Panel');
  readonly position = input<'left' | 'right'>('right');
  readonly close = output<void>();

  constructor() {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        document.body.style.overflow = this.open() ? 'hidden' : '';
      }
    });
  }
}
