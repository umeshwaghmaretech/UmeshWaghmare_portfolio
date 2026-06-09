import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { NavigationService } from '../../core/services/navigation.service';
import { PdfExportFacadeService } from '../../core/services/pdf/pdf-export.facade';
import { GithubIconComponent } from '../../shared/github/github-icon.component';
import { LinkedinIconComponent } from '../../shared/social/linkedin-icon.component';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GithubIconComponent, LinkedinIconComponent],
  template: `
    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__columns">
          <div class="footer__col">
            <h3>Quick Links</h3>
            <nav aria-label="Footer quick links">
              <a href="#hero" (click)="onNav($event, 'hero')">Home</a>
              <a href="#projects" (click)="onNav($event, 'projects')">Projects</a>
              <a href="#contact" (click)="onNav($event, 'contact')">Contact</a>
              <a href="#work-with-me" (click)="onNav($event, 'work-with-me')">Work With Me</a>
            </nav>
          </div>

          <div class="footer__col">
            <h3>Connect</h3>
            @if (profile(); as p) {
              <nav aria-label="Footer connect links">
                @if (p.github) {
                  <a [href]="p.github" target="_blank" rel="noopener noreferrer" class="footer__social footer__github">
                    <github-icon [size]="16" />
                    GitHub
                  </a>
                }
                <a [href]="p.linkedIn" target="_blank" rel="noopener noreferrer" class="footer__social">
                  <linkedin-icon [size]="16" />
                  LinkedIn
                </a>
                <a [href]="'mailto:' + p.email">{{ p.email }}</a>
              </nav>
            }
          </div>

          <div class="footer__col">
            <h3>Resume</h3>
            <nav aria-label="Footer resume links">
              <a href="/resume" (click)="viewOnline($event)">View Online</a>
              <button type="button" class="footer__link-btn" (click)="downloadPdf()">Download PDF</button>
            </nav>
          </div>
        </div>

        <p class="footer__copy">&copy; {{ year }} {{ profile()?.name ?? 'Umesh Waghmare' }}. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: `
    .footer {
      padding: var(--space-2xl) var(--space-lg);
      border-top: 1px solid var(--color-border);
      background: var(--color-bg-subtle);
    }

    .footer__inner {
      max-width: var(--container-wide);
      margin-inline: auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-2xl);
    }

    .footer__columns {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-xl);
    }

    @media (min-width: 640px) {
      .footer__columns {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .footer__col {
      h3 {
        font-size: var(--text-sm);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-text-muted);
        margin: 0 0 var(--space-md);
      }

      nav {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
      }

      a {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--color-text);
        text-decoration: none;

        &:hover {
          color: var(--color-accent);
        }
      }
    }

    .footer__github {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .footer__social {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .footer__link-btn {
      padding: 0;
      border: none;
      background: none;
      font: inherit;
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--color-text);
      text-align: left;
      cursor: pointer;

      &:hover {
        color: var(--color-accent);
      }
    }

    .footer__copy {
      margin: 0;
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      text-align: center;
      padding-top: var(--space-lg);
      border-top: 1px solid var(--color-border);
    }
  `,
})
export class FooterComponent {
  private readonly data = inject(PortfolioDataService);
  private readonly nav = inject(NavigationService);
  private readonly router = inject(Router);
  private readonly pdfExport = inject(PdfExportFacadeService);

  readonly profile = this.data.profile;
  readonly year = new Date().getFullYear();

  onNav(event: Event, sectionId: string): void {
    event.preventDefault();
    this.nav.scrollToSection(sectionId);
  }

  viewOnline(event: Event): void {
    event.preventDefault();
    void this.router.navigate(['/resume']);
  }

  downloadPdf(): void {
    void this.pdfExport.downloadPdf();
  }
}
