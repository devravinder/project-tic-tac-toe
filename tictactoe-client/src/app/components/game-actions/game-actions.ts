import { Component, input, output } from '@angular/core';
import { DRAW, FLAG, RESTART } from '../../util/icons';
import { GameDto, GameStatus } from '../../types/global';
import { FINISHED } from '../../util/constants';

@Component({
  selector: 'app-game-actions',
  imports: [],
  template: `
    <div class="w-full flex flex-row justify-between">
      <button
        (click)="onResign.emit()"
        class="cursor-pointer px-6 py-3 rounded-xl border border-destructive/60 text-destructive hover:bg-destructive/90 hover:text-foreground transition-all flex items-center gap-2 font-semibold"
      >
        <span>{{ FLAG }}</span>
        <span>Resign</span>
      </button>

      @if (data().status === FINISHED) {
        <button
          (click)="onRestart.emit()"
          class="cursor-pointer px-6 py-3 rounded-xl border border-green-500/60 text-green-500 hover:bg-green-500/90 hover:text-foreground transition-all flex items-center gap-2 font-semibold"
        >
          <span>{{ RESTART }}</span>
          <span>Restart</span>
        </button>
      }

      <button
        (click)="onDraw.emit()"
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
  DRAW = DRAW;
  RESTART = RESTART;
  data = input.required<GameDto>();
  onResign = output();
  onDraw = output();
  onRestart = output();
  FINISHED = FINISHED as unknown as GameStatus;
}
