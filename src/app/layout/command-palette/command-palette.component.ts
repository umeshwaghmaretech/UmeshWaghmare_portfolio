import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
  HostListener,
  output,
  effect,
  ElementRef,
  viewChild,
} from '@angular/core';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { NavigationService } from '../../core/services/navigation.service';
import { CommandItem } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-command-palette',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="cmd-palette__backdrop" (click)="close()" aria-hidden="true"></div>
      <div
        class="cmd-palette"
        role="dialog"
        aria-label="Command palette"
        aria-modal="true"
      >
        <input
          #searchInput
          type="search"
          class="cmd-palette__input"
          placeholder="Search sections, projects, options..."
          [value]="query()"
          (input)="onQuery($event)"
          (keydown)="onKeydown($event)"
          aria-label="Search commands"
        />
        <ul class="cmd-palette__list" role="listbox">
          @for (item of filtered(); track item.id; let i = $index) {
            <li
              role="option"
              [class.active]="selectedIndex() === i"
              [attr.aria-selected]="selectedIndex() === i"
              (click)="execute(item)"
              (mouseenter)="selectedIndex.set(i)"
            >
              <span class="cmd-palette__category">{{ categoryLabel(item.category) }}</span>
              <span class="cmd-palette__label">{{ item.label }}</span>
            </li>
          } @empty {
            <li class="cmd-palette__empty">No results found</li>
          }
        </ul>
        <div class="cmd-palette__hint">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    }
  `,
  styles: `
    .cmd-palette__backdrop {
      position: fixed;
      inset: 0;
      background: color-mix(in srgb, #000 50%, transparent);
      z-index: calc(var(--z-drawer) + 10);
    }

    .cmd-palette {
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      width: min(560px, calc(100vw - 2rem));
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
      z-index: calc(var(--z-drawer) + 11);
      overflow: hidden;
      animation: scale-in 0.2s ease;
    }

    .cmd-palette__input {
      width: 100%;
      padding: var(--space-lg);
      font-size: var(--text-lg);
      border: none;
      border-bottom: 1px solid var(--color-border);
      background: transparent;
      color: var(--color-text);
      outline: none;
    }

    .cmd-palette__list {
      list-style: none;
      margin: 0;
      padding: var(--space-sm);
      max-height: min(60dvh, 420px);
      overflow-y: auto;
    }

    li {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: background var(--transition-fast);

      &.active {
        background: var(--color-accent-subtle);
      }
    }

    .cmd-palette__category {
      font-size: var(--text-xs);
      font-weight: 600;
      color: var(--color-text-subtle);
      min-width: 4.5rem;
      flex-shrink: 0;
    }

    .cmd-palette__label {
      font-size: var(--text-base);
      color: var(--color-text);
    }

    .cmd-palette__empty {
      padding: var(--space-lg);
      text-align: center;
      color: var(--color-text-muted);
      cursor: default;
    }

    .cmd-palette__hint {
      display: flex;
      gap: var(--space-lg);
      padding: var(--space-sm) var(--space-lg);
      border-top: 1px solid var(--color-border);
      font-size: var(--text-xs);
      color: var(--color-text-subtle);
    }

    @keyframes scale-in {
      from {
        opacity: 0;
        transform: translateX(-50%) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) scale(1);
      }
    }
  `,
})
export class CommandPaletteComponent {
  private readonly data = inject(PortfolioDataService);
  private readonly nav = inject(NavigationService);
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  readonly open = signal(false);
  readonly query = signal('');
  readonly selectedIndex = signal(0);
  readonly closed = output<void>();

  readonly allItems = computed<CommandItem[]>(() => {
    const sections = this.nav.sections.map((s) => ({
      id: `sec-${s.id}`,
      label: s.label,
      category: 'section' as const,
      href: s.href,
    }));
    const projects = this.data.projects().map((p) => ({
      id: `proj-${p.id}`,
      label: p.title,
      category: 'project' as const,
      href: `/projects/${p.slug}`,
    }));

    const profile = this.data.profile();
    const options: CommandItem[] = [
      {
        id: 'opt-snapshot',
        label: 'View Snapshot',
        category: 'action' as const,
        href: '/resume',
      },
    ];
    if (profile?.linkedIn) {
      options.push({
        id: 'opt-linkedin',
        label: 'Open LinkedIn',
        category: 'action' as const,
        href: profile.linkedIn,
      });
    }
    if (profile?.email) {
      options.push({
        id: 'opt-email',
        label: 'Email',
        category: 'action' as const,
        href: `mailto:${profile.email}`,
      });
    }

    return [...sections, ...projects, ...options];
  });

  readonly filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    const items = this.allItems();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        this.categoryLabel(item.category).toLowerCase().includes(q),
    );
  });

  constructor() {
    effect(() => {
      if (this.open() && this.searchInput()) {
        setTimeout(() => this.searchInput()?.nativeElement.focus(), 0);
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  onGlobalKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.toggle();
    }
    if (event.key === 'Escape' && this.open()) {
      this.close();
    }
  }

  toggle(): void {
    this.open.update((v) => !v);
    if (!this.open()) {
      this.query.set('');
      this.selectedIndex.set(0);
    }
  }

  close(): void {
    this.open.set(false);
    this.query.set('');
    this.selectedIndex.set(0);
    this.closed.emit();
  }

  onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.selectedIndex.set(0);
  }

  onKeydown(event: KeyboardEvent): void {
    const items = this.filtered();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectedIndex.update((i) => Math.min(i + 1, items.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectedIndex.update((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const item = items[this.selectedIndex()];
      if (item) this.execute(item);
    }
  }

  execute(item: CommandItem): void {
    if (item.href?.startsWith('mailto:')) {
      window.location.href = item.href;
    } else if (item.href) {
      this.nav.navigateTo(item.href);
    }
    this.close();
  }

  categoryLabel(category: CommandItem['category']): string {
    const labels: Record<CommandItem['category'], string> = {
      section: 'Section',
      skill: 'Section',
      project: 'Project',
      action: 'Option',
    };
    return labels[category];
  }
}
