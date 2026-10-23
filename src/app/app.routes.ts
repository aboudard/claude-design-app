import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'utilisateurs' },
  {
    path: 'utilisateurs',
    title: 'Gestion des utilisateurs',
    loadComponent: () => import('./users/user-list/user-list').then((m) => m.UserList),
  },
];
