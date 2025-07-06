import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {

  constructor(private http: HttpClient) { }

  // Método para obtener el título de una página externa
  getPageTitle(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'text' }).pipe(
      map(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.title || 'Página sin título';
      })
    );
  }

  // Método para obtener el título de la página actual
  getCurrentPageTitle(): string {
    return document.title;
  }
}
