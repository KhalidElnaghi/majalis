import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/authentication.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('./pages/login/login.component'),
    canActivate: [authGuard],
  },
  {
    path: 'logout',
    title: 'Logout',
    loadComponent: () => import('./pages/logout/logout.component'),
  },
];

export default routes;

export const authRoutes = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
} as const;
