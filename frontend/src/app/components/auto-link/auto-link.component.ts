import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-auto-link',
  template: `
    <a [href]="url" target="_blank" rel="noopener noreferrer">
      {{ pageTitle || 'Cargando...' }}
    </a>
  `
})
export class AutoLinkComponent implements OnInit {
  @Input() url: string = '';
  pageTitle: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    if (this.url) {
      // Si es una URL externa, obtener el título
      if (this.isExternalUrl(this.url)) {
        this.getPageTitle(this.url).subscribe(
          title => this.pageTitle = title,
          error => this.pageTitle = 'Error al obtener título'
        );
      } else {
        // Si es una ruta interna, usar el nombre de la ruta
        this.pageTitle = this.extractNameFromUrl(this.url);
      }
    }
  }

  private isExternalUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  private getPageTitle(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'text' }).pipe(
      map(response => this.extractTitleFromHtml(response)),
      catchError(() => {
        // En caso de error, devolver un título por defecto
        return ['Error al obtener título'];
      })
    );
  }

  private extractTitleFromHtml(html: string): string {
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    return titleMatch ? titleMatch[1] : 'Sin título';
  }

  private extractNameFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/').filter(segment => segment);
      if (pathSegments.length > 0) {
        const lastSegment = pathSegments[pathSegments.length - 1];
        return this.formatSegmentName(lastSegment);
      }
      return urlObj.hostname || 'Página';
    } catch {
      // Si no es una URL válida, extraer el nombre del path
      const segments = url.split('/').filter(segment => segment);
      if (segments.length > 0) {
        return this.formatSegmentName(segments[segments.length - 1]);
      }
      return 'Página';
    }
  }

  private formatSegmentName(segment: string): string {
    return segment
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }
}
