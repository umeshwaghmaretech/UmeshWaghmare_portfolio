import {
  Injectable,
  PLATFORM_ID,
  inject,
  signal,
  computed,
  effect,
  DestroyRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PortfolioDataService } from './portfolio-data.service';
import { BusinessCardConfig, CopyFeedback } from '../models/business-card.models';

@Injectable({ providedIn: 'root' })
export class BusinessCardService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private readonly data = inject(PortfolioDataService);
  private readonly destroyRef = inject(DestroyRef);
  private feedbackTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly isOpenSignal = signal(false);
  private readonly configSignal = signal<BusinessCardConfig | null>(null);
  private readonly configLoadedSignal = signal(false);
  private readonly copyFeedbackSignal = signal<CopyFeedback>(null);

  readonly isOpen = computed(() => this.isOpenSignal());
  readonly config = computed(() => this.configSignal());
  readonly copyFeedback = computed(() => this.copyFeedbackSignal());
  readonly profile = this.data.profile;

  constructor() {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        document.body.style.overflow = this.isOpenSignal() ? 'hidden' : '';
      }
    });

    this.destroyRef.onDestroy(() => {
      if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
      if (isPlatformBrowser(this.platformId)) {
        document.body.style.overflow = '';
      }
    });
  }

  open(): void {
    this.loadConfig();
    this.isOpenSignal.set(true);
  }

  close(): void {
    this.isOpenSignal.set(false);
  }

  toggle(): void {
    if (this.isOpenSignal()) {
      this.close();
    } else {
      this.open();
    }
  }

  loadConfig(): void {
    if (this.configLoadedSignal()) return;

    this.http.get<BusinessCardConfig>('assets/data/business-card.config.json').subscribe({
      next: (config) => {
        this.configSignal.set(config);
        this.configLoadedSignal.set(true);
      },
      error: () => {
        this.configSignal.set({
          cardTitle: 'Full Stack Developer | Angular | .NET | Azure | Deployment',
          tagline: 'Building scalable web applications from idea to production deployment.',
          availability: 'Open to Freelance & Collaboration',
          helpHeading: 'How I Can Help',
          helpItems: [],
          portfolioUrl: 'https://github.com/umeshwaghmaretech',
          qrTargetUrl: '/',
        });
        this.configLoadedSignal.set(true);
      },
    });
  }

  async copyEmail(): Promise<void> {
    const email = this.profile()?.email;
    if (!email || !isPlatformBrowser(this.platformId)) return;

    try {
      await navigator.clipboard.writeText(email);
      this.showFeedback('email');
    } catch {
      /* clipboard unavailable */
    }
  }

  async shareProfile(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const url = window.location.origin + (this.config()?.qrTargetUrl ?? '/');
    const p = this.profile();

    if (navigator.share) {
      try {
        await navigator.share({
          title: p?.name ?? 'Umesh Waghmare',
          text: this.config()?.tagline ?? '',
          url,
        });
        return;
      } catch {
        /* user cancelled or share failed */
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      this.showFeedback('url');
    } catch {
      /* clipboard unavailable */
    }
  }

  downloadVCard(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const p = this.profile();
    const cfg = this.configSignal();
    if (!p) return;

    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${p.name}`,
      `TITLE:${cfg?.cardTitle ?? p.title}`,
      `EMAIL:${p.email}`,
      p.phone ? `TEL:${p.phone.replace(/\s/g, '')}` : '',
      p.linkedIn ? `URL:${p.linkedIn}` : '',
      p.github ? `URL:${p.github}` : '',
      `NOTE:${cfg?.tagline ?? p.summary}`,
      'END:VCARD',
    ].filter(Boolean);

    const blob = new Blob([lines.join('\r\n')], { type: 'text/vcard;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${p.name.replace(/\s+/g, '_')}.vcf`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  getQrUrl(): string {
    if (!isPlatformBrowser(this.platformId)) return '';
    const path = this.config()?.qrTargetUrl ?? '/';
    return window.location.origin + path;
  }

  private showFeedback(type: CopyFeedback): void {
    this.copyFeedbackSignal.set(type);
    if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
    this.feedbackTimer = setTimeout(() => this.copyFeedbackSignal.set(null), 2000);
  }
}
