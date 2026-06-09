import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { NavigationService } from '../../core/services/navigation.service';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { NavSection } from '../../core/models/portfolio.models';
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
  `,
})
export class MobileNavDrawerComponent {
  private readonly nav = inject(NavigationService);

  readonly open = input(false);
  readonly activeSection = input('hero');
  readonly sections = input<NavSection[]>(this.nav.sections);
  readonly close = output<void>();

  onNav(event: Event, link: NavSection): void {
    event.preventDefault();
    this.nav.scrollToSection(link.id);
    this.close.emit();
  }
}
