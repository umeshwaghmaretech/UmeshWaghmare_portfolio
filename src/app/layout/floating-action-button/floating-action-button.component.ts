import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  HostListener,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationService } from '../../core/services/navigation.service';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';

@Component({
  selector: 'app-floating-action-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="fab" [class.fab--open]="expanded()">
      @if (expanded()) {
        <div class="fab__menu">
          <button type="button" class="fab__item" (click)="goResume()" aria-label="View resume">
            Resume
          </button>
          <button type="button" class="fab__item" (click)="scrollToContact()" aria-label="Contact">
            Contact
          </button>
          @if (profile()?.github) {
            <button type="button" class="fab__item" (click)="openGithub()" aria-label="GitHub">
              GitHub
            </button>
          }
          @if (showScrollTop()) {
            <button type="button" class="fab__item" (click)="scrollTop()" aria-label="Scroll to top">
              Top
            </button>
          }
        </div>
      }
      <button
        type="button"
        class="fab__trigger"
        [attr.aria-expanded]="expanded()"
        aria-label="Quick actions"
        (click)="expanded.update((v) => !v)"
      >
        {{ expanded() ? '×' : '+' }}
      </button>
    </div>
  `,
  styles: `
    .fab {
      position: fixed;
      bottom: var(--space-lg);
      right: var(--space-lg);
      z-index: var(--z-fab);
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--space-sm);
    }

    .fab__menu {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      animation: fade-up 0.2s ease;
    }

    .fab__item {
      padding: var(--space-sm) var(--space-md);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--color-text);
      text-decoration: none;
      cursor: pointer;
      box-shadow: var(--shadow-card);
      transition: transform var(--transition-fast);

      &:hover {
        transform: translateX(-4px);
        color: var(--color-accent);
      }
    }

    .fab__trigger {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: var(--radius-full);
      border: none;
      background: var(--gradient-accent);
      color: var(--color-accent-text);
      font-size: 1.5rem;
      font-weight: 300;
      cursor: pointer;
      box-shadow: var(--shadow-lg);
      transition: transform var(--transition-fast);

      &:hover {
        transform: scale(1.05);
      }

      &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }
    }

    @keyframes fade-up {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
})
export class FloatingActionButtonComponent {
  private readonly nav = inject(NavigationService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly data = inject(PortfolioDataService);

  readonly expanded = signal(false);
  readonly showScrollTop = signal(false);
  readonly profile = this.data.profile;

  @HostListener('window:scroll')
  onScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.showScrollTop.set(window.scrollY > 400);
    }
  }

  goResume(): void {
    this.expanded.set(false);
    void this.router.navigate(['/resume']);
  }

  scrollToContact(): void {
    this.expanded.set(false);
    this.nav.scrollToSection('contact');
  }

  openGithub(): void {
    this.expanded.set(false);
    const url = this.data.profile()?.github;
    if (url) {
      window.open(url, '_blank', 'noopener');
    }
  }

  scrollTop(): void {
    this.expanded.set(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
