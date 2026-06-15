import { Component } from '@angular/core';

@Component({
  selector: 'app-game-chat',
  imports: [],
  template: `
  <div class="w-full flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
  <div class="p-4 border-b border-border bg-muted/30 flex items-center gap-2">
    <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
    <h3 class="font-semibold text-sm">Game Chat</h3>
  </div>

  <div class="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
    @for (msg of messages; track msg.id) {
      <div
        class="flex flex-col"
        [class.items-end]="msg.isMe"
        [class.items-start]="!msg.isMe"
      >
        <div
          class="max-w-[80%] p-3 rounded-2xl text-sm"
          [class]="
            msg.isMe
              ? 'bg-primary text-primary-foreground rounded-tr-none'
              : 'bg-muted text-foreground rounded-tl-none'
          "
        >
          {{ msg.text }}
        </div>

        <span class="text-[10px] text-muted-foreground mt-1 px-1">
          {{ msg.sender }}
        </span>
      </div>
    }
  </div>

  <form class="p-4 border-t border-border bg-muted/10">
    <div class="relative">
      <input
        type="text"
        placeholder="Type a message..."
        class="w-full bg-background border border-border rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
      />

      <button
        type="submit"
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
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M22 2L11 13"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M22 2L15 22L11 13L2 9L22 2Z"
          />
        </svg>
      </button>
    </div>
  </form>
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
  messages = [
  {
    id: 1,
    text: 'Good luck!',
    sender: 'You',
    isMe: true,
  },
  {
    id: 2,
    text: 'Have fun 😊',
    sender: 'Opponent',
    isMe: false,
  },
  {
    id: 3,
    text: 'Nice move!',
    sender: 'You',
    isMe: true,
  },
];
}
