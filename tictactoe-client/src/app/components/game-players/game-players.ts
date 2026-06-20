import { Component, inject, input } from '@angular/core';
import { GameService } from '../../services/game.service';
import { CONNECTION_MAP, PLAYER_O, PLAYER_X } from '../../util/constants';

@Component({
  selector: 'app-game-players',
  imports: [],
  template: `
    <div class="flex flex-row justify-between items-center gap-4">
      <div
        class="flex items-center gap-3 p-3 rounded-2xl"
        [class]="currentTurn() === PLAYER_X ? 'bg-blue-500/20 ring-2 ring-blue-500' : ''"
      >
        <div
          class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold"
        >
          X
        </div>
        <div>
          <p class="text-xs text-muted-foreground font-medium">Player 1</p>
          <p class="font-bold flex flex-row gap-1">
            <span>{{ playerX() }}</span>
            <span>{{ CONNECTION_MAP[playerXDisconnects()] }}</span>
          </p>
        </div>
      </div>

      <div class="text-center">
        <div class="text-2xl font-serif font-bold">VS</div>
      </div>

      <div
        class="flex items-center gap-3 p-3 rounded-2xl transition-all"
        [class]="currentTurn() === PLAYER_O ? 'bg-red-500/20 ring-2 ring-red-500' : ''"
      >
        <div class="text-right">
          <p class="text-xs text-muted-foreground font-medium">Player 2</p>
          <p class="font-bold flex flex-row gap-1">
            <span>{{ CONNECTION_MAP[playerODisconnects()] }}</span>
            <span>{{ playerO() }}</span>
          </p>
        </div>

        <div
          class="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold"
        >
          O
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
export class GamePlayers {
  currentTurn = input.required<string>();
  playerX = input.required<string>();
  playerO = input.required<string>();
  playerXDisconnects = input.required<number>()
  playerODisconnects = input.required<number>()

  PLAYER_O = PLAYER_O;
  PLAYER_X = PLAYER_X;
  CONNECTION_MAP = CONNECTION_MAP
}
