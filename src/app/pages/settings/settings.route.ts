import { Routes } from '@angular/router';

export const SETTINGS_ROUTES: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile').then(m => m.Profile),
  },
  {
    path: 'notifications',
    loadComponent: () => import('./notifications/notifications').then(m => m.Notifications),
  },
  {
    path: 'appearance',
    loadComponent: () => import('./appearance/appearance').then(m => m.Appearance),
  },
  {
    path: 'privacy',
    loadComponent: () => import('./privacy/privacy').then(m => m.Privacy),
  },
  {
    path: 'security',
    loadComponent: () => import('./security/security').then(m => m.Security),
  },
  {
    path: 'danger-zone',
    loadComponent: () => import('./components/settings-placeholder/settings-placeholder').then(m => m.SettingsPlaceholder),
    data: { title: 'Vùng nguy hiểm', description: 'Xóa tài khoản, dữ liệu', icon: 'triangle-alert' },
  },
];
