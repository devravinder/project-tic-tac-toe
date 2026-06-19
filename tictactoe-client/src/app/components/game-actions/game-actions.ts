import { Component, input, output } from '@angular/core';
import {
  DRAW as DRAW_ICON,
  FLAG,
  RESTART as RESTART_ICON,
  LEAVE as LEAVE_ICON,
  ACCEPT as ACCEPT_ICON,
  DECLINE as DECLINE_ICON
} from '../../util/icons';
import { GameStatus } from '../../types/global';
import { FINISHED, RESIGN, DRAW, LEAVE, ACCEPT, DECLINE } from '../../util/constants';

@Component({
  selector: 'app-game-actions',
  imports: [],
  template: `
    <div
      class="w-full flex flex-row  gap-4"
      [class]="actions()?.length == 1 ? 'justify-end' : 'justify-between'"
    >
      @if (actions().includes(RESIGN)) {
        <button
          (click)="onResign.emit()"
          class="cursor-pointer px-6 py-3 rounded-xl border border-destructive/60 text-destructive hover:bg-destructive/90 hover:text-foreground transition-all flex items-center gap-2 font-semibold"
        >
          <span>{{ FLAG }}</span>
          <span>Resign</span>
        </button>
      }

      @if (actions().includes(DECLINE)) {
        <button
          (click)="onDecline.emit()"
          class="cursor-pointer px-6 py-3 rounded-xl border border-destructive/60 text-destructive hover:bg-destructive/90 hover:text-foreground transition-all flex items-center gap-2 font-semibold"
        >
          <span>{{ DECLINE_ICON }}</span>
          <span>Decline</span>
        </button>
      }

      @if (actions().includes(ACCEPT)) {
        <button
          (click)="onAccept.emit()"
          class="cursor-pointer px-6 py-3 rounded-xl border border-green-500/60 text-green-500 hover:bg-green-500/90 hover:text-foreground transition-all flex items-center gap-2 font-semibold"
        >
          <span>{{ ACCEPT_ICON }}</span>
          <span>Accept</span>
        </button>
      }

      @if (actions().includes(DRAW)) {
        <button
          (click)="onDraw.emit()"
          class="cursor-pointer px-6 py-3 rounded-xl border border-primary/60 text-primary hover:bg-primary/90 hover:text-foreground transition-all flex items-center gap-2 font-semibold"
        >
          <span>{{ DRAW_ICON }}</span>
          <span>Draw</span>
        </button>
      }

      @if (actions().includes(LEAVE)) {
        <button
          (click)="onLeave.emit()"
          class="cursor-pointer px-6 py-3 rounded-xl border border-primary/60 text-primary hover:bg-primary/90 hover:text-foreground transition-all flex items-center gap-2 font-semibold"
        >
          <span>{{ LEAVE_ICON }}</span>
          <span>Leave</span>
        </button>
      }
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
  RESIGN = RESIGN;
  LEAVE = LEAVE;
  ACCEPT= ACCEPT
  DECLINE = DECLINE

  DRAW_ICON = DRAW_ICON;
  LEAVE_ICON = LEAVE_ICON;
  ACCEPT_ICON = ACCEPT_ICON
  DECLINE_ICON = DECLINE_ICON

  FINISHED = FINISHED as unknown as GameStatus;

  actions = input.required<string[]>(); // DRAW, RESIGN, RESTART, LEAVE

  onResign = output();
  onDraw = output();
  onLeave = output();
  onAccept = output()
  onDecline = output()
}
