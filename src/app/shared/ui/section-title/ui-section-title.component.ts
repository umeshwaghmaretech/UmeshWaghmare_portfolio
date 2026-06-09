import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-section-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ui-section-title">
      @if (eyebrow()) {
        <span class="ui-section-title__eyebrow">{{ eyebrow() }}</span>
      }
      <h2 [id]="sectionId()">{{ heading() }}</h2>
      @if (subtitle()) {
        <p class="ui-section-title__subtitle">{{ subtitle() }}</p>
      }
    </div>
  `,
  styles: `
    .ui-section-title {
      margin-bottom: var(--space-2xl);
      max-width: 40rem;
    }

    .ui-section-title__eyebrow {
      display: inline-block;
      font-size: var(--text-sm);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-accent);
      margin-bottom: var(--space-sm);
    }

    h2 {
      font-size: var(--text-3xl);
      animation: fade-up 0.6s ease both;
      animation-timeline: view();
      animation-range: entry 0% cover 30%;
    }

    .ui-section-title__subtitle {
      margin-top: var(--space-md);
      font-size: var(--text-lg);
      color: var(--color-text-muted);
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
  `,
})
export class UiSectionTitleComponent {
  readonly eyebrow = input<string>('');
  readonly heading = input.required<string>();
  readonly subtitle = input<string>('');
  readonly sectionId = input<string>('');
}
