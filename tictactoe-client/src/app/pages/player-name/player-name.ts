import { Component, inject } from '@angular/core';
import { Modal } from "../../components/modal/modal";
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerNameForm } from '../../components/player-name-form/player-name-form';
import { PLAYER_NAME } from '../../util/constants';

export type PlayerDetails = {
  name: string
}

@Component({
  selector: 'app-player-name',
  imports: [Modal, PlayerNameForm],
  template: `
   <app-modal [isOpen]="true" (onClose)="goToParent()" [fullSize]="false" class="absolute" title="Player Deatils">
     <app-player-name-form (onContinue)="onContinue($event)" />
   </app-modal>
  `,
   styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class PlayerName {
  private router = inject(Router);
  private route = inject(ActivatedRoute)
   goToParent() {
    this.router.navigate(['..']);
  }

  onContinue(data:PlayerDetails){
    localStorage.setItem(PLAYER_NAME, data.name)
    const url = this.route.snapshot.queryParamMap.get('url');
    this.router.navigateByUrl(url || "/")

  }

}
export default PlayerName
