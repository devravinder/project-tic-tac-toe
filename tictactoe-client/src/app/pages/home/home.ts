import { Component, inject } from '@angular/core';
import { CHAT, PLAY, ROOM, SHIELD, TROPHY } from '../../util/icons';
import { Router, RouterLink } from '@angular/router';
import { GameService } from '../../services/game.service';
import { PLAYER_NAME } from '../../util/constants';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <main class="max-w-7xl mx-auto px-4 flex-1 flex flex-col items-center justify-center gap-8">
      <div class="text-center max-w-2xl mx-auto flex flex-col gap-4">
        <h1 class="text-5xl md:text-7xl font-serif font-bold tracking-tight">
          The Classic Game, <br />
          <span class="text-primary">Reimagined.</span>
        </h1>
        <p class="text-muted-foreground text-lg md:text-xl">
          Experience the ultimate Tic Tac Toe platform with real-time chat, undo/redo capabilities,
          and a competitive lobby system.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            (click)="createGame()"
            class="cursor-pointer px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <span>{{ PLAY }}</span> <span>Create Game</span>
          </button>
          <button
            [routerLink]="['', 'lobby']"
            class="cursor-pointer px-8 py-4 bg-secondary text-secondary-foreground border border-border rounded-full font-semibold text-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <span>{{ ROOM }} </span><span>Join Game</span>
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        @for (f of features; track f.title) {
          <div
            class="p-8 rounded-2xl border border-border bg-card hover:shadow-xl transition-all group"
          >
            <div
              class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
            >
              {{ f.icon }}
            </div>
            <h3 class="text-xl font-bold mb-2">{{ f.title }}</h3>
            <p class="text-muted-foreground">{{ f.desc }}</p>
          </div>
        }
      </div>
    </main>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class Home {
  PLAY = PLAY;
  ROOM = ROOM;

  features = [
    { icon: TROPHY, title: 'Ranked Play', desc: 'Climb the global leaderboard' },
    { icon: CHAT, title: 'Live Chat', desc: 'Communicate with opponents' },
    { icon: SHIELD, title: 'Fair Play', desc: 'Anti-cheat game detection' },
  ];

  gameService = inject(GameService);
  router = inject(Router);

  createGame() {
    const playerName = localStorage.getItem(PLAYER_NAME);
    if (playerName) {
      this.gameService.createGame(playerName).subscribe((game) => {
        this.router.navigate(['', 'game', game.id]);
      });
    } else {
      this.router.navigate(['', 'player-name']);
    }
  }
}
export default Home;
