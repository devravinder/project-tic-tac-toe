import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { PLAY, RESTART, USERS } from '../../util/icons';
import { GameService } from '../../services/game.service';
import { GameDto } from '../../types/global';
import { Router } from '@angular/router';
import { PLAYER_NAME } from '../../util/constants';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Button } from '../../components/button/button';

@Component({
  selector: 'app-lobby',
  imports: [ReactiveFormsModule, Button],
  template: `
    <main class="max-w-7xl mx-auto px-4 w-full flex flex-col gap-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div class="flex flex-row gap-4 items-center">
            <span class="text-4xl font-serif font-bold mb-2">Game Lobby</span>
            <app-button (onClick)="fetchGames()" [label]="RESTART" />
          </div>
          <p class="text-muted-foreground">Join an active session or wait for a challenger.</p>
        </div>

        <div class="relative w-full md:w-72">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35"></path>
          </svg>

          <input
            type="text"
            placeholder="Search Game ID..."
            [formControl]="searchText"
            class="w-full bg-card border border-border rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
      </div>

      <div class="grid gap-4">
        @for (game of filtered(); track game.id) {
          <div
            class="group bg-card border border-border p-6 rounded-2xl flex items-center justify-between hover:border-primary/50 hover:shadow-md transition-all"
          >
            <div class="flex items-center gap-6">
              <div
                class="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20 21a8 8 0 0 0-16 0" />
                  <circle cx="12" cy="8" r="4" />
                </svg>
              </div>

              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-bold text-lg">
                    {{ game.playerX }}
                  </span>

                  <span
                    class="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-wider"
                  >
                    {{ game.status }}
                  </span>
                </div>

                <div class="flex items-center gap-4 text-sm text-muted-foreground">
                  <span class="flex items-center gap-1"> #{{ game.id }} </span>

                  <span class="flex items-center gap-1">
                    <span>{{ USERS }}</span
                    ><span>{{ 1 }}/2 Players</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              (click)="joinGame(game.id)"
              class="cursor-pointer px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:scale-105 transition-all flex items-center gap-2"
            >
              {{ PLAY }} Join
            </button>
          </div>
        }
      </div>

      <div class="mt-12 p-8 rounded-2xl border border-dashed border-border bg-muted/20 text-center">
        <p class="text-muted-foreground mb-4">Don't see a game you like?</p>

        <button (click)="createGame()" class="text-primary font-bold hover:underline">
          Create your own room →
        </button>
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
export class Lobby implements OnInit {
  PLAY = PLAY;
  USERS = USERS;
  RESTART = RESTART;

  router = inject(Router);
  gameService = inject(GameService);
  games = signal<GameDto[]>([]);

  searchText = new FormControl('');

  // refer chat message // this.searchText.getRawValue()
  searchTextSignal = toSignal(this.searchText.valueChanges, {
    initialValue: this.searchText.value,
  });

  filtered = computed(() => {
    return this.searchTextSignal()
      ? this.games().filter(
          (g) =>
            g.id.includes(this.searchTextSignal()!) || g.playerX.includes(this.searchTextSignal()!),
        )
      : this.games();
  });

  joinGame(gameId: string) {
    const playerName = localStorage.getItem(PLAYER_NAME);
    if (playerName) {
      this.gameService.getGame(gameId).subscribe((game) => {
        if (game.playerX !== playerName) {
          this.gameService.joinGame(gameId, playerName).subscribe((game) => {
            this.router.navigate(['', 'game', game.id]);
          });
        } else {
          this.router.navigate(['', 'game', game.id]);
        }
      });
    } else {
      this.router.navigate(['', 'player-name']);
    }
  }

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

  fetchGames() {
    this.gameService.getAvailableGames().subscribe((res) => this.games.set(res));
  }

  ngOnInit(): void {
    this.fetchGames();
  }
}

export default Lobby;
