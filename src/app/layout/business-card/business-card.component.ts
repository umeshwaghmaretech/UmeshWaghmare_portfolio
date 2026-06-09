import {
  ChangeDetectionStrategy,
  Component,
  inject,
  HostListener,
  ElementRef,
  viewChild,
  effect,
  PLATFORM_ID,
  signal,
  DestroyRef,
} from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { A11yModule } from '@angular/cdk/a11y';
import { BusinessCardService } from '../../core/services/business-card.service';
import { ThemeService } from '../../core/services/theme.service';
import { NavigationService } from '../../core/services/navigation.service';
import { GithubIconComponent } from '../../shared/github/github-icon.component';
import { LinkedinIconComponent } from '../../shared/social/linkedin-icon.component';
import { UiButtonComponent } from '../../shared/ui/button/ui-button.component';

@Component({
  selector: 'app-business-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A11yModule, NgOptimizedImage, GithubIconComponent, LinkedinIconComponent, UiButtonComponent],
  template: `
    @if (card.isOpen()) {
      <div class="biz-card__backdrop" (click)="card.close()" aria-hidden="true"></div>

      <div
        [class]="'biz-card__panel ' + panelClasses()"
        role="dialog"
        aria-modal="true"
        aria-labelledby="biz-card-title"
        cdkTrapFocus
        cdkTrapFocusAutoCapture
      >
        <button type="button" class="biz-card__close" (click)="card.close()" aria-label="Close">
          &times;
        </button>

        @if (profile(); as p) {
          @if (config(); as cfg) {
            <div
              class="biz-card__body"
              [class.biz-card__body--scroll-fallback]="scrollFallback()"
            >
              <div class="biz-card__viewport" #fitViewport>
                <div class="biz-card__fit" #fitContent>
                  <div class="biz-card__layout">
                <!-- Left / top: profile + contact -->
                <div class="biz-card__col biz-card__col--profile">
                  <header class="biz-card__profile">
                    @if (p.profileImageUrl) {
                      <img
                        [ngSrc]="p.profileImageUrl"
                        [alt]="p.name + ' profile photo'"
                        width="96"
                        height="96"
                        class="biz-card__avatar"
                      />
                    }
                    <div class="biz-card__profile-text">
                      <h2 id="biz-card-title" class="biz-card__name">{{ p.name }}</h2>
                      <p class="biz-card__title">{{ cfg.cardTitle }}</p>
                      <p class="biz-card__tagline">{{ cfg.tagline }}</p>
                      <span class="biz-card__badge">
                        <span class="biz-card__badge-dot" aria-hidden="true"></span>
                        {{ cfg.availability }}
                      </span>
                    </div>
                  </header>

                  <section class="biz-card__section" aria-label="Contact details">
                    <h3 class="biz-card__section-title">Contact</h3>
                    <div class="biz-card__contact-grid">
                      <a
                        [href]="'mailto:' + p.email"
                        class="biz-card__contact-btn biz-card__contact-btn--email"
                      >
                        <span class="biz-card__contact-btn-row">
                          <svg class="biz-card__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                              d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"
                              stroke="currentColor"
                              stroke-width="1.75"
                            />
                            <path
                              d="m4 7 8 6 8-6"
                              stroke="currentColor"
                              stroke-width="1.75"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          <span>Email</span>
                        </span>
                        <span class="biz-card__contact-value">{{ p.email }}</span>
                      </a>
                      @if (p.github) {
                        <a
                          [href]="p.github"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="biz-card__contact-btn biz-card__contact-btn--accent"
                        >
                          <github-icon [size]="16" />
                          <span>GitHub</span>
                        </a>
                      }
                      <a
                        [href]="p.linkedIn"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="biz-card__contact-btn biz-card__contact-btn--accent"
                        [class.biz-card__contact-btn--solo]="!p.github"
                      >
                        <linkedin-icon [size]="16" />
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  </section>

                  <section
                    class="biz-card__section biz-card__section--footer biz-card__section--desktop-only"
                    aria-label="Share and save"
                  >
                    <div class="biz-card__footer-row">
                      <div class="biz-card__qr-wrap">
                        <canvas #qrCanvas aria-label="QR code for portfolio"></canvas>
                        <span class="biz-card__qr-label">Scan to visit</span>
                      </div>
                      <div class="biz-card__footer-actions">
                        <button type="button" class="biz-card__action-btn" (click)="card.shareProfile()">
                          {{ card.copyFeedback() === 'url' ? 'Link Copied!' : 'Share Profile' }}
                        </button>
                        <button type="button" class="biz-card__action-btn" (click)="card.downloadVCard()">
                          Save Contact
                        </button>
                      </div>
                    </div>
                  </section>
                </div>

                <!-- Right / bottom: services + actions -->
                <div class="biz-card__col biz-card__col--services">
                  <section class="biz-card__section biz-card__section--help" aria-label="Services">
                    <h3 class="biz-card__section-title">{{ cfg.helpHeading }}</h3>
                    <div class="biz-card__help-list">
                      @for (item of cfg.helpItems; track item.title) {
                        <article
                          class="biz-card__help-card"
                          [class.biz-card__help-card--group]="item.items?.length"
                        >
                          <h4 class="biz-card__help-title">{{ item.title }}</h4>
                          @if (item.description) {
                            <p class="biz-card__help-desc">{{ item.description }}</p>
                          }
                          @if (item.items?.length) {
                            <div class="biz-card__help-sublist">
                              @for (sub of item.items; track sub.title) {
                                <div class="biz-card__help-subitem">
                                  <h5 class="biz-card__help-subtitle">{{ sub.title }}</h5>
                                  @if (sub.description) {
                                    <p class="biz-card__help-subdesc">{{ sub.description }}</p>
                                  }
                                </div>
                              }
                            </div>
                          }
                        </article>
                      }
                    </div>
                  </section>

                  <section class="biz-card__section biz-card__section--actions" aria-label="Quick actions">
                    <div class="biz-card__ctas">
                      <ui-button size="sm" (clicked)="goContact()">Let's Connect</ui-button>
                      <ui-button variant="outline" size="sm" (clicked)="goWorkWithMe()">
                        Collaborate With Me
                      </ui-button>
                      @if (p.github) {
                        <a
                          [href]="p.github"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="biz-card__cta-link"
                        >
                          Explore GitHub
                        </a>
                      }
                      <button type="button" class="biz-card__cta-link biz-card__cta-link--btn" (click)="goResume()">
                        View Resume
                      </button>
                    </div>
                  </section>

                  <section
                    class="biz-card__section biz-card__section--footer biz-card__section--mobile-only"
                    aria-label="Share and save"
                  >
                    <div class="biz-card__footer-row">
                      <div class="biz-card__qr-wrap">
                        <canvas #qrCanvasMobile aria-label="QR code for portfolio"></canvas>
                        <span class="biz-card__qr-label">Scan to visit</span>
                      </div>
                      <div class="biz-card__footer-actions">
                        <button type="button" class="biz-card__action-btn" (click)="card.shareProfile()">
                          {{ card.copyFeedback() === 'url' ? 'Link Copied!' : 'Share Profile' }}
                        </button>
                        <button type="button" class="biz-card__action-btn" (click)="card.downloadVCard()">
                          Save Contact
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
                  </div>
                </div>
              </div>
            </div>
          }
        }
      </div>
    }
  `,
  styles: `
    .biz-card__backdrop {
      position: fixed;
      inset: 0;
      background: color-mix(in srgb, #000 55%, transparent);
      z-index: calc(var(--z-drawer) + 5);
      animation: biz-fade-in 0.25s ease;
    }

    .biz-card__panel {
      position: fixed;
      z-index: calc(var(--z-drawer) + 6);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: biz-card-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .biz-card__viewport {
      width: 100%;
    }

    .biz-card__fit {
      transform-origin: top center;
    }

    /* Mobile & tablet: bottom sheet, scale-to-fit */
    @media (max-width: 1023px) {
      .biz-card__panel {
        left: 0;
        right: 0;
        bottom: 0;
        max-height: 94dvh;
        border-radius: var(--radius-xl) var(--radius-xl) 0 0;
      }

      .biz-card__body {
        max-height: 94dvh;
        overflow: hidden;
        padding: var(--space-md);
        padding-top: calc(var(--space-md) + var(--space-md));
        padding-bottom: var(--space-md);
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .biz-card__body--scroll-fallback {
        overflow-y: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
      }

      .biz-card__viewport {
        overflow: hidden;
        flex-shrink: 0;
      }

      .biz-card__layout {
        display: flex;
        flex-direction: column;
        gap: 0;
        width: calc(100vw - 2 * var(--space-md));
        max-width: 100%;
      }

      .biz-card__profile {
        margin-bottom: var(--space-md);
        gap: var(--space-md);
      }

      .biz-card__section {
        margin-bottom: var(--space-md);
      }

      .biz-card__section-title {
        margin-bottom: var(--space-sm);
      }

      .biz-card__help-list {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--space-xs);
      }

      .biz-card__help-card {
        padding: var(--space-sm);
      }

      .biz-card__help-card--group {
        grid-column: 1 / -1;
      }

      .biz-card__help-sublist {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--space-xs);
        margin-top: var(--space-sm);
        padding-left: calc(var(--space-sm) + 0.25rem);
      }

      .biz-card__help-subitem {
        padding: var(--space-xs);
      }

      .biz-card__qr-wrap canvas {
        width: 96px !important;
        height: 96px !important;
      }

      .biz-card__section--desktop-only {
        display: none;
      }
    }

    /* Desktop & laptop: horizontal card, no scroll */
    @media (min-width: 1024px) {
      .biz-card__panel {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: min(1320px, calc(100vw - 1.5rem));
        height: auto;
        max-height: calc(100dvh - 1.5rem);
        border-radius: var(--radius-xl);
        animation: biz-card-in-desktop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .biz-card__body {
        overflow: visible;
        height: auto;
        padding: var(--space-lg);
        padding-top: calc(var(--space-lg) + var(--space-md));
        display: flex;
        flex-direction: column;
      }

      .biz-card__viewport,
      .biz-card__fit {
        width: 100%;
      }

      .biz-card__layout {
        display: grid;
        grid-template-columns: minmax(320px, 380px) minmax(0, 1fr);
        gap: var(--space-lg);
        overflow: visible;
        align-items: start;
      }

      .biz-card__col--profile {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
        border-right: 1px solid var(--color-border);
        padding-right: var(--space-lg);
        min-width: 0;
        overflow: visible;
      }

      .biz-card__col--services {
        display: flex;
        flex-direction: column;
        overflow: visible;
      }

      .biz-card__section--help {
        display: flex;
        flex-direction: column;
        margin-bottom: var(--space-sm);
        overflow: visible;
      }

      .biz-card__help-list {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--space-xs);
        overflow: visible;
        align-content: start;
      }

      .biz-card__help-card {
        padding: var(--space-sm);
        min-width: 0;
      }

      .biz-card__help-card--group {
        grid-column: 1 / -1;
      }

      .biz-card__help-title {
        font-size: var(--text-xs);
      }

      .biz-card__help-desc {
        font-size: 0.6875rem;
        line-height: 1.45;
      }

      .biz-card__help-sublist {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: var(--space-xs);
        margin-top: var(--space-sm);
      }

      @media (max-width: 1399px) {
        .biz-card__help-sublist {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      @media (max-width: 1199px) {
        .biz-card__help-sublist {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      .biz-card__help-subitem {
        padding: var(--space-xs);
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
      }

      .biz-card__help-subtitle {
        font-size: 0.6875rem;
        font-weight: 700;
        color: var(--color-text);
        margin: 0 0 2px;
      }

      .biz-card__help-subdesc {
        font-size: 0.625rem;
        color: var(--color-text-muted);
        margin: 0;
        line-height: 1.45;
      }

      .biz-card__section--actions {
        margin-bottom: 0;
        flex-shrink: 0;
      }

      .biz-card__section--footer.biz-card__section--desktop-only {
        margin-top: 0;
        margin-bottom: 0;
        flex-shrink: 0;
      }

      .biz-card__section--mobile-only {
        display: none;
      }

      .biz-card__profile {
        margin-bottom: 0;
        gap: var(--space-md);
        flex-direction: column;
        align-items: flex-start;
      }

      .biz-card__avatar {
        width: 4.5rem;
        height: 4.5rem;
      }

      .biz-card__name {
        font-size: var(--text-lg);
      }

      .biz-card__title,
      .biz-card__tagline {
        font-size: var(--text-xs);
      }

      .biz-card__section {
        margin-bottom: var(--space-sm);
      }

      .biz-card__contact-btn {
        padding: var(--space-xs) var(--space-sm);
        min-width: 0;
      }

      .biz-card__footer-row {
        flex-direction: row;
        align-items: center;
        gap: var(--space-md);
      }

      .biz-card__footer-actions {
        flex: 1;
      }

      .biz-card__qr-wrap canvas {
        width: 88px !important;
        height: 88px !important;
      }
    }

    .biz-card__close {
      position: absolute;
      top: var(--space-md);
      right: var(--space-md);
      z-index: 2;
      background: none;
      border: none;
      font-size: 1.75rem;
      line-height: 1;
      color: var(--color-text-muted);
      cursor: pointer;
      padding: var(--space-xs);
      border-radius: var(--radius-md);
      transition: color var(--transition-fast), background var(--transition-fast);

      &:hover {
        color: var(--color-text);
        background: var(--color-accent-subtle);
      }

      &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }
    }

    .biz-card__profile {
      display: flex;
      gap: var(--space-lg);
      align-items: flex-start;
      margin-bottom: var(--space-xl);
    }

    .biz-card__avatar {
      width: 5rem;
      height: 5rem;
      border-radius: var(--radius-lg);
      object-fit: cover;
      flex-shrink: 0;
      border: 2px solid var(--color-border);
    }

    .biz-card__name {
      font-size: var(--text-xl);
      margin: 0 0 var(--space-xs);
    }

    .biz-card__title {
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--color-accent);
      margin: 0 0 var(--space-xs);
    }

    .biz-card__tagline {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      margin: 0 0 var(--space-sm);
      line-height: 1.5;
    }

    .biz-card__badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      font-size: var(--text-xs);
      font-weight: 600;
      color: var(--color-success);
      padding: var(--space-xs) var(--space-sm);
      background: color-mix(in srgb, var(--color-success) 12%, transparent);
      border-radius: var(--radius-full);
    }

    .biz-card__badge-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background: var(--color-success);
      animation: biz-pulse 2s ease-in-out infinite;
    }

    .biz-card__section {
      margin-bottom: var(--space-xl);
    }

    .biz-card__section-title {
      font-size: var(--text-xs);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--color-text-muted);
      margin: 0 0 var(--space-md);
    }

    .biz-card__contact-grid {
      display: grid;
      gap: var(--space-sm);
      grid-template-columns: 1fr 1fr;
    }

    .biz-card__contact-btn--email {
      grid-column: 1 / -1;
      gap: var(--space-xs);
    }

    .biz-card__contact-btn-row {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      color: var(--color-accent);
      font-weight: 600;
      font-size: var(--text-sm);
    }

    .biz-card__contact-btn--solo {
      grid-column: 1 / -1;
    }

    .biz-card__contact-btn {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: var(--space-sm) var(--space-md);
      background: var(--color-bg-muted);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      text-decoration: none;
      color: inherit;
      cursor: pointer;
      font-family: inherit;
      font-size: inherit;
      text-align: left;
      transition:
        transform var(--transition-fast),
        border-color var(--transition-fast),
        box-shadow var(--transition-fast);

      &:hover {
        transform: translateY(-2px);
        border-color: var(--color-accent);
        box-shadow: var(--shadow-sm);
      }

      &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }
    }

    .biz-card__contact-btn--accent {
      flex-direction: row;
      align-items: center;
      gap: var(--space-sm);
      color: var(--color-accent);
      font-weight: 600;
    }

    .biz-card__icon {
      flex-shrink: 0;
    }

    .biz-card__contact-label {
      font-size: var(--text-xs);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--color-text-muted);
    }

    .biz-card__contact-value {
      font-size: var(--text-xs);
      font-weight: 500;
      color: var(--color-text);
      word-break: break-word;
      line-height: 1.4;
    }

    .biz-card__help-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .biz-card__help-card {
      padding: var(--space-md);
      background: var(--color-bg-muted);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);

      &:hover {
        border-color: var(--color-accent);
        box-shadow: var(--shadow-sm);
      }
    }

    .biz-card__help-title {
      font-size: var(--text-sm);
      font-weight: 700;
      color: var(--color-text);
      margin: 0 0 var(--space-xs);
      display: flex;
      align-items: flex-start;
      gap: var(--space-xs);

      &::before {
        content: '•';
        color: var(--color-accent);
        flex-shrink: 0;
      }
    }

    .biz-card__help-desc {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      margin: 0;
      line-height: 1.55;
      padding-left: calc(var(--space-sm) + 0.25rem);
    }

    .biz-card__help-sublist {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      margin-top: var(--space-sm);
      padding-left: calc(var(--space-sm) + 0.25rem);
    }

    .biz-card__help-subitem {
      padding: var(--space-sm);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
    }

    .biz-card__help-subtitle {
      font-size: var(--text-xs);
      font-weight: 700;
      color: var(--color-text);
      margin: 0 0 var(--space-xs);
    }

    .biz-card__help-subdesc {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      margin: 0;
      line-height: 1.55;
    }

    .biz-card__ctas {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-sm);
    }

    .biz-card__cta-link {
      display: inline-flex;
      align-items: center;
      padding: var(--space-xs) var(--space-md);
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--color-accent);
      border: 1px solid var(--color-border-strong);
      border-radius: var(--radius-md);
      text-decoration: none;
      transition: background var(--transition-fast), transform var(--transition-fast);

      &:hover {
        background: var(--color-accent-subtle);
        transform: translateY(-1px);
      }
    }

    .biz-card__cta-link--btn {
      background: none;
      cursor: pointer;
      font-family: inherit;
    }

    .biz-card__footer-row {
      display: flex;
      gap: var(--space-lg);
      align-items: center;
      flex-wrap: wrap;
    }

    .biz-card__qr-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-xs);

      canvas {
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
      }
    }

    .biz-card__qr-label {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    .biz-card__footer-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      flex: 1;
    }

    .biz-card__action-btn {
      padding: var(--space-sm) var(--space-md);
      font-size: var(--text-sm);
      font-weight: 600;
      font-family: inherit;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      color: var(--color-text);
      cursor: pointer;
      transition: border-color var(--transition-fast), color var(--transition-fast);

      &:hover {
        border-color: var(--color-accent);
        color: var(--color-accent);
      }

      &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }
    }

    .business-card--professional {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-lg);
    }

    .business-card--professional .biz-card__avatar {
      border-color: var(--color-border-strong);
    }

    .business-card--modern-ai {
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      border: 1px solid var(--glass-border);
      box-shadow: var(--shadow-lg), var(--shadow-glow);
      animation: biz-card-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), biz-glow 4s ease-in-out infinite;
    }

    .business-card--modern-ai .biz-card__avatar {
      border: 2px solid transparent;
      background: var(--gradient-accent) border-box;
      box-shadow: var(--shadow-glow);
    }

    .business-card--compact {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-card);
    }

    .business-card--compact .biz-card__body {
      padding: var(--space-lg);
      padding-top: calc(var(--space-lg) + var(--space-md));
    }

    .business-card--compact .biz-card__profile {
      margin-bottom: var(--space-lg);
      gap: var(--space-md);
    }

    .business-card--compact .biz-card__avatar {
      width: 4rem;
      height: 4rem;
    }

    .business-card--compact .biz-card__name {
      font-size: var(--text-lg);
    }

    .business-card--compact .biz-card__section {
      margin-bottom: var(--space-lg);
    }

    .business-card--compact .biz-card__help-card {
      padding: var(--space-sm);
    }

    @keyframes biz-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes biz-card-in {
      from {
        opacity: 0;
        transform: translateY(100%);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (min-width: 1024px) {
      @keyframes biz-card-in-desktop {
        from {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.92);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      }
    }

    @keyframes biz-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    @keyframes biz-glow {
      0%, 100% { box-shadow: var(--shadow-lg), var(--shadow-glow); }
      50% { box-shadow: var(--shadow-lg), 0 0 60px color-mix(in srgb, var(--color-accent) 35%, transparent); }
    }

    @media (prefers-reduced-motion: reduce) {
      .biz-card__panel,
      .biz-card__backdrop,
      .business-card--modern-ai {
        animation: none;
      }

      .biz-card__badge-dot {
        animation: none;
      }

      .biz-card__contact-btn:hover,
      .biz-card__cta-link:hover {
        transform: none;
      }
    }
  `,
})
export class BusinessCardComponent {
  private static readonly MIN_SCALE = 0.72;
  private static readonly MOBILE_MAX_WIDTH = 1023;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly nav = inject(NavigationService);
  private readonly router = inject(Router);
  readonly card = inject(BusinessCardService);
  readonly theme = inject(ThemeService);

