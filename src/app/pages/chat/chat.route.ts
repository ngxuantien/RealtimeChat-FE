import { Routes } from '@angular/router';

export const CHAT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./chat-empty/chat-empty').then((m) => m.ChatEmpty),
  },
  {
    path: 'chat/:conversationId',
    loadComponent: () => import('./chat-detail/chat-detail').then((m) => m.ChatDetail),
  },
];
