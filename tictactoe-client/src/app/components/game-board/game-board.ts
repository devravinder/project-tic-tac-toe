import { Component, effect, input, output } from '@angular/core';
import { EMPTY } from '../../util/constants';

@Component({
  selector: 'app-game-board',
  imports: [],
  template: `
    <div class="grid grid-cols-3 gap-4 w-full aspect-square mx-auto">
      @for (item of squares(); track $index) {
        <button
          [disabled]="disabled() || item !== EMPTY"
          (click)="onSqaureClick.emit($index)"
          class="relative flex items-center justify-center w-28 h-28 p-5 text-5xl font-bold rounded-xl border-2 transition-all duration-200 bg-card border-border text-foreground"
          [class]="
            disabled() || item !== EMPTY
              ? 'cursor-default'
              : 'cursor-pointer hover:border-primary/50'
          "
        >
          {{ item }}
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
export class GameBoard {
  disabled = input.required<boolean>();
  squares = input.required<string[]>();
  onSqaureClick = output<number>();
  EMPTY = EMPTY;
}
