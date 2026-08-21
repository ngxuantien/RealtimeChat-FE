// core/interceptor/auth-refresh.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '@app/core/service/auth.service';
import { API_ENDPOINT } from '@app/core/constants/api-endpoint.constant';

let isRefreshing = false;
const refreshedToken$ = new BehaviorSubject<string | null>(null);

export const authRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (
    req.url.includes(API_ENDPOINT.AUTH.REFRESH_TOKEN) ||
    req.url.includes(API_ENDPOINT.AUTH.LOGIN)
  ) {
    return next(req);
  }

  return next(req).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse) || err.status !== 401) {
        return throwError(() => err);
      }

      if (isRefreshing) {
        return refreshedToken$.pipe(
          filter((token): token is string => token !== null),
          take(1),
          switchMap((token) =>
            next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })),
          ),
        );
      }

      isRefreshing = true;
      refreshedToken$.next(null);

      return authService.refreshToken().pipe(
        switchMap((res) => {
          isRefreshing = false;
          refreshedToken$.next(res.accessToken);
          return next(req.clone({ setHeaders: { Authorization: `Bearer ${res.accessToken}` } }));
        }),
        catchError((refreshErr) => {
          isRefreshing = false;
          authService.clearSession();
          router.navigate(['/auth/login']);
          return throwError(() => refreshErr);
        }),
      );
    }),
  );
};
