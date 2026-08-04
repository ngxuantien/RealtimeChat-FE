import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest} from '@app/core/model/auth/login-request.model';
import { RegisterRequest } from '../model/auth/register-request.model';
import { AuthResponse } from '../model/auth/auth-response.model';
import { API_ENDPOINT } from '../constants/api-endpoint.constant';
import { STORAGE_KEY } from '../constants/storage.constant';

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
        const url = `${this.baseUrl}/${API_ENDPOINT.USER.REGISTER}`;

        return this.http.post<AuthResponse>(url, payload);
    }

    logout() {
        const userId = this.currentUser()?.userId;

        this.currentUser.set(null);
        localStorage.removeItem(STORAGE_KEY.ACCESS_TOKEN);
        
        if (!userId) return;

        this.http.post(`${this.baseUrl}/${API_ENDPOINT.AUTH.LOGOUT}/${userId}`, {})
            .pipe(catchError(() => of(null)))
            .subscribe();
    }

    private setSession(res: AuthResponse) {
        localStorage.setItem(STORAGE_KEY.ACCESS_TOKEN, res.accessToken);
        this.currentUser.set(res);
    }

    get isLoggedIn(): boolean {
        return !!localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
    }

    get token(): string | null {
        return localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
    }
}