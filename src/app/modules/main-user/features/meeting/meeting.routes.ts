import { Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'my-list', pathMatch: 'full' },
  {
    path: 'my-list',
    title: 'My Meetings',
    loadComponent: () =>
      import('../meeting/pages/my-meetings-list/my-meetings-list.component'),
  },
];

export default routes;
