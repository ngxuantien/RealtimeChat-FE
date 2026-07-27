import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth').then((m) => m.Auth),

    children: [
      {
        path: 'login',
        loadComponent: () => import('./login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () => import('./register/register').then((m) => m.Register),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
];
