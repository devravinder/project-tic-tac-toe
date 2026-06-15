import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { playerNameGuard } from './guards/player-name.guard';
import { gameResolver } from './pages/game/game';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    component: Layout,
    children: [
      {
        path: '',
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
        loadComponent: () => import('./pages/lobby/lobby'),
      },
      {
        path: 'player-name',
        loadComponent: () => import('./pages/player-name/player-name'),
      },
    ],
  },
];
