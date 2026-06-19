import { Component, computed, input } from '@angular/core';
import { GameDto, GameStatus } from '../../types/global';
import { DRAW, TROPHY } from '../../util/icons';
import { ABANDONED, FINISHED } from '../../util/constants';

@Component({
  selector: 'app-game-status-card',
  imports: [],
  template: `
    <div class="flex-1 h-full w-full flex flex-col justify-between items-center">
      <div class="min-w-xs min-h-28 aspect-auto flex flex-col gap-2 justify-center items-center py-12 px-8">
          <span class="text-2xl font-bold">{{message().title}}</span>
          <span>{{message().subtitle}}</span>
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
  data = input.required<GameDto>()
  TROPHY = TROPHY
  DRAW = DRAW

  message = computed(()=>{

    if(this.data().status===FINISHED as unknown as GameStatus ){

      if(this.data().winner === DRAW)
        return ({
        title: `${this.data().winner} ${DRAW}`,
        subtitle: "Well played"
    })

      return ({
        title: `${this.data().winner} Won ${TROPHY}`,
        subtitle: "💐 Congratulations 💐"
    })
    }

       

     if(this.data().status===ABANDONED as unknown as GameStatus )
       return ({
        title: "Game abandoned",
        subtitle: "No body joined the game"
    })

     return ({
        title: "Waiting for the opponent",
        subtitle: ""
    })
  })
}
