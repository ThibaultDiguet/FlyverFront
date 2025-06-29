import { Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {LocalStorageService} from './local-storage.service';
import {User} from '../types/User';
import {environment} from '../env/env';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private userSubject = new BehaviorSubject<User|null>(null);
  public user$ = this.userSubject.asObservable();

  private apiUrl = environment.apiUrl;

  constructor(
    private localStorageService: LocalStorageService,
    private http: HttpClient
  ) {}

  fetchUser(): void {
    this.http.get<any>(`${this.apiUrl}/auth/me`).subscribe(user => {
      this.userSubject.next(user);
      this.localStorageService.setItem('user', JSON.stringify(user));
    });
  }

  clearUser() {
    this.userSubject.next(null);
    this.localStorageService.removeItem('user');
  }
}
