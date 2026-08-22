import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '@app/core/model/auth/login-request.model';
import { RegisterRequest } from '../model/auth/register-request.model';
import { AuthResponse } from '../model/auth/auth-response.model';
import { User } from '../model/user/user.model';
import { API_ENDPOINT } from '../constants/api-endpoint.constant';
import { STORAGE_KEY } from '../constants/storage.constant';
import { RefreshTokenRequest } from '../model/auth/refresh-token-request.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  currentUser = signal<AuthResponse | null>(null);

  constructor() {
    this.restoreSession();
  }

  login(payload: LoginRequest) {
    const url = `${this.baseUrl}/${API_ENDPOINT.AUTH.LOGIN}`;

    return this.http.post<AuthResponse>(url, payload).pipe(tap((res) => this.setSession(res)));
  }

  register(payload: RegisterRequest, avatar: File) {
    const url = `${this.baseUrl}/${API_ENDPOINT.USER.REGISTER}`;

    const formData = new FormData();
    formData.append('displayName', payload.displayName);
    formData.append('email', payload.email);
    formData.append('phoneNumber', payload.phoneNumber);
    formData.append('password', payload.password);
    formData.append('avatar', avatar);

    return this.http.post<User>(url, formData);
  }

  logout() {
    const userId = this.currentUser()?.userId;

    this.currentUser.set(null);
    localStorage.removeItem(STORAGE_KEY.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEY.REFRESH_TOKEN);

    if (!userId) return;

    this.http
      .post(`${this.baseUrl}/${API_ENDPOINT.AUTH.LOGOUT}/${userId}`, {})
      .pipe(catchError(() => of(null)))
      .subscribe();
  }

  refreshToken() {
    const refreshToken = localStorage.getItem(STORAGE_KEY.REFRESH_TOKEN);
    if (!refreshToken) {
      return throwError(() => new Error('Không có refresh token'));
    }

    const url = `${this.baseUrl}/${API_ENDPOINT.AUTH.REFRESH_TOKEN}`;
    return this.http
      .post<AuthResponse>(url, { refreshToken } satisfies RefreshTokenRequest)
      .pipe(tap((res) => this.setSession(res)));
  }

  private setSession(res: AuthResponse) {
    localStorage.setItem(STORAGE_KEY.ACCESS_TOKEN, res.accessToken);
    localStorage.setItem(STORAGE_KEY.REFRESH_TOKEN, res.refreshToken);
    this.currentUser.set(res);
  }

  private restoreSession() {
    const token = this.token;
    if (!token) return;

    const payload = this.decodeJwtPayload(token);
    if (!payload) return;

    this.currentUser.set({
      userId: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? '',
      displayName: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ?? '',
      email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ?? '',
      accessToken: token,
      refreshToken: localStorage.getItem(STORAGE_KEY.REFRESH_TOKEN) ?? '',
    });
  }

  private decodeJwtPayload(token: string): Record<string, string> | null {
    try {
      const payload = token.split('.')[1];
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
  }

  get token(): string | null {
    return localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
  }

  clearSession() {
    this.currentUser.set(null);
    localStorage.removeItem(STORAGE_KEY.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEY.REFRESH_TOKEN);
  }
}
