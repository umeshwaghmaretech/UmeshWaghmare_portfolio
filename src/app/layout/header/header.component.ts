import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { ScrollSpyService } from '../../core/services/scroll-spy.service';
import { NavigationService } from '../../core/services/navigation.service';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { UiButtonComponent } from '../../shared/ui/button/ui-button.component';
import { MobileNavDrawerComponent } from '../mobile-nav/mobile-nav-drawer.component';
import { BusinessCardService } from '../../core/services/business-card.service';
import { ThemeMode } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage,
    UiButtonComponent,
    MobileNavDrawerComponent,
  ],
  template: `
    <header
      class="header"
      [class.header--compact]="scrollSpy.headerCompact()"
      [class.header--scrolled]="scrollSpy.scrolled()"
    >
      <div class="header__inner">
        <button
          type="button"
          class="header__brand"
          (click)="openBusinessCard()"
          aria-label="Open digital business card"
        >
          @if (profile()?.profileImageUrl; as photo) {
            <img
              [ngSrc]="photo"
              [alt]="profile()?.name ?? 'Umesh Waghmare'"
              width="32"
              height="32"
              class="header__logo header__logo--photo"
            />
          } @else {
            <span class="header__logo">UW</span>
          }
          <span class="header__name">{{ profile()?.name ?? 'Umesh Waghmare' }}</span>
        </button>

        <nav class="header__nav" aria-label="Primary">
          @for (link of headerNavSections; track link.id) {
            <a
              [href]="link.href"
              [class.active]="scrollSpy.activeSection() === link.id"
              (click)="onNav($event, link.id)"
            >
              {{ link.label }}
            </a>
          }
        </nav>

        <div class="header__actions">
          <button
            type="button"
            class="header__menu-btn"
            [attr.aria-expanded]="mobileNavOpen()"
            aria-label="Open menu"
            (click)="mobileNavOpen.set(true)"
          >
            <span class="header__menu-icon" aria-hidden="true"></span>
          </button>

          <div class="theme-switcher" role="group" aria-label="Theme selection">
            @for (t of theme.themes; track t.id) {
              <button
                type="button"
                [class.active]="theme.theme() === t.id"
                [attr.aria-pressed]="theme.theme() === t.id"
                [attr.aria-label]="t.label + ' theme'"
                (click)="theme.setTheme(t.id)"
              >
                <span class="theme-switcher__label theme-switcher__label--long">{{ t.label }}</span>
                <span class="theme-switcher__label theme-switcher__label--short">{{ themeShortLabel(t.id) }}</span>
              </button>
            }
          </div>

          <div class="header__actions-end">
            <ui-button variant="ghost" size="sm" (clicked)="openCommandPalette.emit()">
              Section
            </ui-button>

            <div class="header__resume-actions">
              <ui-button variant="outline" size="sm" (clicked)="viewOnline()">
                <span class="header__action-label header__action-label--long">View Online</span>
                <span class="header__action-label header__action-label--short">Snapshot</span>
              </ui-button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <app-mobile-nav-drawer
      [open]="mobileNavOpen()"
      [activeSection]="scrollSpy.activeSection()"
      [sections]="mobileNavSections"
      (close)="mobileNavOpen.set(false)"
    />
  `,
  styles: `
    .header {
      position: sticky;
      top: 0;
      z-index: var(--z-header);
      height: var(--header-height);
      background: var(--header-bg);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid transparent;
      transition:
        height var(--transition-base),
        border-color var(--transition-base),
        box-shadow var(--transition-base);
    }

    .header--scrolled {
      border-color: var(--color-border);
      box-shadow: var(--shadow-sm);
    }

    .header--compact {
      height: var(--header-height-compact);
    }

    .header__inner {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: var(--space-sm);
      max-width: var(--header-container-max);
      margin-inline: auto;
      padding-inline: var(--space-sm);
      height: 100%;
      width: 100%;
    }

    @media (min-width: 1280px) {
      .header__inner {
        gap: var(--space-xs);
        padding-inline: var(--space-xs);
      }
    }

    .header__brand {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      color: var(--color-text);
      text-decoration: none;
      font-weight: 600;
      flex-shrink: 0;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      font-family: inherit;
      font-size: inherit;
      border-radius: var(--radius-md);
      transition: background var(--transition-fast);

      &:hover {
        background: var(--color-accent-subtle);
      }

      &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }
    }

    .header__logo {
      display: grid;
      place-items: center;
      width: 2rem;
      height: 2rem;
      border-radius: var(--radius-md);
      background: var(--gradient-accent);
      color: var(--color-accent-text);
      font-size: var(--text-sm);
      font-weight: 700;
      flex-shrink: 0;
    }

    .header__logo--photo {
      object-fit: cover;
      border: 2px solid var(--color-border);
      background: var(--color-surface);
      box-shadow: var(--shadow-sm);
    }

    .header__name {
      display: none;
    }

    @media (min-width: 1536px) {
      .header__name {
        display: inline;
      }
    }

    .header__nav {
      display: none;
      gap: 2px;
      justify-content: flex-start;
      min-width: 0;
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;

      &::-webkit-scrollbar {
        display: none;
      }

      a {
        padding: var(--space-xs) 0.25rem;
        font-size: var(--text-xs);
        font-weight: 500;
        color: var(--color-text-muted);
        border-radius: var(--radius-md);
        transition: color var(--transition-fast), background var(--transition-fast);
        text-decoration: none;
        white-space: nowrap;
        flex-shrink: 0;

        &:hover,
        &.active {
          color: var(--color-accent);
          background: var(--color-accent-subtle);
        }
      }
    }

    @media (min-width: 1536px) {
      .header__nav {
        gap: var(--space-xs);
        justify-content: center;
      }

      .header__nav a {
        padding: var(--space-xs) var(--space-sm);
        font-size: var(--text-sm);
      }
    }

    .header__nav-external {
      display: inline-flex !important;
      align-items: center;
      gap: var(--space-xs);
      color: var(--color-accent) !important;
    }

    @media (min-width: 1280px) {
      .header__nav {
        display: flex;
      }
    }

    .header__actions {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      flex-shrink: 0;
    }

    .header__actions-end {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      flex-shrink: 0;
    }

    @media (max-width: 1279px) {
      .header__actions {
        flex: 1;
        min-width: 0;
        justify-content: flex-end;
      }

      .header__menu-btn {
        margin-right: auto;
      }

      .header__actions-end {
        margin-left: auto;
      }

      .theme-switcher {
        display: none !important;
      }
    }

    @media (min-width: 1536px) {
      .header__actions {
        gap: var(--space-sm);
      }
    }

    .header__resume-actions {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      flex-wrap: wrap;
    }

    .header__action-label--short {
      display: inline;
    }

    .header__action-label--long {
      display: none;
    }

    @media (min-width: 640px) {
      .header__action-label--short {
        display: none;
      }

      .header__action-label--long {
        display: inline;
      }
    }

    @media (min-width: 1280px) and (max-width: 1599px) {
      .header__action-label--long {
        display: none;
      }

      .header__action-label--short {
        display: inline;
      }
    }

    .header__menu-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      padding: 0;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-surface);
      cursor: pointer;
      transition: border-color var(--transition-fast);

      &:hover {
        border-color: var(--color-accent);
      }

      &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }
    }

    @media (min-width: 1280px) {
      .header__menu-btn {
        display: none;
      }
    }

    .header__menu-icon {
      display: block;
      width: 1.125rem;
      height: 2px;
      background: var(--color-text);
      position: relative;

      &::before,
      &::after {
        content: '';
        position: absolute;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--color-text);
      }

      &::before {
        top: -6px;
      }

      &::after {
        top: 6px;
      }
    }

    .theme-switcher {
      display: none;
      padding: 2px;
      background: var(--color-bg-muted);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      flex-shrink: 0;

      button {
        padding: var(--space-xs) 0.375rem;
        font-size: var(--text-xs);
        font-weight: 600;
        border: none;
        background: transparent;
        color: var(--color-text-muted);
        border-radius: calc(var(--radius-md) - 2px);
        cursor: pointer;
        transition: background var(--transition-fast), color var(--transition-fast);
        white-space: nowrap;

        &.active {
          background: var(--color-surface);
          color: var(--color-accent);
          box-shadow: var(--shadow-sm);
        }

        &:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 1px;
        }
      }
    }

    .theme-switcher__label--long {
      display: none;
    }

    .theme-switcher__label--short {
      display: inline;
    }

    @media (min-width: 1600px) {
      .theme-switcher button {
        padding: var(--space-xs) var(--space-sm);
      }

      .theme-switcher__label--long {
        display: inline;
      }

      .theme-switcher__label--short {
        display: none;
      }
    }

    @media (min-width: 768px) {
      .theme-switcher {
        display: flex;
      }
    }
  `,
})
export class HeaderComponent {
  readonly theme = inject(ThemeService);
  readonly scrollSpy = inject(ScrollSpyService);
  readonly nav = inject(NavigationService);
  readonly profile = inject(PortfolioDataService).profile;

  readonly openCommandPalette = output<void>();
  readonly mobileNavOpen = signal(false);
  readonly headerNavSections = this.nav.sections.filter(
    (s) => s.id !== 'hero' && s.id !== 'github',
  );
  readonly mobileNavSections = this.nav.sections.filter(
    (s) => s.id !== 'github',
  );
  private readonly businessCard = inject(BusinessCardService);
  private readonly router = inject(Router);

  openBusinessCard(): void {
    this.businessCard.open();
  }

  viewOnline(): void {
    void this.router.navigate(['/resume']);
  }

  themeShortLabel(id: ThemeMode): string {
    const labels: Record<ThemeMode, string> = {
      professional: 'Pro',
      'modern-ai': 'AI',
      compact: 'Compact',
    };
    return labels[id];
  }

  onNav(event: Event, sectionId: string): void {
    event.preventDefault();
    this.mobileNavOpen.set(false);
    this.businessCard.close();
    this.nav.scrollToSection(sectionId);
  }
}
