import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest} from '@app/core/model/auth/login-request.model';
import { RegisterRequest } from '../model/auth/register-request.model';
import { AuthResponse } from '../model/auth/auth-response.model';
import { API_ENDPOINT } from '../constants/api-endpoint.constant';

const TOKEN_KEY = 'access_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    currentUser = signal<AuthResponse | null>(null);

    login(payload: LoginRequest) {
        const url = `${this.baseUrl}/${API_ENDPOINT.AUTH.LOGIN}`;
        
        return this.http.post<AuthResponse>(url, payload).pipe(
            tap(res => this.setSession(res))
        );
    }

    register(payload: RegisterRequest) {
        return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, payload).pipe(
            tap(res => this.setSession(res))
        );
    }

    logout() {
        localStorage.removeItem(TOKEN_KEY);
        this.currentUser.set(null);
    }

    private setSession(res: AuthResponse) {
        localStorage.setItem(TOKEN_KEY, res.accessToken);
        this.currentUser.set(res);
    }

    get isLoggedIn(): boolean {
        return !!localStorage.getItem(TOKEN_KEY);
    }

    get token(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }
}