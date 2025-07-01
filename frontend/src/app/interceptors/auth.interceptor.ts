import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const bearerInterceptor : HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}`, 'Accept-Language': 'es-ES', 'Allow-Access-Control-Request-Method': 'GET, POST, PUT, DELETE, OPTIONS', 'Access-Control-Allow-Origin': '*'}
    });
    return next(authReq);
  }
  return next(req);
}

export const authOfResponseInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return next(req).pipe(
    tap({
      error: (error: { status: number; }) => {
        if (error.status == 401) {
          authService.logout().then(() => router.navigate(['login']))
        }
      }
    })
  );
};
