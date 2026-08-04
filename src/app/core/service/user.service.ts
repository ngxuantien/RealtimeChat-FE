import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { API_ENDPOINT } from '../constants/api-endpoint.constant';
import { User } from '../model/user/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    getById(userId: string) {
        const url = `${this.baseUrl}/${API_ENDPOINT.USER.REGISTER}/${userId}`;

        return this.http.get<User>(url);
    }

     getByPhone(phoneNumber: string) {
        return this.http.get<User>(`${this.baseUrl}/${API_ENDPOINT.USER.REGISTER}/phone/${encodeURIComponent(phoneNumber)}`);
    }
}