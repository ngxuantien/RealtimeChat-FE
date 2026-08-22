import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from '@app/core/interceptor/auth.interceptor';
import { icons, LucideAngularModule } from 'lucide-angular';
import { authRefreshInterceptor } from './core/interceptor/auth-refresh.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, authRefreshInterceptor])),
    importProvidersFrom(LucideAngularModule.pick(icons)),
  ]
};
