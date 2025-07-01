import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginResponse } from '../models/login_response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  /**
   * Realiza la solicitud de login con email, password y un token opcional.
   * @param email Correo del usuario
   * @param password Contraseña del usuario
   * @returns Un Observable con la respuesta de tipo LoginResponse
   */
  login(email: string, password: string): Observable<LoginResponse> {
    const body = {
      email: email,
      password: password,
      returnSecureToken: true,
    };
    return this.http
      .post<LoginResponse>(environment.firebaseLoginUrl, body)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error en la solicitud de login:', error);
          return throwError(() => error);
        })
      );
  }

    getUsers(): Observable<any> {
    return this.http.get(`${environment.domain}user/all`);
  }

  getTickets(page: number, size: number): Observable<any> {
    return this.http.get(`${environment.domain}ticket/all?page=${page}&size=${size}`);
  }

  getTicketStatuses(): Observable<any> {
    return this.http.get(`${environment.domain}ticket/statuses`);
  }

  createTicket(ticketData: any): Observable<any> {
    return this.http.post(`${environment.domain}ticket/create`, ticketData);
  }
}
