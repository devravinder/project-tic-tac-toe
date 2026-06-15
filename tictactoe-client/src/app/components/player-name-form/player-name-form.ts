import { Component, output, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { PlayerDetails } from '../../pages/player-name/player-name';

@Component({
  selector: 'app-player-name-form',
  imports: [FormField],
  template: `
    <!-- project-form.component.html -->
    <div class="flex-1 h-full w-full flex flex-col justify-between">
      <div class="flex-1 min-w-sm overflow-auto flex flex-col gap-2 pt-4 pb-8 px-3">
        <label for="projects" class="block text-sm font-medium text-foreground/80 px-1">
          Name
        </label>
        <div class="flex flex-row gap-2 p-1">
          <input
            [formField]="playerForm.name"
            type="text"
            class="w-full px-3 py-2 border border-muted-foreground/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex p-4 px-6 items-end justify-end border-t border-border">
        <button
          type="button"
          (click)="handleSubmit()"
          class="cursor-pointer px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Continue
        </button>
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
export class PlayerNameForm {
  playerDetails = signal({
    name: '',
  });
  playerForm = form<PlayerDetails>(this.playerDetails);

  onContinue = output<PlayerDetails>();
  handleSubmit() {
    if (!this.playerDetails.name?.trim()) return;
    this.onContinue.emit(this.playerDetails());
  }
}
