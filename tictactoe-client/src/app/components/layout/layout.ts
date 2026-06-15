import { Component } from '@angular/core';
import { Header } from '../header/header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [Header, RouterOutlet],
  template: `
  <div class="w-full h-screen flex flex-col">
      <app-header class="w-full border-b shadow border-border px-4 py-3" />
      <main class="w-full max-w-7xl mx-auto flex-1 flex flex-col py-8">
          <router-outlet class="hidden" />
      </main>
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
export class Layout {}
