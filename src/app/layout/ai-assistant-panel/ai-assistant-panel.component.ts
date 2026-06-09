import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  AiAssistantService,
  ChatMessage,
} from '../../core/services/ai-assistant.service';
import { UiDrawerComponent } from '../../shared/ui/drawer/ui-drawer.component';
import { UiButtonComponent } from '../../shared/ui/button/ui-button.component';

@Component({
  selector: 'app-ai-assistant-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiDrawerComponent, UiButtonComponent],
  template: `
    <button
      type="button"
      class="ai-trigger"
      aria-label="Open AI assistant"
      (click)="open.set(true)"
    >
      AI
    </button>

    <ui-drawer [open]="open()" title="AI Assistant" position="right" (close)="open.set(false)">
      <div class="ai-panel">
        <p class="ai-panel__intro">
          UI-only assistant — ask about profile, skills, career, or projects.
        </p>

        <div class="ai-panel__prompts">
          @for (prompt of ai.suggestedPrompts; track prompt) {
            <ui-button variant="outline" size="sm" (clicked)="sendPrompt(prompt)">
              {{ prompt }}
            </ui-button>
          }
        </div>

        <div class="ai-panel__messages" aria-live="polite">
          @for (msg of messages(); track msg.id) {
            <div [class]="'ai-msg ai-msg--' + msg.role">
              <p>{{ msg.content }}</p>
            </div>
          }
        </div>

        <form class="ai-panel__form" (submit)="onSubmit($event)">
          <input
            type="text"
            [value]="inputText()"
            (input)="inputText.set($any($event.target).value)"
            name="prompt"
            placeholder="Ask anything about my portfolio..."
            aria-label="AI prompt"
          />
          <ui-button type="submit" size="sm">Send</ui-button>
        </form>
      </div>
    </ui-drawer>
  `,
  styles: `
    .ai-trigger {
      position: fixed;
      bottom: calc(var(--space-2xl) + 4rem);
      right: var(--space-lg);
      z-index: var(--z-fab);
      width: 3rem;
      height: 3rem;
      border-radius: var(--radius-full);
      border: 1px solid var(--color-border);
      background: var(--gradient-accent);
      color: var(--color-accent-text);
      font-weight: 700;
      font-size: var(--text-sm);
      cursor: pointer;
      box-shadow: var(--shadow-lg);
      transition: transform var(--transition-fast);

      &:hover {
        transform: scale(1.05);
      }

      &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }
    }

    .ai-panel {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      height: 100%;
    }

    .ai-panel__intro {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      margin: 0;
    }

    .ai-panel__prompts {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-sm);
    }

    .ai-panel__messages {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      min-height: 200px;
    }

    .ai-msg {
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);

      p {
        margin: 0;
        white-space: pre-wrap;
      }
    }

    .ai-msg--user {
      background: var(--color-accent-subtle);
      align-self: flex-end;
      max-width: 85%;
    }

    .ai-msg--assistant {
      background: var(--color-bg-muted);
      align-self: flex-start;
      max-width: 90%;
    }

    .ai-panel__form {
      display: flex;
      gap: var(--space-sm);

      input {
        flex: 1;
        padding: var(--space-sm) var(--space-md);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-family: inherit;
        background: var(--color-surface);
        color: var(--color-text);
      }
    }
  `,
})
export class AiAssistantPanelComponent {
  readonly ai = inject(AiAssistantService);
  readonly open = signal(false);
  readonly messages = signal<ChatMessage[]>([]);
  readonly inputText = signal('');

  sendPrompt(prompt: string): void {
    this.inputText.set(prompt);
    this.submit(prompt);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submit(this.inputText().trim());
  }

  private submit(text: string): void {
    if (!text) return;
    this.messages.update((msgs) => [...msgs, this.ai.createMessage('user', text)]);
    const response = this.ai.generateResponse(text);
    setTimeout(() => {
      this.messages.update((msgs) => [...msgs, this.ai.createMessage('assistant', response)]);
    }, 400);
    this.inputText.set('');
  }
}
