import {
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { GameBoard } from '../../components/game-board/game-board';
import { GameService } from '../../services/game.service';
import { GamePlayers } from '../../components/game-players/game-players';
import { GameChat } from '../../components/game-chat/game-chat';
import { GameActions } from '../../components/game-actions/game-actions';
import { WebsocketService } from '../../services/websocket.service';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  RedirectCommand,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { GameDto, GameStatus } from '../../types/global';
import { catchError, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { IN_PROGRESS, PLAYER_NAME, PLAYER_O, PLAYER_X } from '../../util/constants';
import { Modal } from "../../components/modal/modal";
import { GameStatusCard } from "../../components/game-status-card/game-status-card";

export const gameResolver: ResolveFn<GameDto> = (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot, // state
) => {
  const router = inject(Router);
  const gameService = inject(GameService);
  const gameId = route.paramMap.get('gameId')!;
  return gameService
    .getGame(gameId)
    .pipe(
      catchError(() => of(new RedirectCommand(router.parseUrl(''), { skipLocationChange: false }))),
    );
};

@Component({
  selector: 'app-game',
  imports: [GameBoard, GamePlayers, GameChat, GameActions, Modal, GameStatusCard],
  template: `
    <main class="max-w-7xl px-4 mx-auto w-full h-full flex flex-row justify-between gap-8">
      <app-modal [isOpen]="isModalOpen()" (onClose)="onModalClose()" [fullSize]="false">
         <app-game-status-card [data]="game()" />
      </app-modal>
      <div class="flex-1 flex flex-col gap-8 max-w-sm">
        <app-game-players
          [currentTurn]="game().currentTurn"
          [playerX]="game().playerX"
          [playerO]="game().playerO"
        />
        <app-game-board
          [disabled]="disabled()"
          [squares]="squares()"
          (onSqaureClick)="onSqaureClick($event)"
        />
        <app-game-actions [data]="game()" (onResign)="onResign()" (onRestart)="onRestart()" />
      </div>
      <div class="w-sm">
        <app-game-chat [gameId]="game().id" />
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
export class Game implements OnInit, OnDestroy {
  gameService = inject(GameService);
  wsService = inject(WebsocketService);
  router = inject(Router);
  private route = inject(ActivatedRoute);

  playerName = computed(() => localStorage.getItem(PLAYER_NAME)!);
  xIsNext = signal(true);

  data = toSignal(this.route.data);
  game = linkedSignal(() => this.data()!['game'] as GameDto);

  amIPlayerX = computed(() => this.game().playerX === this.playerName());

  isMyTurn = computed(() =>
    this.amIPlayerX() ? this.game().currentTurn === PLAYER_X : this.game().currentTurn === PLAYER_O,
  );
  disabled = computed(
    () => this.game().status !== (IN_PROGRESS as unknown as GameStatus) || !this.isMyTurn(),
  );

  onSqaureClick(index: number) {
    this.wsService.move(this.game().id, this.playerName(), index);
  }

  squares = computed(() => this.game().board.split(''));

  modalSwitch = signal(true)
  isModalOpen = computed(()=> this.modalSwitch() && this.game().status !== IN_PROGRESS as unknown as GameStatus)
  onModalClose=()=>{
    this.modalSwitch.set(false)
  }

  onResign(){
    this.wsService.resign(this.game().id, this.playerName())
  }
  onRestart(){
    this.wsService.restart(this.game().id, this.playerName())
    this.modalSwitch.set(true)
  }

  ngOnInit(): void {
    const gameId = this.game().id;
    this.gameService.getGame(gameId).subscribe((dto) => {
      this.game.set(dto);
    });

    this.wsService.watchGame<GameDto>(gameId).subscribe((dto) => {
      this.game.set(dto);
    });
  }

  constructor() {
    effect(() => {});
  }

  ngOnDestroy(): void {}
}
export default Game;
