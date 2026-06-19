import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { GameService } from '../../services/game.service';
import { WebsocketService } from '../../services/websocket.service';
import { ChatMessageDto } from '../../types/global';
import { PLAYER_NAME } from '../../util/constants';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-game-chat',
  imports: [ReactiveFormsModule],
  template: `
    <div
      class="w-full flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
    >
      <div class="p-4 border-b border-border bg-muted/30 flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <h3 class="font-semibold text-sm">Game Chat</h3>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        @for (msg of chatMessages(); track msg.id) {
          <div
            class="flex flex-col"
            [class.items-end]="msg.sender === playerName()"
            [class.items-start]="msg.sender !== playerName()"
          >
            <div
              class="max-w-[80%] p-3 rounded-2xl text-sm"
              [class]="
                msg.sender === playerName()
                  ? 'bg-primary text-primary-foreground rounded-tr-none'
                  : 'bg-muted text-foreground rounded-tl-none'
              "
            >
              {{ msg.content }}
            </div>

            <span class="text-[10px] text-muted-foreground mt-1 px-1">
              {{ msg.sender }}
            </span>
          </div>
        }
        <div #bottomMarker></div>
      </div>

      <div class="p-4 border-t border-border bg-muted/10">
        <div class="relative">
          <input
            type="text"
            [formControl]="messageText"
            (keyup.enter)="onSend()"
            placeholder="Type a message..."
            class="w-full bg-background border border-border rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />

          <button
            (click)="onSend()"
            type="button"
            class="absolute right-1 top-1 p-1.5 text-primary hover:bg-primary hover:text-primary-foreground rounded-full transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M22 2L11 13" />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M22 2L15 22L11 13L2 9L22 2Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class GameChat {
  gameService = inject(GameService);
  wsService = inject(WebsocketService);
  gameId = input.required<string>();
  playerName = computed(() => localStorage.getItem(PLAYER_NAME)!);

  messageText = new FormControl('');
  chatMessages = signal<ChatMessageDto[]>([]);

  @ViewChild('bottomMarker')
  private bottomMarker?: ElementRef<HTMLDivElement>;

  private scrollToBottom() {
    this.bottomMarker?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }

  onSend() {
    const message = this.messageText.getRawValue();

    if (!message) return;
    this.wsService.sendMessage(this.gameId(), this.playerName(), message);

    this.messageText.setValue('');
  }

  ngOnInit(): void {
    this.gameService.getChatMessages(this.gameId()).subscribe((messages) => {
      this.chatMessages.set(messages);
    });

    this.wsService.watchGameChat<ChatMessageDto>(this.gameId()).subscribe((message) => {
      this.chatMessages.set(this.chatMessages().concat(message));
    });
  }

  constructor() {
    effect(() => {
      if (this.chatMessages()?.length) queueMicrotask(() => this.scrollToBottom());
    });
  }
}
