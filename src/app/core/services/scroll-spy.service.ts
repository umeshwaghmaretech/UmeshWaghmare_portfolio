import { Injectable, PLATFORM_ID, inject, signal, DestroyRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DEFAULT_SECTIONS } from '../models/portfolio.models';

const SECTION_IDS = [
  ...DEFAULT_SECTIONS.filter((s) => !s.external).map((s) => s.id),
  'github',
];

@Injectable({ providedIn: 'root' })
export class ScrollSpyService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private observer: IntersectionObserver | null = null;
  private mutationObserver: MutationObserver | null = null;
  private readonly observedElements = new Map<string, Element>();
  private readonly intersecting = new Map<string, IntersectionObserverEntry>();
  private initialized = false;

  readonly activeSection = signal('hero');
  readonly scrolled = signal(false);
  readonly headerCompact = signal(false);

  init(): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) {
      return;
    }
    this.initialized = true;

    const onScroll = (): void => {
      this.scrolled.set(window.scrollY > 20);
      this.headerCompact.set(window.scrollY > 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (!id) continue;
          if (entry.isIntersecting) {
            this.intersecting.set(id, entry);
          } else {
            this.intersecting.delete(id);
          }
        }
        this.updateActiveSection();
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', onScroll);
      this.observer?.disconnect();
      this.mutationObserver?.disconnect();
      this.observedElements.clear();
      this.intersecting.clear();
    });

    this.attachToPage();
  }

  attachToPage(): void {
    if (!isPlatformBrowser(this.platformId) || !this.observer) {
      return;
    }

    for (const [id, el] of this.observedElements) {
      if (!el.isConnected) {
        this.observer.unobserve(el);
        this.observedElements.delete(id);
        this.intersecting.delete(id);
      }
    }

    this.mutationObserver?.disconnect();
    const main = document.getElementById('main-content');
    if (main) {
      this.mutationObserver = new MutationObserver(() => {
        this.refreshObservations();
      });
      this.mutationObserver.observe(main, { childList: true, subtree: true });
    }

    this.refreshObservations();
  }

  refreshObservations(): void {
    if (!this.observer) return;

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (!el) continue;

      const prev = this.observedElements.get(id);
      if (prev === el) continue;

      if (prev) {
        this.observer.unobserve(prev);
        this.intersecting.delete(id);
      }

      this.observer.observe(el);
      this.observedElements.set(id, el);
    }
  }

  private updateActiveSection(): void {
    if (this.intersecting.size === 0) return;

    const headerOffset =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
        10,
      ) || 64;

    let bestId: string | null = null;
    let bestDistance = Infinity;

    for (const [id, entry] of this.intersecting) {
      const top = entry.boundingClientRect.top - headerOffset;
      const distance = Math.abs(top);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestId = id;
      }
    }

    if (bestId) {
      this.activeSection.set(bestId);
    }
  }
}
