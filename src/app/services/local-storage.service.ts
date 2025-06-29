import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private storageSubjects: Map<string, BehaviorSubject<string | null>> = new Map();

  constructor() {
    window.addEventListener('storage', (event) => {
      if (event.key) {
        this.emitChange(event.key);
      }
    });
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  watchItem(key: string): BehaviorSubject<string | null> {
    if (!this.storageSubjects.has(key)) {
      this.storageSubjects.set(key, new BehaviorSubject<string | null>(this.getItem(key)));
    }
    return this.storageSubjects.get(key)!;
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
    this.emitChange(key);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
    this.emitChange(key);
  }

  private emitChange(key: string): void {
    if (this.storageSubjects.has(key)) {
      this.storageSubjects.get(key)!.next(this.getItem(key));
    }
  }
}
