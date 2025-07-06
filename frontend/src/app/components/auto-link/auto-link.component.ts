import { Component, Input, OnInit } from '@angular/core';
import { PageTitleService } from '../../services/page-title-service.service';

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

  constructor(private pageTitleService: PageTitleService) { }

  ngOnInit() {
    if (this.url) {
      // Si es una URL externa, obtener el título
      if (this.isExternalUrl(this.url)) {
        this.pageTitleService.getPageTitle(this.url).subscribe(
          title => this.pageTitle = title,
          error => this.pageTitle = this.extractNameFromUrl(this.url)
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

  private extractNameFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/').filter(segment => segment);

      if (pathSegments.length > 0) {
        // Tomar el último segmento y formatearlo
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
