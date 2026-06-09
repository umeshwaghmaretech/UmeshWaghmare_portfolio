import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { SkillCategory } from '../../../core/models/portfolio.models';
import { CHART_COLORS } from '../../../core/tokens/design-tokens';

@Component({
  selector: 'app-skill-radar-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg [attr.viewBox]="'0 0 ' + size + ' ' + size" class="radar-chart" role="img" [attr.aria-label]="ariaLabel()">
      @for (ring of rings; track ring) {
        <polygon [attr.points]="ringPoints(ring)" class="radar-chart__ring" />
      }
      @for (line of axisLines(); track line.index) {
        <line
          [attr.x1]="center"
          [attr.y1]="center"
          [attr.x2]="line.x"
          [attr.y2]="line.y"
          class="radar-chart__axis"
        />
      }
      <polygon [attr.points]="dataPoints()" class="radar-chart__data" />
      @for (label of labels(); track label.index) {
        <text
          [attr.x]="label.x"
          [attr.y]="label.y"
          class="radar-chart__label"
          text-anchor="middle"
        >
          {{ label.text }}
        </text>
      }
    </svg>
  `,
  styles: `
    .radar-chart {
      width: 100%;
      max-width: 320px;
      height: auto;
    }

    .radar-chart__ring {
      fill: none;
      stroke: var(--color-border);
      stroke-width: 1;
    }

    .radar-chart__axis {
      stroke: var(--color-border);
      stroke-width: 1;
    }

    .radar-chart__data {
      fill: color-mix(in srgb, var(--color-accent) 25%, transparent);
      stroke: var(--color-accent);
      stroke-width: 2;
    }

    .radar-chart__label {
      font-size: 10px;
      fill: var(--color-text-muted);
      font-family: var(--font-sans);
    }
  `,
})
export class SkillRadarChartComponent {
  readonly categories = input.required<SkillCategory[]>();
  readonly size = 280;
  readonly center = this.size / 2;
  readonly maxRadius = 100;
  readonly rings = [0.25, 0.5, 0.75, 1];

  readonly ariaLabel = computed(
    () => `Skill radar chart showing ${this.categories().length} categories`,
  );

  readonly labels = computed(() => {
    const cats = this.categories();
    const n = cats.length;
    if (n === 0) return [];
    return cats.map((cat, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const r = this.maxRadius + 24;
      return {
        index: i,
        text: cat.name.split(' ')[0],
        x: this.center + r * Math.cos(angle),
        y: this.center + r * Math.sin(angle) + 4,
      };
    });
  });

  readonly axisLines = computed(() => {
    const n = this.categories().length;
    if (n === 0) return [];
    return Array.from({ length: n }, (_, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      return {
        index: i,
        x: this.center + this.maxRadius * Math.cos(angle),
        y: this.center + this.maxRadius * Math.sin(angle),
      };
    });
  });

  ringPoints(fraction: number): string {
    const n = this.categories().length || 6;
    const r = this.maxRadius * fraction;
    return Array.from({ length: n }, (_, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const x = this.center + r * Math.cos(angle);
      const y = this.center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  }

  dataPoints(): string {
    const cats = this.categories();
    const n = cats.length;
    if (n === 0) return '';

    const avgLevels = cats.map((cat) => {
      const sum = cat.skills.reduce((a, s) => a + s.level, 0);
      return sum / cat.skills.length / 100;
    });

    return avgLevels
      .map((level, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const r = this.maxRadius * level;
        const x = this.center + r * Math.cos(angle);
        const y = this.center + r * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(' ');
  }
}
