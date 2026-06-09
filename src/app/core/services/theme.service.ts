import { Injectable, PLATFORM_ID, inject, signal, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeMode } from '../models/portfolio.models';
import { THEME_STORAGE_KEY } from '../tokens/design-tokens';

const VALID_THEMES: ThemeMode[] = ['professional', 'modern-ai', 'compact'];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly theme = signal<ThemeMode>(this.readStored());
  readonly themes: { id: ThemeMode; label: string; icon: string }[] = [
    { id: 'professional', label: 'Professional', icon: 'briefcase' },
    { id: 'modern-ai', label: 'Modern AI', icon: 'sparkles' },
    { id: 'compact', label: 'Compact', icon: 'layout' },
  ];

  constructor() {
    effect(() => {
      const mode = this.theme();
      if (this.isBrowser) {
        document.documentElement.setAttribute('data-theme', mode);
        localStorage.setItem(THEME_STORAGE_KEY, mode);
      }
    });

    if (this.isBrowser) {
      requestAnimationFrame(() => {
        document.documentElement.classList.add('theme-transition-ready');
      });
    }
  }

  init(): void {
    if (this.isBrowser) {
      document.documentElement.setAttribute('data-theme', this.theme());
    }
  }

  setTheme(mode: ThemeMode): void {
    if (VALID_THEMES.includes(mode)) {
      this.theme.set(mode);
    }
  }

  private readStored(): ThemeMode {
    if (!this.isBrowser) {
      return 'professional';
    }
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    return stored && VALID_THEMES.includes(stored) ? stored : 'professional';
  }
}
