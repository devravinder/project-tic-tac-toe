import { CanActivateFn, RedirectCommand, Router } from "@angular/router";
import { PLAYER_NAME } from "../util/constants";
import { inject } from "@angular/core";
import { GameService } from "../services/game.service";
import { catchError, map, of } from "rxjs";

export const playerNameGuard: CanActivateFn = async (route, state) => {

    const router = inject(Router)
    const playerName = localStorage.getItem(PLAYER_NAME)
    if(playerName)
     return true

    
  const nextRoute = router.parseUrl(`player-name?url=${state.url}`);
  return new RedirectCommand(nextRoute, {
    skipLocationChange: false, // skip adding to browser history
  });
}


export const activeGameGuard: CanActivateFn = () => {
  const router = inject(Router);
  const gameService = inject(GameService);

  const playerName = localStorage.getItem(PLAYER_NAME);

  if (!playerName) return true;

  // how to handle this observable
  return gameService.getPlayingGame(playerName).pipe(
    map((game) => {
      if (!game) return true;
      return new RedirectCommand(router.parseUrl(`/game/${game.id}`), {
        skipLocationChange: false,
      });
    }),
    catchError(() => of(true)),
  );
};
