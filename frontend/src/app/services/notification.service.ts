import { Injectable, ComponentRef, createComponent, ApplicationRef, Injector, EmbeddedViewRef, ComponentFactoryResolver, Type } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { NotificationComponent } from '../components/notification/notification.component';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {


  currentMessage = new BehaviorSubject<any>(null);
  token: string | null = null;


  constructor(
    private notification: NzNotificationService,
    private messaging: Messaging,
    private appRef: ApplicationRef,
    private injector: Injector,
    private http: HttpClient
  ) {}

  successNotification(arg0: string, arg1: string) {
    this.playNotificationSound();
    this.notification.success(arg0, arg1);
  }


  requestPermission() {
    return Notification.requestPermission()
      .then(permission => {
        if (permission === 'granted') {
          this.silentNotification('Notificaciones activadas', 'Ahora recibirás notificaciones de la aplicación');
          return this.getToken();
        }
        else{
          this.silentNotification('Notificaciones desactivadas', 'Activa las notificaciones para recibir alertas de la aplicación y no perderte de nada');
          return 'ungranted';
        }
      });
  }

  private getToken() {
    return getToken(this.messaging, {
      vapidKey: environment.firebase.apiKey,
    })
    .then(token => {
      if (token) {
        this.token = token;
        this.updateFcm(token).subscribe(
          {
            next: (success) => {
              if (success) {
               this.silentNotification('Notificaciones activadas', 'Ahora recibirás notificaciones de la aplicación');
              }
            },
            error: (error) => {
              this.silentNotification('Error al activar notificaciones', 'No se pudo activar las notificaciones, intenta más tarde' + error);
            }
          }
        );
        return token;
      }
      throw new Error('No token available');
    });
  }

  receiveMessage() {
    onMessage(this.messaging, (payload) => {
      this.fireNotification(
        payload.notification?.title??'New message',
        payload.notification?.body??'',
        payload.notification?.icon??'',
        payload.data??{}
      );
    });
  }

  errorNotification(title: string, message: string): void {
    this.playNotificationSound();
    this.notification.error(title, message);
  }

  silentNotification(title: string, message: string): void {
    this.notification.blank(title, message);
  }

  errorsNotification(errors: string[]): void {
    const messages = errors.map((error) => {
      return { message: error };
    });
    this.playNotificationSound();
    this.notification.error('Errores', messages.map((m) => m.message).join('<br>'));
  }

  warningNotification(title: string, message: string): void {
    this.playNotificationSound();
    this.notification.warning(title, message);
  }

  fireNotification(title: string, message: string, icon: string, data: any): void {
    this.playNotificationSound();
    const componentRef = this.createComponent(NotificationComponent);
    const instance = componentRef.instance;
    instance.title = title;
    instance.message = message;
    instance.icon = icon;
    instance.data = data;
    setTimeout(() => {
      const template = instance.fireTemplate;
      this.notification.template(template, { nzDuration: 5000 });

      setTimeout(() => {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
      }, 5000);
    });
  }

  private updateFcm(token: string): Observable<boolean> {
    return this.http.post<{ success: boolean }>(environment.updateFcmToken + "?token=" + token, {}).pipe(
      map((response) => response.success),
      catchError((error) => {
        console.error('Error updating FCM token:', error);
        return throwError(() => false);
      })
    );
  }

  private playNotificationSound(): void {
    const audio = new Audio('notification.mp3'); // Ruta al archivo de sonido
    audio.play().catch((error) => console.error('Error playing notification sound:', error));
  }

  private createComponent<T>(component: Type<T>): ComponentRef<T> {
    const componentRef = createComponent(component, {
      environmentInjector: this.appRef.injector,
      elementInjector: this.injector
    });

    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    document.body.appendChild(domElem);

    return componentRef;
  }

  infoNotification(arg0: string, arg1: string) {
    this.playNotificationSound();
    this.notification.info(arg0, arg1);
  }

}
