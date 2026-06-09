import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SECTION_ORDER_KEY } from '../tokens/design-tokens';

export type SectionId =
  | 'about'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'github'
  | 'work-with-me'
  | 'certifications'
  | 'contact';

const DEFAULT_ORDER: SectionId[] = [
  'about',
  'skills',
  'experience',
  'projects',
  'github',
  'certifications',
  'contact',
  'work-with-me',
];

@Injectable({ providedIn: 'root' })
export class SectionOrderService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly customizeMode = signal(false);
  readonly order = signal<SectionId[]>(this.readOrder());

  toggleCustomize(): void {
    this.customizeMode.update((v) => !v);
  }

  reorder(previousIndex: number, currentIndex: number): void {
    this.order.update((items) => {
      const next = [...items];
      const [moved] = next.splice(previousIndex, 1);
      next.splice(currentIndex, 0, moved);
      this.persist(next);
      return next;
    });
  }

  reset(): void {
    this.order.set([...DEFAULT_ORDER]);
    this.persist(DEFAULT_ORDER);
  }

  private readOrder(): SectionId[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [...DEFAULT_ORDER];
    }
    try {
      const stored = localStorage.getItem(SECTION_ORDER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SectionId[];
        if (parsed.length === DEFAULT_ORDER.length) return parsed;
      }
    } catch {
      /* use default */
    }
    return [...DEFAULT_ORDER];
  }

  private persist(order: SectionId[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(SECTION_ORDER_KEY, JSON.stringify(order));
    }
  }
}
