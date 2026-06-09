import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GithubIconComponent } from './github-icon.component';

export type GithubButtonVariant = 'primary' | 'outline' | 'ghost' | 'glass' | 'compact';

@Component({
  selector: 'github-link-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GithubIconComponent],
  template: `
    <a
      [href]="href()"
      target="_blank"
      rel="noopener noreferrer"
      [class]="classes()"
      [attr.aria-label]="ariaLabel() ?? label()"
    >
      @if (showIcon()) {
        <github-icon [size]="iconSize()" />
      }
      @if (label()) {
        <span>{{ label() }}</span>
      }
    </a>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      font-family: inherit;
      font-weight: 600;
      text-decoration: none;
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

      &:hover {
        transform: translateY(-1px);
      }
    }

    .gh-btn--primary {
      padding: var(--space-sm) var(--space-lg);
      font-size: var(--text-base);
      background: var(--gradient-accent);
      color: var(--color-accent-text);
      box-shadow: var(--shadow-sm);

      &:hover {
        box-shadow: var(--shadow-card);
      }
    }

    .gh-btn--outline {
      padding: var(--space-sm) var(--space-lg);
      font-size: var(--text-base);
      background: transparent;
      color: var(--color-accent);
      border-color: var(--color-border-strong);

      &:hover {
        border-color: var(--color-accent);
        background: var(--color-accent-subtle);
      }
    }

    .gh-btn--ghost {
      padding: var(--space-sm) var(--space-lg);
      font-size: var(--text-base);
      background: transparent;
      color: var(--color-text);

      &:hover {
        background: var(--color-accent-subtle);
        color: var(--color-accent);
      }
    }

    .gh-btn--glass {
      padding: var(--space-sm) var(--space-lg);
      font-size: var(--text-base);
      background: var(--glass-bg);
      color: var(--color-text);
      border-color: var(--glass-border);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      box-shadow: var(--shadow-card);

      &:hover {
        border-color: var(--color-accent);
        color: var(--color-accent);
      }
    }

    .gh-btn--compact {
      padding: var(--space-xs);
      font-size: var(--text-sm);
      background: transparent;
      color: var(--color-text-muted);
      border-radius: var(--radius-md);

      &:hover {
        background: var(--color-accent-subtle);
        color: var(--color-accent);
      }
    }
  `,
})
export class GithubLinkButtonComponent {
  readonly href = input.required<string>();
  readonly label = input('');
  readonly variant = input<GithubButtonVariant>('outline');
  readonly showIcon = input(true);
  readonly iconSize = input(18);
  readonly ariaLabel = input<string | null>(null);

  classes(): string {
    return `gh-btn--${this.variant()}`;
  }
}
