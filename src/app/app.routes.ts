import { Routes } from '@angular/router';
import { authGuard } from '@app/core/guard/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./layout/auth-layout/auth-layout').then(m => m.AuthLayout),
    loadChildren: () => import('./pages/auth/auth.route').then(m => m.AUTH_ROUTES),
  },

  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/main-layout/main-layout').then(m => m.MainLayout),
    loadChildren: () => import('./pages/chat/chat.route').then(m => m.CHAT_ROUTES),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/settings/settings-layout/settings-layout').then(m => m.SettingsLayout),
    loadChildren: () => import('./pages/settings/settings.route').then(m => m.SETTINGS_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
