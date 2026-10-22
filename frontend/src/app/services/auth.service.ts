import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  login(email: string, password: string) {
    return this.http.post<{ email: string }>(`${environment.api_url}/Auth/login`, { email, password });
  }
  me() { return this.http.get<{ email: string }>(`${environment.api_url}/Auth/me`); }
  logout() { return this.http.post<void>(`${environment.api_url}/Auth/logout`, {}); }
}

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AuthService).me().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/'])))
  );
};
