import { Component } from '@angular/core';
import { DRAW, FLAG } from '../../util/icons';

@Component({
  selector: 'app-game-actions',
  imports: [],
  template: `
    <div class="w-full flex flex-row justify-between">
      <button
        class="cursor-pointer px-6 py-3 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/90 hover:text-foreground transition-all flex items-center gap-2 font-semibold"
      >
        <span>{{ FLAG }}</span>
        <span>Resign</span>
      </button>

       <button
        class="cursor-pointer px-6 py-3 rounded-xl border border-primary/60 text-primary hover:bg-primary/90 hover:text-foreground transition-all flex items-center gap-2 font-semibold"
      >
        <span>{{ DRAW }}</span>
        <span>Draw</span>
      </button>
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
export class GameActions {
  FLAG = FLAG;
  DRAW = DRAW
}
