import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CareerMilestone } from '../../../core/models/portfolio.models';

@Component({
  selector: 'app-career-bar-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="career-chart" role="img" [attr.aria-label]="ariaLabel()">
      @for (item of items(); track item.id) {
        <div class="career-chart__row">
          <div class="career-chart__label">
            <span class="career-chart__phase">{{ item.phase }}</span>
            <strong>{{ item.title }}</strong>
            <span class="career-chart__period">{{ item.period }}</span>
          </div>
          <div class="career-chart__bar-track">
            <div
              class="career-chart__bar"
              [style.--progress]="item.progress + '%'"
            ></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .career-chart {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .career-chart__row {
      display: grid;
      grid-template-columns: minmax(140px, 1fr) 2fr;
      gap: var(--space-md);
      align-items: center;
    }

    .career-chart__label {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);

      strong {
        font-size: var(--text-base);
      }
    }

    .career-chart__phase {
      font-size: var(--text-xs);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--color-accent);
    }

    .career-chart__period {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
    }

    .career-chart__bar-track {
      height: 0.5rem;
      background: var(--color-bg-muted);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    @property --progress {
      syntax: '<percentage>';
      inherits: false;
      initial-value: 0%;
    }

    .career-chart__bar {
      height: 100%;
      width: var(--progress);
      background: var(--gradient-accent);
      border-radius: var(--radius-full);
      transition: width 1s ease;
      animation: grow-bar 1s ease forwards;
    }

    @keyframes grow-bar {
      from {
        width: 0%;
      }
      to {
        width: var(--progress);
      }
    }

    @container (max-width: 480px) {
      .career-chart__row {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class CareerBarChartComponent {
  readonly items = input.required<CareerMilestone[]>();

  readonly ariaLabel = computed(
    () => `Career progression chart with ${this.items().length} phases`,
  );
}
