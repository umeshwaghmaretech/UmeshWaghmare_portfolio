import {
  ChangeDetectionStrategy,
  Component,
  inject,
  afterNextRender,
  viewChild,
} from '@angular/core';
import { ScrollSpyService } from '../../core/services/scroll-spy.service';
import { SectionOrderService } from '../../core/services/section-order.service';
import { HeroSectionComponent } from './sections/hero/hero-section.component';
import { AboutSectionComponent } from './sections/about/about-section.component';
import { SkillsSectionComponent } from './sections/skills/skills-section.component';
import { ExperienceSectionComponent } from './sections/experience/experience-section.component';
import { ProjectsSectionComponent } from './sections/projects/projects-section.component';
import { GithubSectionComponent } from './sections/github/github-section.component';
import { WorkWithMeSectionComponent } from './sections/work-with-me/work-with-me-section.component';
import { CertificationsSectionComponent } from './sections/certifications/certifications-section.component';
import { ContactSectionComponent } from './sections/contact/contact-section.component';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { CommandPaletteComponent } from '../../layout/command-palette/command-palette.component';
import { AiAssistantPanelComponent } from '../../layout/ai-assistant-panel/ai-assistant-panel.component';
import { FloatingActionButtonComponent } from '../../layout/floating-action-button/floating-action-button.component';
import { BusinessCardComponent } from '../../layout/business-card/business-card.component';

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeroSectionComponent,
    AboutSectionComponent,
    SkillsSectionComponent,
    ExperienceSectionComponent,
    ProjectsSectionComponent,
    GithubSectionComponent,
    WorkWithMeSectionComponent,
    CertificationsSectionComponent,
    ContactSectionComponent,
    HeaderComponent,
    FooterComponent,
    CommandPaletteComponent,
    AiAssistantPanelComponent,
    FloatingActionButtonComponent,
    BusinessCardComponent,
  ],
  template: `
    <a class="skip-link" href="#hero">Skip to content</a>

    <app-header (openCommandPalette)="commandPalette.toggle()" />

    <div id="portfolio-export-root">
      <main id="main-content">
        <app-hero-section />

        <div class="sections-list">
        @for (sectionId of sectionOrder.order(); track sectionId) {
          <div class="section-drag">
            @switch (sectionId) {
              @case ('about') {
                @defer (on viewport) {
                  <app-about-section />
                } @placeholder {
                  <div [id]="sectionId" class="defer-placeholder section" aria-hidden="true"></div>
                }
              }
              @case ('skills') {
                @defer (on viewport) {
                  <app-skills-section />
                } @placeholder {
                  <div [id]="sectionId" class="defer-placeholder section" aria-hidden="true"></div>
                }
              }
              @case ('experience') {
                @defer (on viewport) {
                  <app-experience-section />
                } @placeholder {
                  <div [id]="sectionId" class="defer-placeholder section" aria-hidden="true"></div>
                }
              }
              @case ('projects') {
                @defer (on viewport) {
                  <app-projects-section />
                } @placeholder {
                  <div [id]="sectionId" class="defer-placeholder section" aria-hidden="true"></div>
                }
              }
              @case ('github') {
                @defer (on viewport) {
                  <app-github-section />
                } @placeholder {
                  <div [id]="sectionId" class="defer-placeholder section" aria-hidden="true"></div>
                }
              }
              @case ('work-with-me') {
                @defer (on viewport) {
                  <app-work-with-me-section />
                } @placeholder {
                  <div [id]="sectionId" class="defer-placeholder section" aria-hidden="true"></div>
                }
              }
              @case ('certifications') {
                @defer (on viewport) {
                  <app-certifications-section />
                } @placeholder {
                  <div [id]="sectionId" class="defer-placeholder section" aria-hidden="true"></div>
                }
              }
              @case ('contact') {
                @defer (on viewport) {
                  <app-contact-section />
                } @placeholder {
                  <div [id]="sectionId" class="defer-placeholder section" aria-hidden="true"></div>
                }
              }
            }
          </div>
        }
      </div>
    </main>

    <app-footer />
    </div>
    <app-business-card />
    <app-command-palette #commandPalette />
    <app-ai-assistant-panel />
    <app-floating-action-button />
  `,
  styles: `
    .sections-list {
      display: flex;
      flex-direction: column;
    }

    .defer-placeholder {
      min-height: 200px;
      background: var(--color-bg-muted);
      margin: var(--space-lg);
      border-radius: var(--radius-lg);
      animation: shimmer 1.5s infinite;
      background-size: 200% 100%;
      background-image: linear-gradient(
        90deg,
        var(--color-bg-muted) 25%,
        var(--color-bg-subtle) 50%,
        var(--color-bg-muted) 75%
      );
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `,
})
export class HomePage {
  readonly scrollSpy = inject(ScrollSpyService);
  readonly sectionOrder = inject(SectionOrderService);
  readonly commandPalette = viewChild.required<CommandPaletteComponent>('commandPalette');

  constructor() {
    afterNextRender(() => {
      this.scrollSpy.init();
      this.scrollSpy.attachToPage();
    });
  }
}
