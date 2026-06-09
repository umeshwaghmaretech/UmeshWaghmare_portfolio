import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { DEFAULT_SECTIONS } from '../models/portfolio.models';
import { ScrollSpyService } from './scroll-spy.service';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly router = inject(Router);
  private readonly scrollSpy = inject(ScrollSpyService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly sections = DEFAULT_SECTIONS;

  scrollToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (!this.isHomeRoute()) {
      void this.router.navigate(['/'], { fragment: sectionId }).then(() => {
        setTimeout(() => this.scrollToSectionInternal(sectionId), 150);
      });
      return;
    }

    this.scrollToSectionInternal(sectionId);
  }

  navigateTo(href: string): void {
    if (href.startsWith('#')) {
      this.scrollToSection(href.slice(1));
    } else if (href.startsWith('/')) {
      void this.router.navigateByUrl(href);
    } else {
      window.open(href, '_blank', 'noopener');
    }
  }

  private isHomeRoute(): boolean {
    const path = this.router.url.split('?')[0].split('#')[0];
    return path === '/' || path === '';
  }

  private scrollToSectionInternal(sectionId: string): void {
    this.scrollSpy.activeSection.set(sectionId);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = reducedMotion ? 'auto' : 'smooth';

    const doScroll = (): boolean => {
      const el = document.getElementById(sectionId);
      if (!el) return false;

      el.scrollIntoView({ behavior, block: 'start' });
      history.replaceState(null, '', `#${sectionId}`);
      this.scrollSpy.refreshObservations();
      return true;
    };

    const scheduleFollowUp = (): void => {
      for (const delay of [300, 700]) {
        setTimeout(() => {
          doScroll();
          this.scrollSpy.refreshObservations();
        }, delay);
      }
    };

    if (doScroll()) {
      scheduleFollowUp();
      return;
    }

    let attempts = 0;
    const retry = (): void => {
      if (doScroll()) {
        scheduleFollowUp();
        return;
      }
      if (++attempts >= 10) {
        void this.router.navigate(['/'], { fragment: sectionId });
        return;
      }
      setTimeout(retry, 100);
    };
    retry();
  }
}
