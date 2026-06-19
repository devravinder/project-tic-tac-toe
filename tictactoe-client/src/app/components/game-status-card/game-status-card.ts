import { Component, computed, input, output } from '@angular/core';
import { GameDto, GameStatus } from '../../types/global';
import {
  DRAW as DRAW_ICON,
  FLAG,
  RESTART as RESTART_ICON,
  LEAVE as LEAVE_ICON,
  ACCEPT as ACCEPT_ICON,
  TROPHY as TROPHY_ICON
} from '../../util/icons';
import { ABANDONED, ACCEPT, DECLINE, DRAW, DRAW_REQUESTED, FINISHED, LEAVE, PLAYER_NAME, WAITING } from '../../util/constants';
import { GameActions } from '../game-actions/game-actions';

@Component({
  selector: 'app-game-status-card',
  imports: [GameActions],
  template: `
    <div
      class="min-w-sm min-h-96 aspect-auto flex-1 h-full w-full flex flex-col gap-8 justify-between items-center py-12 px-8"
    >
      <div class=" flex flex-col gap-4 justify-between items-center ">
        <span class="text-4xl font-bold">{{ message().title }}</span>
        <span class="text-xl">{{ message().subtitle }}</span>
      </div>
      <div class="w-full">
        <app-game-actions 
         [actions]="actions()"
         (onLeave)="onLeave.emit()"
         (onAccept)="onAccept.emit()"
         (onDecline)="onDecline.emit()"
         />
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
export class GameStatusCard {
  data = input.required<GameDto>();
  TROPHY = TROPHY_ICON;
  DRAW_ICON = DRAW_ICON


  LEAVE = LEAVE;
  DRAW = DRAW
  ACCEPT = ACCEPT

  playerName = computed(()=>localStorage.getItem(PLAYER_NAME))

  actions = computed(() => {
    return this.data().status === (DRAW_REQUESTED as unknown as GameStatus) && this.playerName() !== this.data().requestedBy ? [DECLINE, ACCEPT] : [LEAVE];
  });

  onLeave = output();
  onAccept = output();
  onDecline = output();

  message = computed(() => {
    if (this.data().status === (FINISHED as unknown as GameStatus)) {
      if (this.data().winner === DRAW)
        return {
          title: `${this.data().winner} ${DRAW_ICON}`,
          subtitle: 'Well played',
        };

      return {
        title: `${this.data().winner} Won ${TROPHY_ICON}`,
        subtitle: '💐 Congratulations 💐',
      };
    }


    if (this.data().status === (DRAW_REQUESTED as unknown as GameStatus)){
      if(this.playerName() === this.data().requestedBy){
        return {
        title: `${DRAW_ICON} Draw Request Sent`,
        subtitle:  `Let's wait for oppinets response`,
      };
      }
      return {
        title: `${DRAW_ICON} Draw`,
        subtitle:  `Opponent asking for a draw`,
      };
    }
      

    if (this.data().status === (ABANDONED as unknown as GameStatus))
      return {
        title: 'Game abandoned',
        subtitle: 'No body joined the game',
      };

    return {
      title: `⏳ Let's wait`,
      subtitle: 'wait for the opponent to join',
    };
  });
}
