import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, tap, throwError} from 'rxjs';
import {environment} from '../env/env';
import {LocalStorageService} from './local-storage.service';
import {UserService} from './user.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  public accessToken$ = this.accessTokenSubject.asObservable();

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private userService: UserService,
  ) {}

  register(data: any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    console.log("zzzzz", data)
    return this.http.post(`${this.apiUrl}/users`, JSON.stringify(data), { headers });
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    const body = new HttpParams()
      .set('email', credentials.email)
      .set('password', credentials.password);

    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    return this.http.post(`${this.apiUrl}/auth/login`, body.toString(), { headers }).pipe(
      tap((res: any) => {
        this.localStorageService.setItem('refresh_token', res.refresh_token);
        this.accessTokenSubject.next(res.access_token);
        this.userService.fetchUser();
      })
    );
  }
  refreshToken(): Observable<any> {

    const refreshToken = this.localStorageService.getItem('refresh_token');
    if (!refreshToken) return new Observable(observer => observer.complete());

    const body = new HttpParams()
      .set('refresh_token', refreshToken);

    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    return this.http.post(`${this.apiUrl}/auth/refresh`, body.toString(), { headers }).pipe(
      tap((res: any) => {
        this.accessTokenSubject.next(res.access_token);
        this.userService.fetchUser();
      })
    );
  }

  logout(): void {
    this.localStorageService.removeItem('refresh_token');
    this.accessTokenSubject.next(null);
    this.userService.clearUser();
  }

  getAccessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.accessTokenSubject.value;
  }

  isAdmin(): boolean {
    const userStr = this.localStorageService.getItem('user');
    if (!userStr) return false;
    try {
      const user = JSON.parse(userStr);
      return !!user.is_admin;
    } catch {
      return false;
    }
  }
}
