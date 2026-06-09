import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioDataService } from '../../../../core/services/portfolio-data.service';
import { NavigationService } from '../../../../core/services/navigation.service';
import { UiSectionTitleComponent } from '../../../../shared/ui/section-title/ui-section-title.component';
import { UiCardComponent } from '../../../../shared/ui/card/ui-card.component';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { GithubLinkButtonComponent } from '../../../../shared/github/github-link-button.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-work-with-me-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiSectionTitleComponent,
    UiCardComponent,
    UiButtonComponent,
    GithubLinkButtonComponent,
    ScrollRevealDirective,
  ],
  template: `
    <section id="work-with-me" class="section" aria-labelledby="work-with-me-heading">
      <div class="section__inner">
        <ui-section-title
          eyebrow="Collaboration"
          heading="Open to Business Analysis, Product & IT Collaboration"
          subtitle="Freelance engagements, BA consulting, Agile delivery support, and product-minded technical partnerships."
          sectionId="work-with-me-heading"
        />

        <ui-card variant="elevated" class="wwm-card" appScrollReveal>
          <div class="wwm-card__content">
            <p class="wwm-card__desc">
              I bring together full-stack .NET development, Angular front-end expertise, and
              business analysis skills to help teams translate requirements into working software.
              Whether you need a freelance developer, a BA consultant for discovery and documentation,
              or a collaborator on Agile product delivery — let's connect.
            </p>
            <ul class="wwm-card__list">
              <li>Business analysis & requirements engineering</li>
              <li>Full-stack .NET + Angular development</li>
              <li>Agile / Scrum delivery support</li>
              <li>Product thinking & technical documentation</li>
            </ul>
            <div class="wwm-card__actions">
              <ui-button (clicked)="goContact()">Let's Build Something Together</ui-button>
              @if (profile()?.github; as gh) {
                <github-link-button [href]="gh" label="Explore My GitHub" variant="outline" />
              }
            </div>
          </div>
        </ui-card>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
      background: var(--color-bg-subtle);
    }

    .wwm-card {
      max-width: 48rem;
      margin-inline: auto;
    }

    .wwm-card__content {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .wwm-card__desc {
      font-size: var(--text-lg);
      color: var(--color-text-muted);
      margin: 0;
      line-height: 1.7;
    }

    .wwm-card__list {
      margin: 0;
      padding-left: var(--space-lg);
      color: var(--color-text-muted);
      font-size: var(--text-base);

      li {
        margin-bottom: var(--space-xs);

        &::marker {
          color: var(--color-accent);
        }
      }
    }

    .wwm-card__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-md);
      margin-top: var(--space-sm);
    }
  `,
})
export class WorkWithMeSectionComponent {
  private readonly data = inject(PortfolioDataService);
  private readonly nav = inject(NavigationService);

  readonly profile = this.data.profile;

  goContact(): void {
    this.nav.scrollToSection('contact');
  }
}
