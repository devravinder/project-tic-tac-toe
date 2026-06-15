import { CanActivateFn, RedirectCommand, Router } from "@angular/router";
import { PLAYER_NAME } from "../util/constants";
import { inject } from "@angular/core";

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