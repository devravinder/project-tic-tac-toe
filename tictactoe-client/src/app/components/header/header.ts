import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { MOON, SUN } from '../../util/icons';
import { Button } from '../button/button';
@Component({
  selector: 'app-header',
  imports: [Button],
  template: `
    <div class="max-w-7xl mx-auto flex flex-row items-center justify-between">
      <div (click)="navigateToHome()" class="flex items-center space-x-3 cursor-pointer">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">
            <img src="./tic-tac-toe.png" />
          </span>
        </div>
        <h1 class="text-xl font-semibold text-foreground">Tic Tac Toe</h1>
      </div>

      <div class="flex items-center space-x-2">
        <app-button
          (onClick)="themeService.toggleTheme()"
          [label]="themeService.theme() == 'dark' ? SUN : MOON"
        />
      </div>
    </div>
  `,
  styles: ``,
})
export class Header {
  SUN = SUN;
  MOON = MOON;

  private router = inject(Router);

  themeService = inject(ThemeService);

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
