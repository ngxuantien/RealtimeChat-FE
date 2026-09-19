import { inject } from '@angular/core';
import { CanMatchFn, Router, Routes } from '@angular/router';

const settingsLandingRedirect: CanMatchFn = () => {
  const router = inject(Router);
  const target = window.matchMedia('(min-width: 768px)').matches ? '/settings/profile' : '/settings/menu';
  return router.parseUrl(target);
};

export const SETTINGS_ROUTES: Routes = [
  { path: '', pathMatch: 'full', canMatch: [settingsLandingRedirect], children: [] },
  { path: 'menu', children: [] },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile').then(m => m.Profile),
  },
  {
    path: 'appearance',
    loadComponent: () => import('./appearance/appearance').then(m => m.Appearance),
  },
];
