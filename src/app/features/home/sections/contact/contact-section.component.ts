import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioDataService } from '../../../../core/services/portfolio-data.service';
import { UiSectionTitleComponent } from '../../../../shared/ui/section-title/ui-section-title.component';
import { UiInputComponent } from '../../../../shared/ui/input/ui-input.component';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { UiDrawerComponent } from '../../../../shared/ui/drawer/ui-drawer.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { LinkedinIconComponent } from '../../../../shared/social/linkedin-icon.component';

@Component({
  selector: 'app-contact-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    UiSectionTitleComponent,
    UiInputComponent,
    UiButtonComponent,
    UiDrawerComponent,
    ScrollRevealDirective,
    LinkedinIconComponent,
  ],
  template: `
    <section id="contact" class="section" aria-labelledby="contact-heading">
      <div class="section__inner">
        <ui-section-title
          eyebrow="Contact"
          heading="Let's connect"
          subtitle="Reach out for opportunities, collaborations, or just a conversation."
          sectionId="contact-heading"
        />

        <p class="contact__intro">
          Explore my technical implementations, practical projects, and continuous learning journey on GitHub.
        </p>

        <div class="contact__grid" appScrollReveal>
          <form class="contact__form" [formGroup]="form" (ngSubmit)="onSubmit()">
            <ui-input
              label="Name"
              placeholder="Your name"
              formControlName="name"
              [error]="fieldError('name')"
            />
            <ui-input
              label="Email"
              type="email"
              placeholder="you@email.com"
              formControlName="email"
              [error]="fieldError('email')"
            />
            <ui-input
              label="Subject"
              placeholder="What would you like to discuss?"
              formControlName="subject"
              [error]="fieldError('subject')"
            />
            <ui-input
              label="Message"
              placeholder="Your message..."
              [multiline]="true"
              [rows]="5"
              formControlName="message"
              [error]="fieldError('message')"
            />
            <ui-button type="submit" [loading]="submitting()" [disabled]="form.invalid">
              Send Message
            </ui-button>
          </form>

          <div class="contact__info">
            @if (profile(); as p) {
              <h3>Direct links</h3>

              @if (p.github) {
                <div class="contact__link-item">
                  <span class="contact__link-label">GitHub</span>
                  <a [href]="p.github" target="_blank" rel="noopener noreferrer" class="contact__link-value">
                    github.com/umeshwaghmaretech
                  </a>
                </div>
              }

              <div class="contact__link-item">
                <span class="contact__link-label contact__link-label--icon">
                  <linkedin-icon [size]="14" />
                  LinkedIn
                </span>
                <a [href]="p.linkedIn" target="_blank" rel="noopener" class="contact__link-value">
                  linkedin.com/in/umesh-waghmare
                </a>
              </div>

              <div class="contact__link-item">
                <span class="contact__link-label">Email</span>
                <a [href]="'mailto:' + p.email" class="contact__link-value">{{ p.email }}</a>
              </div>

              @if (p.phone) {
                <div class="contact__link-item">
                  <span class="contact__link-label">Phone</span>
                  <a [href]="'tel:' + p.phone.replace(/\s/g, '')" class="contact__link-value">{{ p.phone }}</a>
                </div>
              }

              @if (p.location) {
                <div class="contact__link-item">
                  <span class="contact__link-label">Location</span>
                  <span class="contact__link-value contact__link-value--text">{{ p.location }}</span>
                </div>
              }
            }
          </div>
        </div>
      </div>
    </section>

    <ui-drawer [open]="successOpen()" title="Message Ready" (close)="successOpen.set(false)">
      <p>Your email client will open with a pre-filled message. Click send in your mail app to complete.</p>
    </ui-drawer>
  `,
  styles: `
    :host {
      display: block;
      background: var(--color-bg-subtle);
    }

    .contact__intro {
      font-size: var(--text-base);
      color: var(--color-text-muted);
      max-width: 42rem;
      margin: 0 0 var(--space-xl);
      line-height: 1.6;
    }

    .contact__grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-2xl);
    }

    @media (min-width: 768px) {
      .contact__grid {
        grid-template-columns: 2fr 1fr;
      }
    }

    .contact__form {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      padding: var(--space-xl);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);

      &:has(:invalid:not(:placeholder-shown)) {
        border-color: color-mix(in srgb, var(--color-error) 30%, var(--color-border));
      }
    }

    .contact__info {
      h3 {
        font-size: var(--text-lg);
        margin-bottom: var(--space-lg);
      }
    }

    .contact__link-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      padding: var(--space-md);
      margin-bottom: var(--space-sm);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      transition: border-color var(--transition-fast);

      &:hover {
        border-color: var(--color-accent);
      }
    }

    .contact__link-label {
      font-size: var(--text-xs);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-muted);
    }

    .contact__link-label--icon {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      color: #0a66c2;
    }

    .contact__link-value {
      color: var(--color-accent);
      font-size: var(--text-sm);
      font-weight: 500;
      text-decoration: none;
      word-break: break-all;

      &:hover {
        text-decoration: underline;
        color: var(--color-accent-hover);
      }
    }

    .contact__link-value--text {
      color: var(--color-text);
      cursor: default;

      &:hover {
        text-decoration: none;
      }
    }
  `,
})
export class ContactSectionComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dataService = inject(PortfolioDataService);

  readonly profile = this.dataService.profile;
  readonly submitting = signal(false);
  readonly successOpen = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  fieldError(field: string): string | null {
    const control = this.form.get(field);
    if (!control?.touched || !control.errors) return null;
    if (control.errors['required']) return 'This field is required';
    if (control.errors['email']) return 'Enter a valid email';
    if (control.errors['minlength']) return 'Too short';
    return 'Invalid value';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const { name, email, subject, message } = this.form.getRawValue();
    const to = this.profile()?.email ?? 'umeshdwaghmare@gmail.com';
    const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
    const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`;

    window.location.href = mailto;
    this.successOpen.set(true);
    this.submitting.set(false);
    this.form.reset();
  }
}
