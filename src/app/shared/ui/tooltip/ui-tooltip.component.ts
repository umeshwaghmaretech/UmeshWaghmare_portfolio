import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  ElementRef,
  inject,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'ui-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="ui-tooltip"
      (mouseenter)="show.set(true)"
      (mouseleave)="show.set(false)"
      (focusin)="show.set(true)"
      (focusout)="show.set(false)"
    >
      <ng-content />
      @if (show()) {
        <span class="ui-tooltip__content" role="tooltip">{{ text() }}</span>
      }
    </span>
  `,
  styles: `
    .ui-tooltip {
      position: relative;
      display: inline-flex;

      &:has(:focus-visible) .ui-tooltip__content {
        opacity: 1;
        visibility: visible;
      }
    }

    .ui-tooltip__content {
      position: absolute;
      bottom: calc(100% + var(--space-xs));
      left: 50%;
      transform: translateX(-50%);
      padding: var(--space-xs) var(--space-sm);
      font-size: var(--text-xs);
      font-weight: 500;
      white-space: nowrap;
      background: var(--color-text);
      color: var(--color-bg);
      border-radius: var(--radius-sm);
      z-index: var(--z-tooltip);
      pointer-events: none;
      animation: fade-in 0.15s ease;
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,
})
export class UiTooltipComponent {
  readonly text = input.required<string>();
  readonly show = signal(false);
}
