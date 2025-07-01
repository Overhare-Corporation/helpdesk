import { Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  constructor() {}

  private get storage(): Storage | null {
    return isPlatformBrowser(this.platformId) ? localStorage : null;
  }

  login(token: string) {
    this.storage?.setItem('token', token);
  }

  async logout() {
    this.storage?.removeItem('token');
  }

  isLoggedIn(): boolean {
    return this.storage?.getItem('token') !== null;
  }

  getToken(): string | null {
    return this.storage?.getItem('token') ?? null;
  }

  setDisplayName(displayname: string) {
    this.storage?.setItem('displayname', displayname);
  }

  removeDisplayName() {
    this.storage?.removeItem('displayname');
  }

  getDisplayName(): string | null {
    return this.storage?.getItem('displayname') ?? null;
  }

  getUserId(): number | null {
    return this.storage?.getItem('userId') ? parseInt(this.storage?.getItem('userId') ?? '') : null;
  }
}
