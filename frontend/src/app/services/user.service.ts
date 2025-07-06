import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginResponse } from '../models/login_response';
import { environment } from '../../environments/environment';
import {
  ApiResponse,
  CreateTicketRequest,
  TicketStatus,
} from '../models/dashboard';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.domain;
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

  getUsers(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/user/all`);
  }

  getTickets(page: number, size: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/ticket/all?page=${page}&size=${size}`
    );
  }

  // Nuevos métodos para POST
  createTicket(ticketData: CreateTicketRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/ticket/create`,
      ticketData
    );
  }

  getTicketStatuses(): Observable<ApiResponse<TicketStatus[]>> {
    return this.http.get<ApiResponse<TicketStatus[]>>(
      `${this.apiUrl}/ticket/statuses`
    );
  }

  // Método adicional para actualizar tickets (si lo necesitas)
  updateTicket(
    ticketUuid: string,
    ticketData: Partial<CreateTicketRequest>
  ): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/ticket/${ticketUuid}`,
      ticketData
    );
  }

  // Método para eliminar tickets (si lo necesitas)
  deleteTicket(ticketUuid: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.apiUrl}/ticket/${ticketUuid}`
    );
  }

  // Método para actualizar usuario
  updateUser(userUuid: string, userData: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/user/${userUuid}`,
      userData
    );
  }
}
