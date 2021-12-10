import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private token: string | null = '';
    private email = '';
    constructor(private http: HttpClient, public router: Router) { }

    createUser(email: string, password: string): Promise<HttpResponse<object>> {
        const authData: AuthData = { email, password };
        return this.http.post('/api/user/signup', authData, { observe: 'response' }).toPromise();
    }

    //Stores token locally
    login(email: string, password: string): Promise<void> {
        const authData: AuthData = {
            email: email, password: password
        };
        return this.http.post<{ token: string }>('/api/user/login', authData).toPromise().then(response => {
            const token = response.token;
            this.token = token;
            this.email = email;
            this.router.navigate(['/']);
        });
    }

    //Clears the token from the client
    logout() {
        this.http.post<{ message: string }>('/api/user/logout', {token: this.token}).toPromise().then(response => {
            this.router.navigate(['/login']);
        });
        this.token = null;
        //This window reload clears all JS private data from the session
        window.location.reload();
    }

    getToken(): string | null {
        return this.token || null;
    }

    isLoggedIn(): boolean {
        return this.getToken() != ("" || null);
    }

    getEmail(): string {
        return this.email;
    }

}