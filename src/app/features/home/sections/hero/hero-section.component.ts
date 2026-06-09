import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { PortfolioDataService } from '../../../../core/services/portfolio-data.service';
import { NavigationService } from '../../../../core/services/navigation.service';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { UiSkeletonComponent } from '../../../../shared/ui/skeleton/ui-skeleton.component';
import { GithubLinkButtonComponent } from '../../../../shared/github/github-link-button.component';
import { BusinessCardService } from '../../../../core/services/business-card.service';

@Component({
  selector: 'app-hero-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, UiButtonComponent, UiSkeletonComponent, GithubLinkButtonComponent],
  template: `
    <section id="hero" class="hero section" aria-labelledby="hero-heading">
      <div class="hero__bg" aria-hidden="true"></div>
      <div class="hero__inner">
        @if (data.loading()) {
          <ui-skeleton width="200px" height="1rem" />
          <ui-skeleton width="60%" height="3rem" />
          <ui-skeleton width="80%" height="1.5rem" />
        } @else if (profile(); as p) {
          <div class="hero__layout">
            <div class="hero__content">
              <span class="hero__eyebrow">Available for opportunities</span>
              <h1 id="hero-heading" class="hero__title">
                Hi, I'm
                <button
                  type="button"
                  class="hero__name hero__name--interactive"
                  (click)="openBusinessCard()"
                  aria-label="Open digital business card for {{ p.name }}"
                >
                  {{ p.name }}
                </button>
              </h1>
              <p class="hero__role">{{ p.title }}</p>
              <p class="hero__summary">{{ p.summary }}</p>
              <div class="hero__actions">
                <ui-button (clicked)="viewResume()">View Resume</ui-button>
                <ui-button variant="outline" (clicked)="goContact()">Contact Me</ui-button>
                <ui-button variant="ghost" (clicked)="goProjects()">Explore Work</ui-button>
              </div>
              <div class="hero__actions hero__actions--secondary">
                @if (p.github) {
                  <github-link-button [href]="p.github" label="GitHub" variant="glass" />
                }
                <ui-button variant="outline" (clicked)="goWorkWithMe()">Let's Collaborate</ui-button>
              </div>
            </div>
            @if (p.profileImageUrl) {
              <button
                type="button"
                class="hero__photo-wrap"
                (click)="openBusinessCard()"
                aria-label="Open digital business card"
              >
                <img
                  [ngSrc]="p.profileImageUrl"
                  [alt]="p.name + ' professional headshot'"
                  width="320"
                  height="320"
                  priority
                  class="hero__photo"
                />
              </button>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .hero {
      position: relative;
      min-height: 100dvh;
      display: flex;
      align-items: center;
      overflow: hidden;
      padding-block: var(--space-section);
    }

    .hero__bg {
      position: absolute;
      inset: 0;
      background: var(--gradient-hero);
      z-index: -1;

      &::before,
      &::after {
        content: '';
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        animation: float 8s ease-in-out infinite;
      }

      &::before {
        width: 400px;
        height: 400px;
        top: 10%;
        right: 10%;
        background: color-mix(in srgb, var(--color-accent) 20%, transparent);
      }

      &::after {
        width: 300px;
        height: 300px;
        bottom: 20%;
        left: 5%;
        background: color-mix(in srgb, var(--color-accent) 15%, transparent);
        animation-delay: -4s;
      }
    }

    .hero__inner {
      max-width: var(--container-wide);
      margin-inline: auto;
      padding-inline: var(--space-lg);
      width: 100%;
    }

    .hero__layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-2xl);
      align-items: center;
    }

    @media (min-width: 768px) {
      .hero__layout {
        grid-template-columns: 1fr auto;
      }
    }

    .hero__photo-wrap {
      display: flex;
      justify-content: center;
      order: -1;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      border-radius: var(--radius-xl);
      transition: transform var(--transition-fast);

      &:hover {
        transform: scale(1.02);
      }

      &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 4px;
      }
    }

    @media (min-width: 768px) {
      .hero__photo-wrap {
        order: 1;
      }
    }

    .hero__photo {
      width: min(280px, 70vw);
      height: min(280px, 70vw);
      object-fit: cover;
      border-radius: var(--radius-xl);
      border: 3px solid var(--color-border);
      box-shadow: var(--shadow-lg), var(--shadow-glow);
      animation: fade-up 0.8s ease 0.2s both;
    }

    .hero__eyebrow {
      display: inline-block;
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--color-accent);
      margin-bottom: var(--space-md);
      animation: fade-up 0.6s ease both;
    }

    .hero__title {
      font-size: var(--text-4xl);
      margin-bottom: var(--space-md);
      animation: fade-up 0.6s ease 0.1s both;
    }

    .hero__name {
      background: var(--gradient-accent);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero__name--interactive {
      border: none;
      padding: 0;
      margin: 0;
      font: inherit;
      cursor: pointer;
      display: inline;
      transition: opacity var(--transition-fast);

      &:hover {
        opacity: 0.85;
      }

      &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 4px;
        border-radius: var(--radius-sm);
      }
    }

    .hero__role {
      font-size: var(--text-xl);
      color: var(--color-text-muted);
      margin-bottom: var(--space-md);
      animation: fade-up 0.6s ease 0.2s both;
    }

    .hero__summary {
      font-size: var(--text-lg);
      color: var(--color-text-muted);
      max-width: 36rem;
      margin-bottom: var(--space-xl);
      animation: fade-up 0.6s ease 0.3s both;
    }

    .hero__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-md);
      animation: fade-up 0.6s ease 0.4s both;
    }

    .hero__actions--secondary {
      margin-top: var(--space-sm);
      animation-delay: 0.5s;
    }

    @keyframes fade-up {
      from {
        opacity: 0;
        transform: translateY(1rem);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes float {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-20px);
      }
    }
  `,
})
export class HeroSectionComponent {
  private readonly dataService = inject(PortfolioDataService);
  private readonly nav = inject(NavigationService);
  private readonly router = inject(Router);
  private readonly businessCard = inject(BusinessCardService);

  readonly data = this.dataService;
  readonly profile = this.dataService.profile;

  openBusinessCard(): void {
    this.businessCard.open();
  }

  viewResume(): void {
    void this.router.navigate(['/resume']);
  }

  goContact(): void {
    this.nav.scrollToSection('contact');
  }

  goProjects(): void {
    this.nav.scrollToSection('projects');
  }

  goWorkWithMe(): void {
    this.nav.scrollToSection('work-with-me');
  }
}
