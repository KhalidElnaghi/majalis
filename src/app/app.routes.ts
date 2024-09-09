import { Routes } from '@angular/router';

import { mainModulesAuthGuard } from './core/guards/authentication.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth/auth-layout.component'),
    loadChildren: () => import('./modules/auth/auth.routes'),
  },
  {
    path: 'main',
    title: 'Authentication',
    loadComponent: () =>
      import('./layouts/main-user/main-user-layout.component'),
    loadChildren: () => import('./modules/main-user/main.routes'),
    canActivate: [mainModulesAuthGuard],
  },
  {
    path: 'external',
    title: 'Meeting Polls',
    loadComponent: () =>
      import('./layouts/external-user/external-user-layout.component'),
    loadChildren: () => import('./modules/external-user/external.routes'),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./modules/errors/pages/page-not-found/page-not-found.component'),
  },
];
