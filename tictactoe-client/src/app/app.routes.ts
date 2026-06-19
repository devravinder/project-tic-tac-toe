import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { activeGameGuard, playerNameGuard } from './guards/guard';
import { gameResolver } from './pages/game/game';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    component: Layout,
    children: [
      {
        path: '',
        canActivate:[activeGameGuard],
        loadComponent: () => import('./pages/home/home'),
      },
      {
        path: 'game/:gameId',
        loadComponent: () => import('./pages/game/game'),
        canActivate: [playerNameGuard],
        resolve:{
          game: gameResolver
        }
      },
      {
        path: 'lobby',
        canActivate:[activeGameGuard],
        loadComponent: () => import('./pages/lobby/lobby'),
      },
      {
        path: 'player-name',
        loadComponent: () => import('./pages/player-name/player-name'),
      },
    ],
  },
];
