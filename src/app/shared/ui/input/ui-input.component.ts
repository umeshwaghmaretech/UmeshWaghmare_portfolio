import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="ui-input" [class.ui-input--error]="error()">
      @if (label()) {
        <label [for]="inputId">{{ label() }}</label>
      }
      @if (multiline()) {
        <textarea
          [id]="inputId"
          [placeholder]="placeholder()"
          [rows]="rows()"
          [value]="value()"
          [attr.aria-invalid]="error() ? true : null"
          [attr.aria-describedby]="error() ? inputId + '-error' : null"
          (input)="onInput($event)"
          (blur)="onTouched()"
        ></textarea>
      } @else {
        <input
          [id]="inputId"
          [type]="type()"
          [placeholder]="placeholder()"
          [value]="value()"
          [attr.aria-invalid]="error() ? true : null"
          [attr.aria-describedby]="error() ? inputId + '-error' : null"
          (input)="onInput($event)"
          (blur)="onTouched()"
        />
      }
      @if (error()) {
        <span class="ui-input__error" [id]="inputId + '-error'">{{ error() }}</span>
      }
    </div>
  `,
  styles: `
    .ui-input {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);

      &:has(:invalid:not(:placeholder-shown)) {
        .ui-input__error {
          display: block;
        }
      }
    }

    label {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--color-text-muted);
    }

    input,
    textarea {
      width: 100%;
      padding: var(--space-sm) var(--space-md);
      font-family: inherit;
      font-size: var(--text-base);
      color: var(--color-text);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      transition:
        border-color var(--transition-fast),
        box-shadow var(--transition-fast);

      &:focus {
        outline: none;
        border-color: var(--color-accent);
        box-shadow: 0 0 0 3px var(--color-accent-subtle);
      }

      &::placeholder {
        color: var(--color-text-subtle);
      }
    }

    textarea {
      resize: vertical;
      min-height: 6rem;
    }

    .ui-input--error input,
    .ui-input--error textarea {
      border-color: var(--color-error);
    }

    .ui-input__error {
      font-size: var(--text-xs);
      color: var(--color-error);
    }
  `,
})
export class UiInputComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly placeholder = input('');
  readonly type = input<string>('text');
  readonly multiline = input(false);
  readonly rows = input(4);
  readonly error = input<string | null>(null);
  readonly value = model('');

  readonly inputId = `ui-input-${Math.random().toString(36).slice(2, 9)}`;

  private onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
