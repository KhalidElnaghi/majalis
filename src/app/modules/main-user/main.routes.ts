import { Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'committee', pathMatch: 'full' },
  {
    path: 'committee',
    title: 'Committees',
    loadChildren: () => import('./features/committees/committees.routes'),
  },
  {
    path: 'meeting',
    title: 'Meetings',
    loadChildren: () => import('./features/meeting/meeting.routes'),
  },
];

export default routes;

export const mainRoutes = {
  COMMITTEE: '/main/committee',
  MEETINGS: '/main/meeting',
} as const;
