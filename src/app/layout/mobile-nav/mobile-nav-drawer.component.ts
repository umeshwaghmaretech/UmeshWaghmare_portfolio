import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { NavigationService } from '../../core/services/navigation.service';
import { ThemeService } from '../../core/services/theme.service';
import { NavSection, ThemeMode } from '../../core/models/portfolio.models';
import { UiDrawerComponent } from '../../shared/ui/drawer/ui-drawer.component';
import { GithubIconComponent } from '../../shared/github/github-icon.component';

@Component({
  selector: 'app-mobile-nav-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiDrawerComponent, GithubIconComponent],
  template: `
    <ui-drawer [open]="open()" title="Menu" position="right" (close)="close.emit()">
      <nav class="mobile-nav" aria-label="Mobile navigation">
        @for (link of sections(); track link.id) {
          @if (link.external) {
            <a
              [href]="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="mobile-nav__link mobile-nav__link--external"
              (click)="close.emit()"
            >
              <github-icon [size]="18" />
              {{ link.label }}
            </a>
          } @else {
            <a
              [href]="link.href"
              class="mobile-nav__link"
              [class.active]="activeSection() === link.id"
              (click)="onNav($event, link)"
            >
              {{ link.label }}
            </a>
          }
        }
      </nav>

      <section class="mobile-nav__theme" aria-label="Theme selection">
        <h3 class="mobile-nav__theme-title">Theme</h3>
        <div class="mobile-nav__theme-switcher" role="group" aria-label="Choose theme">
          @for (t of theme.themes; track t.id) {
            <button
              type="button"
              class="mobile-nav__theme-btn"
              [class.active]="theme.theme() === t.id"
              [attr.aria-pressed]="theme.theme() === t.id"
              [attr.aria-label]="t.label + ' theme'"
              (click)="selectTheme(t.id)"
            >
              {{ t.label }}
            </button>
          }
        </div>
      </section>
    </ui-drawer>
  `,
  styles: `
    .mobile-nav {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .mobile-nav__link {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-md);
      font-size: var(--text-base);
      font-weight: 500;
      color: var(--color-text);
      text-decoration: none;
      border-radius: var(--radius-md);
      transition: background var(--transition-fast), color var(--transition-fast);

      &:hover,
      &.active {
        background: var(--color-accent-subtle);
        color: var(--color-accent);
      }

      &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }
    }

    .mobile-nav__link--external {
      color: var(--color-accent);
    }

    .mobile-nav__theme {
      margin-top: var(--space-xl);
      padding-top: var(--space-lg);
      border-top: 1px solid var(--color-border);
    }

    .mobile-nav__theme-title {
      margin: 0 0 var(--space-sm);
      padding-inline: var(--space-md);
      font-size: var(--text-xs);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--color-text-muted);
    }

    .mobile-nav__theme-switcher {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      padding-inline: var(--space-sm);
    }

    .mobile-nav__theme-btn {
      min-height: 2.75rem;
      padding: var(--space-sm) var(--space-md);
      font-size: var(--text-sm);
      font-weight: 600;
      font-family: inherit;
      text-align: left;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-surface);
      color: var(--color-text-muted);
      cursor: pointer;
      transition:
        background var(--transition-fast),
        color var(--transition-fast),
        border-color var(--transition-fast);

      &.active {
        background: var(--color-accent-subtle);
        border-color: var(--color-accent);
        color: var(--color-accent);
      }

      &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }
    }
  `,
})
export class MobileNavDrawerComponent {
  private readonly nav = inject(NavigationService);
  readonly theme = inject(ThemeService);

  readonly open = input(false);
  readonly activeSection = input('hero');
  readonly sections = input<NavSection[]>(this.nav.sections);
  readonly close = output<void>();

  onNav(event: Event, link: NavSection): void {
    event.preventDefault();
    this.nav.scrollToSection(link.id);
    this.close.emit();
  }

  selectTheme(mode: ThemeMode): void {
    this.theme.setTheme(mode);
  }
}