  readonly profile = this.card.profile;
  readonly config = this.card.config;
  readonly scrollFallback = signal(false);

  private readonly qrCanvas = viewChild<ElementRef<HTMLCanvasElement>>('qrCanvas');
  private readonly qrCanvasMobile = viewChild<ElementRef<HTMLCanvasElement>>('qrCanvasMobile');
  private readonly fitContent = viewChild<ElementRef<HTMLDivElement>>('fitContent');
  private readonly fitViewport = viewChild<ElementRef<HTMLDivElement>>('fitViewport');
  private qrGenerated = false;
  private fitTimer: ReturnType<typeof setTimeout> | null = null;
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    effect(() => {
      if (!this.card.isOpen()) {
        this.qrGenerated = false;
        this.scrollFallback.set(false);
        this.teardownResizeObserver();
        return;
      }
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          void this.generateQr().then(() => this.scheduleFit());
        }, 100);
        setTimeout(() => this.scheduleFit(), 350);
      }
    });

    this.destroyRef.onDestroy(() => {
      if (this.fitTimer) clearTimeout(this.fitTimer);
      this.teardownResizeObserver();
    });
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.scheduleFit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.card.isOpen()) {
      this.card.close();
    }
  }

  panelClasses(): string {
    return `business-card business-card--${this.theme.theme()}`;
  }

  goContact(): void {
    this.card.close();
    this.nav.scrollToSection('contact');
  }

  goWorkWithMe(): void {
    this.card.close();
    this.nav.scrollToSection('work-with-me');
  }

  goResume(): void {
    this.card.close();
    void this.router.navigate(['/resume']);
  }

  private async generateQr(): Promise<void> {
    if (this.qrGenerated) return;

    const canvas = this.qrCanvas()?.nativeElement ?? this.qrCanvasMobile()?.nativeElement;
    if (!canvas) return;

    try {
      const QRCode = await import('qrcode');
      const isMobile = isPlatformBrowser(this.platformId)
        && window.matchMedia(`(max-width: ${BusinessCardComponent.MOBILE_MAX_WIDTH}px)`).matches;
      const qrSize = isMobile ? 96 : 88;
      await QRCode.toCanvas(canvas, this.card.getQrUrl(), { width: qrSize, margin: 1 });
      this.qrGenerated = true;

      const other = this.qrCanvas()?.nativeElement === canvas
        ? this.qrCanvasMobile()?.nativeElement
        : this.qrCanvas()?.nativeElement;
      if (other) {
        const ctx = other.getContext('2d');
        if (ctx) {
          other.width = canvas.width;
          other.height = canvas.height;
          ctx.drawImage(canvas, 0, 0);
        }
      }
    } catch {
      /* QR generation failed silently */
    }
  }

  private ensureResizeObserver(content: HTMLElement): void {
    if (!isPlatformBrowser(this.platformId) || this.resizeObserver) return;

    this.resizeObserver = new ResizeObserver(() => this.scheduleFit());
    this.resizeObserver.observe(content);
  }

  private teardownResizeObserver(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  private scheduleFit(): void {
    if (this.fitTimer) clearTimeout(this.fitTimer);
    this.fitTimer = setTimeout(() => this.fitToViewport(), 80);
  }

  private fitToViewport(): void {
    if (!isPlatformBrowser(this.platformId) || !this.card.isOpen()) return;

    const content = this.fitContent()?.nativeElement;
    const viewport = this.fitViewport()?.nativeElement;
    if (!content || !viewport) return;

    this.ensureResizeObserver(content);

    const isMobile = window.matchMedia(`(max-width: ${BusinessCardComponent.MOBILE_MAX_WIDTH}px)`).matches;

    content.style.transform = 'none';
    viewport.style.width = '';
    viewport.style.height = '';

    if (!isMobile) {
      this.scrollFallback.set(false);
      return;
    }

    const naturalW = content.offsetWidth;
    const naturalH = content.offsetHeight;
    if (!naturalW || !naturalH) return;

    const bodyEl = viewport.closest('.biz-card__body');
    const bodyStyles = bodyEl ? getComputedStyle(bodyEl) : null;
    const paddingY =
      (parseFloat(bodyStyles?.paddingTop ?? '0') || 0) +
      (parseFloat(bodyStyles?.paddingBottom ?? '0') || 0);
    const availW = window.innerWidth - 16;
    const availH = window.innerHeight * 0.94 - paddingY;

    const rawScale = Math.min(1, availW / naturalW, availH / naturalH);
    let scale = rawScale;
    let useScrollFallback = false;

    if (scale < BusinessCardComponent.MIN_SCALE) {
      scale = BusinessCardComponent.MIN_SCALE;
      useScrollFallback = naturalH * scale > availH;
    }

    this.scrollFallback.set(useScrollFallback);

    if (scale < 1) {
      content.style.transform = `scale(${scale})`;
      viewport.style.width = `${Math.ceil(naturalW * scale)}px`;
      viewport.style.height = `${Math.ceil(naturalH * scale)}px`;
    } else {
      viewport.style.width = `${naturalW}px`;
      viewport.style.height = `${naturalH}px`;
    }
  }
}
